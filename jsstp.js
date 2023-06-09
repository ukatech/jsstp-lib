//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

//定义一个包装器
var jsstp = (()=>{
	let has_event_event_name = "Has_Event";
	let get_supported_events_event_name = "Get_Supported_Events";
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
		#unknown_lines;

		//构造函数
		constructor(info_head, info_body, unknown_lines) {
			this.#head = `${info_head}`;
			this.#unknown_lines = unknown_lines || [];
			Object.assign(this, info_body);
		}
		//自字符串报文构造
		static from_string(str) {
			let [head,...lines] = str.split("\r\n");
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
			let str = this.#head + "\r\n";
			for (let key in this)
				str += `${key}: ${this[key]}\r\n`;
			return str + "\r\n";
		}
		to_string() { return this.toString(); }//兼容命名
		toJSON() {
			let json = { head: this.#head, body: Object.assign({},this) };
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
		get_passthrough(key) { return this["X-SSTP-PassThru-" + key]; }
	}
	class fmo_info_t{
		//构造函数
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
		get_uuid_by(name, value) {
			for (let uuid in this)
				if (this[uuid][name] == value)
					return uuid;
			return null;
		}
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
		#base_jsstp;
		#ghost_has_has_event;
		#ghost_has_get_supported_events;
		#ghost_event_list;
		#ghost_event_list_cache;

		constructor(base_jsstp = jsstp) {
			this.#base_jsstp = base_jsstp;
		}
		async check_event(event_name, security_level = "local") {
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
		get available() { return this.#ghost_has_has_event; }
		get supported_events_available() { return this.#ghost_has_get_supported_events; }
		async reset() {
			this.clear();
			this.#ghost_has_has_event = await this.#base_jsstp.has_event(has_event_event_name);
			this.#ghost_has_get_supported_events = await this.#base_jsstp.has_event(get_supported_events_event_name);
			if (this.#ghost_has_get_supported_events)
				this.#ghost_event_list = await this.#base_jsstp.get_supported_events();
			return this;
		}
		async init() { return this.reset(); }//省略await是合法的
		clear() {
			this.#ghost_has_has_event = false;
			this.#ghost_has_get_supported_events = false;
			this.#ghost_event_list = this.#ghost_event_list_cache = {
				local: {},
				external: {}
			};
		}
	}
	let update_info=(info, key, value)=>{
		if (value == null || value == "")
			delete info[key];
		else
			info[key] = value;
	}
	//定义一个包装器
	class jsstp_t{
		#headers;
		#default_info;
		#host;

		constructor(sendername, host) {
			this.#headers = {
				"Content-Type": "text/plain",
				"Origin": window.location.origin
			};
			this.#default_info = {Charset: "UTF-8"};

			this.host=host;
			this.sendername=sendername;
		}
		//set_RequestHeader
		set_RequestHeader(key, value) { update_info(this.#headers, key, value); }
		//设置默认报文
		/**
		 * @param {Object} info
		 */
		set default_info(info) { this.#default_info = info; }
		get default_info() { return this.#default_info; }
		set_default_info(key, value) { update_info(this.#default_info, key, value); }
		//修改host
		/**
		 * @param {string} host
		 */
		set host(host) { this.#host = host || "http://localhost:9801/api/sstp/v1"; }
		get host() { return this.#host; }
		//修改sendername
		/**
		 * @param {string} sendername
		 */
		set sendername(sendername) { this.#default_info.Sender = sendername || "jsstp-client"; }
		get sendername() { return this.#default_info.Sender; }
		//发送报文
		costom_send(sstphead, info, callback) {
			//获取报文
			let data = new sstp_info_t(sstphead,{...this.#default_info,...info});
			//使用fetch发送数据
			const param = {
				method: "POST",
				headers: this.#headers,
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
		//has_event
		/*
		示例代码(AYA):
		SHIORI_EV.On_Has_Event : void {
			_event_name=reference.raw[0]
			_SecurityLevel=reference.raw[1]
			if !_SecurityLevel
				_SecurityLevel=SHIORI_FW.SecurityLevel
			if SUBSTR(_event_name,0,2) != 'On'
				_event_name='On_'+_event_name
			_result=0
			if TOLOWER(_SecurityLevel) == 'external'
				_event_name='ExternalEvent.'+_event_name
			_result=ISFUNC(_event_name)
			if !_result
				_result=ISFUNC('SHIORI_EV.'+_event_name)
			SHIORI_FW.Make_X_SSTP_PassThru('Result',_result)
		}
		SHIORI_EV.ExternalEvent.On_Has_Event{
			SHIORI_EV.On_Has_Event
		}
		*/
		async has_event(event_name, security_level = "external") {
			const result = (await this.SEND({
				Event: has_event_event_name,
				Reference0: event_name,
				Reference1: security_level
			})).get_passthrough("Result");
			return !!result && result != "0";
		}
		/*
		示例代码(AYA):
		SHIORI_EV.On_Get_Supported_Events: void {
			_L=GETFUNCLIST('On')
			_base_local_event_funcs=IARRAY
			foreach _L;_func{
				if SUBSTR(_func,2,1) == '_'
					_func=SUBSTR(_func,3,STRLEN(_func))
				_base_local_event_funcs,=_func
			}
			_L=GETFUNCLIST('SHIORI_EV.On')
			foreach _L;_func{
				if SUBSTR(_func,12,1) == '_'
					_func=SUBSTR(_func,13,STRLEN(_func))
				_base_local_event_funcs,=_func
			}
			SHIORI_FW.Make_X_SSTP_PassThru('local',ARRAYDEDUP(_base_local_event_funcs))
			_L=GETFUNCLIST('ExternalEvent.On')
			_base_external_event_funcs=IARRAY
			foreach _L;_func{
				if SUBSTR(_func,16,1) == '_'
					_func=SUBSTR(_func,17,STRLEN(_func))
				_base_external_event_funcs,=_func
			}
			_L=GETFUNCLIST('SHIORI_EV.ExternalEvent.On')
			foreach _L;_func{
				if SUBSTR(_func,26,1) == '_'
					_func=SUBSTR(_func,27,STRLEN(_func))
				_base_external_event_funcs,=_func
			}
			SHIORI_FW.Make_X_SSTP_PassThru('external',ARRAYDEDUP(_base_external_event_funcs))
		}
		SHIORI_EV.ExternalEvent.On_Get_Supported_Events{
			SHIORI_EV.On_Get_Supported_Events
		}
		*/
		async get_supported_events() {
			const info = await this.SEND({
				Event: get_supported_events_event_name
			});
			const local = info.get_passthrough("local");
			const external = info.get_passthrough("external");
			return {
				local: (local||"").split(","),
				external: (external||"").split(",")
			};
		}
		async get_fmo_infos() {
			let fmo = {};
			try {
				fmo = await this.EXECUTE({
					Command: "GetFMO"
				});
			} catch(e) {}
			return new fmo_info_t(fmo);
		}
		async available() { return (await this.get_fmo_infos()).available; }
		async new_event_queryer() { return await (new ghost_events_queryer_t(this)).init(); }
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
	for (let sttp_type in sstp_version_table)
		proto[sttp_type] = function(info, callback) {
			return this.costom_send(`${sttp_type} SSTP/${sstp_version_table[sttp_type]}`, info, callback);
		}
	Object.assign(proto,{
		type:jsstp_t,
		sstp_info_t:sstp_info_t,
		fmo_info_t:fmo_info_t,
		ghost_events_queryer_t:ghost_events_queryer_t
	});
	return new jsstp_t();
})();
