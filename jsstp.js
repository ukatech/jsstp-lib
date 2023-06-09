//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

//定义一个包装器
var jsstp = (()=>{
	//一些会反复用到的常量或函数，提前定义以便在压缩时能够以短名称存在
	let has_event_event_name = "Has_Event";
	let get_supported_events_event_name = "Get_Supported_Events";
	let assign=Object.assign;
	let endline="\r\n";
	let local_str = "local";
	let external_str = "external";
	//定义sstp报文类
	/*
	sstp报文格式：
	SEND SSTP/1.1
	Charset: UTF-8
	Sender: SSTPクライアント
	Script: \h\s0テストー。\u\s[10]テストやな。
	Option: notranslate
	由一行固定的报文头和一组可选的报文体组成，以\r\n换行，结尾以\r\n\r\n结束。
	*/
	class sstp_info_t{
		#head;
		/**
		 * @type {Array<String>}
		 * @description 未知行的数组
		 */
		#unknown_lines;

		/**
		 * 自拆分好的字符串报文或对象报文构造sstp_info_t，不建议直接使用
		 * @param {String} info_head 报文头
		 * @param {Object} info_body 对象格式的报文体
		 * @param {Array<String>} unknown_lines 未知行的数组
		 */
		constructor(info_head, info_body, unknown_lines) {
			this.#head = `${info_head}`;
			this.#unknown_lines = unknown_lines || [];
			assign(this, info_body);
		}
		/**
		 * @param {String} str 字符串报文
		 * @returns {sstp_info_t} 构造的sstp_info_t
		 * @description 从字符串构造sstp_info_t
		 * @example
		 * let info = sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
		 */
		static from_string(str) {
			let [head,...lines] = str.split(endline);
			let body = {};
			let unknown_lines = [];
			let spliter_list = [": ", String.fromCharCode(1)];
			for (let line of lines) {
				if (!line) continue;
				let spliter,index;
				for (let test_spliter of spliter_list)
					if (~(index=line.indexOf(test_spliter))) {
						spliter = test_spliter;
						break;
					}
				if (spliter) {
					let [key, value] = [line.slice(0, index), line.slice(index + spliter.length)];
					body[key] = value;
				}
				else
					unknown_lines.push(lines[i]);
			}
			return new sstp_info_t(head, body, unknown_lines);
		}
		//获取未知行
		get unknown_lines() { return this.#unknown_lines; }
		//获取报文头
		get head() { return this.#head; }
		//获取报文
		//注入toString方法便于使用
		toString() {
			let str = this.#head + endline;
			for (let key in this)
				str += `${key}: ${this[key]}`+endline;
			return str + endline;
		}
		to_string() { return this.toString(); }//兼容命名
		toJSON() {
			let json = { head: this.#head, body: assign({},this) };
			if(this.#unknown_lines.length)
				json.unknown_lines = this.#unknown_lines;
			return json;
		}
		//获取报头返回码
		get return_code() {
			//比如：SSTP/1.4 200 OK，返回200
			let code_table = this.#head.split(" ");
			for (let code in code_table)
				if (!isNaN(code))
					return parseInt(code);
			return -1;
		}
		/**
		 * @param {String} key 获取的PassThru名称
		 * @returns {String} PassThru的值
		 */
		get_passthrough(key) { return this["X-SSTP-PassThru-" + key]; }
	}
	class fmo_info_t{
		/**
		 * @param {sstp_info_t|Object} fmo_info
		 * @description 从sstp_info_t或Object构造fmo_info_t，不建议直接使用
		 */
		constructor(fmo_info = {}) {
			//fmo_info每个key的格式都是"uuid.属性名"
			for (let key in fmo_info) {
				let splited = key.split(".");
				let uuid = splited[0];
				let name = splited[1];
				if (!this[uuid]) this[uuid] = {};
				this[uuid][name] = fmo_info[key];
			}
		}
		/**
		 * @param {String} name 要检查的属性名
		 * @param {String} value 期望的属性值
		 * @returns {String|undefined} 对应的uuid（如果有的话）
		 * @description 获取具有指定属性且属性值为指定值的fmo的uuid
		 * @example 
		 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
		 */
		get_uuid_by(name, value) {
			for (let uuid in this)
				if (this[uuid][name] == value)
					return uuid;
		}
		/**
		 * @param {String} name
		 * @returns {Array<String>}
		 * @description 获取所有指定属性的值
		 * @example
		 * let ghost_list = fmo_info.get_list_of("name");
		 */
		get_list_of(name) {
			let list = [];
			for (let uuid in this)
				list.push(this[uuid][name]);
			return list;
		}
		get uuids() { return Object.keys(this); }
		get keys() { return this.uuids; }
		get length() { return this.keys.length; }
		get available() { return !!this.length; }
	}
	class ghost_events_queryer_t{
		/**
		 * @type {jsstp_t}
		 * @description 基础jsstp对象
		 */
		#base_jsstp;
		/**
		 * @type {Boolean}
		 * @description 是否有has_event方法
		 */
		#ghost_has_has_event;
		/**
		 * @type {Boolean}
		 * @description 是否有get_supported_events方法
		 */
		#ghost_has_get_supported_events;
		/**
		 * @type {{local:Array<String>,external:Array<String>}}
		 * @description 自get_supported_events获取的事件列表
		 * @example 
		 * {
		 *     local:["On_connect","On_disconnect"],
		 *     external:["On_connect"]
		 * }
		 */
		#ghost_event_list;
		/**
		 * @type {{local:{String:Boolean},external:{String:Boolean}}}
		 * @description 自has_event获取的事件列表缓存
		 * @example 
		 * {
		 *     local:{On_connect:true,On_disconnect:true},
		 *     external:{On_connect:true}
		 * }
		 * @description 仅当#ghost_has_get_supported_events为false时有效
		 */
		#ghost_event_list_cache;

		/**
		 * @param {jsstp_t} base_jsstp
		 * @description 构造一个事件查询器
		 */
		constructor(base_jsstp = jsstp) {
			this.#base_jsstp = base_jsstp;
		}
		/**
		 * @param {String} event_name
		 * @param {String} security_level
		 * @returns {Promise<Boolean>}
		 * @description 检查事件是否存在
		 * @example
		 * let result = await ghost_events_queryer.check_event("On_connect");
		 * @see `jsstp_t.has_event`|`jsstp_t.get_supported_events`
		 */
		async check_event(event_name, security_level = local_str) {
			if (this.#ghost_has_get_supported_events)
				return this.#ghost_event_list[security_level].includes(event_name);
			else if (this.#ghost_has_has_event) {
				let charge = this.#ghost_event_list_cache[security_level][event_name];
				if (charge != undefined)
					return charge;
				let result = await this.#base_jsstp.has_event(event_name);
				this.#ghost_event_list_cache[security_level][event_name] = result;
				return result;
			}
			else
				return false;
		}
		/**
		 * @returns {Promise<Boolean>}
		 * @description 检查是否能够检查事件
		 * @example
		 * if(!ghost_events_queryer.available)
		 *    console.error("无法检查事件");
		 */
		get available() { return this.#ghost_has_has_event; }
		/**
		 * @returns {Promise<Boolean>}
		 * @description 检查是否能够使用get_supported_events快速获取支持的事件列表
		 * @example
		 * if(!ghost_events_queryer.supported_events_available)
		 *   console.info("无法快速获取支持的事件列表");
		 * else
		 *   console.info("好哦");
		 * @description 如果不支持也只是会变慢，`check_event`仍然可以使用
		 */
		get supported_events_available() { return this.#ghost_has_get_supported_events; }
		/**
		 * @returns {Promise<ghost_events_queryer_t>} this
		 */
		async reset() {
			this.clear();
			let jsstp = this.#base_jsstp;
			this.#ghost_has_has_event = await jsstp.has_event(has_event_event_name);
			this.#ghost_has_get_supported_events = await jsstp.has_event(get_supported_events_event_name);
			if (this.#ghost_has_get_supported_events)
				this.#ghost_event_list = await jsstp.get_supported_events();
			return this;
		}
		async init() { return this.reset(); }//省略await是合法的
		clear() {
			this.#ghost_has_has_event = false;
			this.#ghost_has_get_supported_events = false;
			this.#ghost_event_list_cache = {
				local: {},
				external: {}
			};
		}
	}
	//定义一个包装器
	class jsstp_t{
		/**
		 * @type {String}
		 * @description 对象与服务器交互时的发送者名称
		 */
		#host;
		RequestHeader;
		default_info;

		/**
		 * @description 基础jsstp对象
		 * @param {String} sendername 对象与服务器交互时的发送者名称
		 * @param {String} host 目标服务器地址
		 */
		constructor(sendername, host) {
			this.RequestHeader = {
				"Content-Type": "text/plain",
				"Origin": window.location.origin
			};
			this.default_info = {Charset: "UTF-8"};

			this.host=host;
			this.sendername=sendername;
		}
		//修改host
		/**
		 * @param {string} host
		 */
		set host(host) { this.#host = host || "http://localhost:9801/api/sstp/v1"; }
		get host() { return this.#host; }
		//修改sendername
		/**
		 * @param {String} sendername
		 */
		set sendername(sendername) { this.default_info.Sender = sendername || "jsstp-client"; }
		get sendername() { return this.default_info.Sender; }
		/**
		 * 发送报文
		 * @param {String} sstphead 报文头
		 * @param {Object} info 报文体
		 * @param {Function|undefined} callback 回调函数
		 * @returns {Promise<sstp_info_t>|undefined} 如果callback不存在，返回一个promise
		 */
		costom_send(sstphead, info, callback) {
			//获取报文
			let data = new sstp_info_t(sstphead,{...this.default_info,...info});
			//使用fetch发送数据
			let param = {
				method: "POST",
				headers: this.RequestHeader,
				body: `${data}`
			};
			let call_base = (resolve, reject) => {
				fetch(this.#host, param).then(response=>{
					if (response.status != 200)
						reject(response.status);
					else response.text().then(
						text => resolve(sstp_info_t.from_string(text))
					);
				});
			};
			if (callback)
				call_base(callback, ()=>{});
			//如果callback不存在，返回一个promise
			else
				return new Promise(call_base);
		}
		/**
		 * @param {String} event_name
		 * @param {String} security_level
		 * @returns {Promise<Boolean>}
		 * @description 判断是否存在某个事件
		 * @example
		 * jsstp.has_event("OnTest").then(result => console.log(result));
		 * @example
		 * //示例代码(AYA):
		 * SHIORI_EV.On_Has_Event : void {
		 * 	_event_name=reference.raw[0]
		 * 	_SecurityLevel=reference.raw[1]
		 * 	if !_SecurityLevel
		 * 		_SecurityLevel=SHIORI_FW.SecurityLevel
		 * 	if SUBSTR(_event_name,0,2) != 'On'
		 * 		_event_name='On_'+_event_name
		 * 	_result=0
		 * 	if TOLOWER(_SecurityLevel) == 'external'
		 * 		_event_name='ExternalEvent.'+_event_name
		 * 	_result=ISFUNC(_event_name)
		 * 	if !_result
		 * 		_result=ISFUNC('SHIORI_EV.'+_event_name)
		 * 	SHIORI_FW.Make_X_SSTP_PassThru('Result',_result)
		 * }
		 * SHIORI_EV.ExternalEvent.On_Has_Event{
		 * 	SHIORI_EV.On_Has_Event
		 * }
		 */
		async has_event(event_name, security_level = external_str) {
			let result = (await this.SEND({
				Event: has_event_event_name,
				Reference0: event_name,
				Reference1: security_level
			})).get_passthrough("Result");
			return !!result && result != "0";
		}
		/**
		 * @description 以约定好的结构获取支持的事件
		 * @returns {Promise<{local:string[],external:string[]}>} 包含local和external两个数组的Object
		 * @example
		 * jsstp.get_supported_events().then(result => console.log(result));
		 * @example
		 * //示例代码(AYA):
		 * SHIORI_EV.On_Get_Supported_Events: void {
		 * 	_L=GETFUNCLIST('On')
		 * 	_base_local_event_funcs=IARRAY
		 * 	foreach _L;_func{
		 * 		if SUBSTR(_func,2,1) == '_'
		 * 			_func=SUBSTR(_func,3,STRLEN(_func))
		 * 		_base_local_event_funcs,=_func
		 * 	}
		 * 	_L=GETFUNCLIST('SHIORI_EV.On')
		 * 	foreach _L;_func{
		 * 		if SUBSTR(_func,12,1) == '_'
		 * 			_func=SUBSTR(_func,13,STRLEN(_func))
		 * 		_base_local_event_funcs,=_func
		 * 	}
		 * 	SHIORI_FW.Make_X_SSTP_PassThru('local',ARRAYDEDUP(_base_local_event_funcs))
		 * 	_L=GETFUNCLIST('ExternalEvent.On')
		 * 	_base_external_event_funcs=IARRAY
		 * 	foreach _L;_func{
		 * 		if SUBSTR(_func,16,1) == '_'
		 * 			_func=SUBSTR(_func,17,STRLEN(_func))
		 * 		_base_external_event_funcs,=_func
		 * 	}
		 * 	_L=GETFUNCLIST('SHIORI_EV.ExternalEvent.On')
		 * 	foreach _L;_func{
		 * 		if SUBSTR(_func,26,1) == '_'
		 * 			_func=SUBSTR(_func,27,STRLEN(_func))
		 * 		_base_external_event_funcs,=_func
		 * 	}
		 * 	SHIORI_FW.Make_X_SSTP_PassThru('external',ARRAYDEDUP(_base_external_event_funcs))
		 * }
		 * SHIORI_EV.ExternalEvent.On_Get_Supported_Events{
		 * 	SHIORI_EV.On_Get_Supported_Events
		 * }
		 */
		async get_supported_events() {
			let info = await this.SEND({
				Event: get_supported_events_event_name
			});
			let local = info.get_passthrough(local_str);
			let external = info.get_passthrough(external_str);
			return {
				local: (local||"").split(","),
				external: (external||"").split(",")
			};
		}
		/**
		 * @description 获取fmo信息
		 * @returns {Promise<fmo_info_t>} fmo信息
		 * @example
		 * jsstp.get_fmo_infos().then(result => console.log(result));
		 */
		async get_fmo_infos() {
			let fmo = {};
			try {
				fmo = await this.EXECUTE({
					Command: "GetFMO"
				});
			} catch(e) {}
			return new fmo_info_t(fmo);
		}
		/**
		 * @description 获取当前ghost是否可用
		 * @returns {Promise<Boolean>} ghost是否可用
		 * @example
		 * if(await jsstp.available())
		 * 	//do something
		 * else
		 * 	console.error("ghost不可用,请检查ghost是否启动");
		 */
		async available() { return (await this.get_fmo_infos()).available; }
		/**
		 * @description 获取一个用于查询ghost所支持事件的queryer
		 * @returns {Promise<ghost_events_queryer_t>} 查询支持事件的queryer
		 * @example
		 * jsstp.new_event_queryer().then(queryer => 
		 *  queryer.check_event("OnTest").then(result =>
		 *   console.log(result)
		 *  )
		 * );
		 */
		async new_event_queryer() { return (new ghost_events_queryer_t(this)).init(); }//省略await是合法的
	};
	//初始化所有的sstp操作
	let sstp_version_table = {
		SEND: "1.4",
		NOTIFY: "1.1",
		COMMUNICATE: "1.1",
		EXECUTE: "1.2",
		GIVE: "1.1"
	};
	let proto = jsstp_t.prototype;
	for (let sstp_type in sstp_version_table)
		proto[sstp_type] = function(info, callback) {
			return this.costom_send(`${sstp_type} SSTP/${sstp_version_table[sstp_type]}`, info, callback);
		}
	assign(proto,{
		type:jsstp_t,
		sstp_info_t:sstp_info_t,
		fmo_info_t:fmo_info_t,
		ghost_events_queryer_t:ghost_events_queryer_t
	});
	return new jsstp_t();
})();
