//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

//定义一个包装器
/**
 * @description sstp包装器
 * @example
 * jsstp.SEND({
 *   Event: "OnTest",
 *   Script: "\\s[0]Hell Wold!\\e"
 * });
 * @alias `jsstp`
 * @namespace jsstp
 * @type {jsstp.type}
 */
var jsstp = (/*@__PURE__*/()=>{
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
	/**
	 * @class sstp_info_t
	 * @description sstp报文类
	 * @example
	 * let info = jsstp.sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 * console.log(info.head);//SSTP/1.4 200 OK
	 * console.log(info.Option);//notranslate
	 * @alias `jsstp.sstp_info_t`
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
		 * @see {@link sstp_info_t.from_string}
		 */
		/*@__PURE__*/constructor(info_head, info_body, unknown_lines) {
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
		/*@__PURE__*/static from_string(str) {
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
		/*@__PURE__*/get unknown_lines() { return this.#unknown_lines; }
		//获取报文头
		/*@__PURE__*/get head() { return this.#head; }
		//获取报文
		//注入toString方法便于使用
		/*@__PURE__*/toString() {
			let str = this.#head + endline;
			for (let key in this)
				str += `${key}: ${this[key]}`+endline;
			return str + endline;
		}
		/*@__PURE__*/to_string() { return this.toString(); }//兼容命名
		/*@__PURE__*/toJSON() {
			let json = { head: this.#head, body: assign({},this) };
			if(this.#unknown_lines.length)
				json.unknown_lines = this.#unknown_lines;
			return json;
		}
		//获取报头返回码
		/*@__PURE__*/get return_code() {
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
		/*@__PURE__*/get_passthrough(key) { return this["X-SSTP-PassThru-" + key]; }
	}
	/**
	 * @class fmo_info_t
	 * @description fmo报文类
	 * @example
	 * let fmo = jsstp.get_fmo_infos();
	 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
	 * if(kikka_uuid)
	 *   console.log(fmo[kikka_uuid].ghostpath);
	 * @alias `jsstp.fmo_info_t`
	 * @see {@link jsstp.get_fmo_infos}
	 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
	 */
	class fmo_info_t{
		/**
		 * @param {sstp_info_t|Object} fmo_info
		 * @description 从sstp_info_t或Object构造fmo_info_t，不建议直接使用
		 */
		/*@__PURE__*/constructor(fmo_info = {}) {
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
		/*@__PURE__*/get_uuid_by(name, value) {
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
		/*@__PURE__*/get_list_of(name) {
			let list = [];
			for (let uuid in this)
				list.push(this[uuid][name]);
			return list;
		}
		/*@__PURE__*/get uuids() { return Object.keys(this); }
		/*@__PURE__*/get keys() { return this.uuids; }
		/*@__PURE__*/get length() { return this.keys.length; }
		/*@__PURE__*/get available() { return !!this.length; }
	}
	/**
	 * @class ghost_events_queryer_t
	 * @description ghost事件查询器
	 * @example
	 * let ghost_events_queryer = jsstp.new_event_queryer();
	 * if(!ghost_events_queryer.available)
	 *   console.log("当前ghost不支持事件查询");
	 * if(ghost_events_queryer.has_event("OnBoom"))
	 *   jsstp.send({
	 *     Event: "OnBoom"
	 *   });
	 * @alias `jsstp.ghost_events_queryer_t`
	 * @see {@link jsstp.new_event_queryer}
	 */
	class ghost_events_queryer_t{
		/**
		 * @type {jsstp_t}
		 * @description 基础{@link jsstp_t}对象
		 */
		#base_jsstp;
		/**
		 * @type {Boolean}
		 * @description 是否有`Has_Event`方法
		 */
		#ghost_has_has_event;
		/**
		 * @type {Boolean}
		 * @description 是否有`Get_Supported_Events`方法
		 */
		#ghost_has_get_supported_events;
		/**
		 * @type {{local:Array<String>,external:Array<String>}}
		 * @description 自`Get_Supported_Events`获取的事件列表
		 * @example 
		 * {
		 *     local:["On_connect","On_disconnect"],
		 *     external:["On_connect"]
		 * }
		 */
		#ghost_event_list;
		/**
		 * @type {{local:{String:Boolean},external:{String:Boolean}}}
		 * @description 自`Has_Event`获取的事件列表缓存
		 * @example 
		 * {
		 *     local:{On_connect:true,On_disconnect:true},
		 *     external:{On_connect:true}
		 * }
		 * @description 仅当`#ghost_has_get_supported_events`为false时有效
		 */
		#ghost_event_list_cache;

		/**
		 * @param {jsstp_t} base_jsstp
		 * @description 构造一个事件查询器
		 */
		/*@__PURE__*/constructor(base_jsstp = jsstp) {
			this.#base_jsstp = base_jsstp;
		}
		/**
		 * @param {String} event_name
		 * @param {String} security_level
		 * @returns {Promise<Boolean>}
		 * @description 检查事件是否存在，ghost至少需要`Has_Event`事件的支持，并可以通过提供`Get_Supported_Events`事件来提高效率
		 * @example
		 * let result = await ghost_events_queryer.check_event("On_connect");
		 * @see 基于 {@link jsstp_t.has_event} 和 {@link jsstp_t.get_supported_events}
		 */
		/*@__PURE__*/async check_event(event_name, security_level = local_str) {
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
		/*@__PURE__*/get available() { return this.#ghost_has_has_event; }
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
		/*@__PURE__*/get supported_events_available() { return this.#ghost_has_get_supported_events; }
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
	/**
	 * @class jsstp_t
	 * @description jsstp对象
	 * @see {@link jsstp}
	 * @alias `jsstp.type`
	 * @example
	 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
	 */
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
		/*@__PURE__*/constructor(sendername, host) {
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
		/*@__PURE__*/get host() { return this.#host; }
		//修改sendername
		/**
		 * @param {String} sendername
		 */
		set sendername(sendername) { this.default_info.Sender = sendername || "jsstp-client"; }
		/*@__PURE__*/get sendername() { return this.default_info.Sender; }
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
		 * @param {String} event_name 事件名
		 * @param {String} security_level 安全等级
		 * @returns {Promise<Boolean>} 是否存在
		 * @description
		 * 判断是否存在某个事件
		 * 若可能频繁调用，使用{@link ghost_events_queryer_t}（通过`jsstp.new_event_queryer()`获取）来查询
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
		/*@__PURE__*/async has_event(event_name, security_level = external_str) {
			let result = (await this.SEND({
				Event: has_event_event_name,
				Reference0: event_name,
				Reference1: security_level
			})).get_passthrough("Result");
			return !!result && result != "0";
		}
		/**
		 * @description
		 * 以约定好的结构获取支持的事件，需要ghost支持`Get_Supported_Events`事件
		 * 若不确定ghost的支持情况，使用{@link ghost_events_queryer_t}（通过`jsstp.new_event_queryer()`获取）来查询
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
		/*@__PURE__*/async get_supported_events() {
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
		/*@__PURE__*/async get_fmo_infos() {
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
		/*@__PURE__*/async available() { return (await this.get_fmo_infos()).available; }
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
		/*@__PURE__*/async new_event_queryer() { return (new ghost_events_queryer_t(this)).init(); }//省略await是合法的
		/**
		 * 发送`SEND`报文
		 * @param {Object} info 报文体
		 * @param {Function|undefined} callback 回调函数
		 * @returns {Promise<sstp_info_t>|undefined} 如果callback不存在，返回一个promise
		 */
		/*@__DECL__*/SEND(info, callback){};
		/**
		 * 发送`NOTIFY`报文
		 * @param {Object} info 报文体
		 * @param {Function|undefined} callback 回调函数
		 * @returns {Promise<sstp_info_t>|undefined} 如果callback不存在，返回一个promise
		 */
		/*@__DECL__*/NOTIFY(info, callback){};
		/**
		 * 发送`COMMUNICATE`报文
		 * @param {Object} info 报文体
		 * @param {Function|undefined} callback 回调函数
		 * @returns {Promise<sstp_info_t>|undefined} 如果callback不存在，返回一个promise
		 */
		/*@__DECL__*/COMMUNICATE(info, callback){};
		/**
		 * 发送`EXECUTE`报文
		 * @param {Object} info 报文体
		 * @param {Function|undefined} callback 回调函数
		 * @returns {Promise<sstp_info_t>|undefined} 如果callback不存在，返回一个promise
		 */
		/*@__DECL__*/EXECUTE(info, callback){};
		/**
		 * 发送`GIVE`报文
		 * @param {Object} info 报文体
		 * @param {Function|undefined} callback 回调函数
		 * @returns {Promise<sstp_info_t>|undefined} 如果callback不存在，返回一个promise
		 */
		/*@__DECL__*/GIVE(info, callback){};
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
	//对每个sstp操作进行封装并补充到原型
	for (let sstp_type in sstp_version_table)
		proto[sstp_type] = function(info, callback) {
			return this.costom_send(`${sstp_type} SSTP/${sstp_version_table[sstp_type]}`, info, callback);
		}
	//对定义中的所有类型补充到原型
	assign(proto,{
		type:jsstp_t,
		sstp_info_t:sstp_info_t,
		fmo_info_t:fmo_info_t,
		ghost_events_queryer_t:ghost_events_queryer_t
	});
	//返回jsstp_t实例以初始化jsstp
	return new jsstp_t();
})();
