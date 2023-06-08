//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

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
class sstp_info_t {
	#head;
	#unknown_lines;

	//构造函数
	constructor(info_head, info_body, unknown_lines) {
		this.set_head(info_head);
		this.#unknown_lines = unknown_lines;
		if (info_body) {
			if (info_body.keys)
				for (let key of info_body.keys())
					this[key] = info_body.get(key);
			else if (info_body instanceof Object)
				for (let key in info_body)
					this[key] = info_body[key];
			//否则记录错误
			else console.error("sstp_info_t: info_body is not a Map or object: " + typeof info_body);
		}
	}
	//自字符串报文构造
	static from_string(str) {
		let thehead = str.split("\r\n")[0];
		let thebody = new Map();
		let body = str.split("\r\n");
		body.shift();//去掉报文头
		let unknown_lines = [];
		let spliter_list = [": ", String.fromCharCode(1)];
		for (let line of body) {
			if (!line) continue;
			let spliter;
			for (let test_spliter of spliter_list)
				if (~line.indexOf(test_spliter)) {
					spliter = test_spliter;
					break;
				}
			if (spliter) {
				let key = line.split(spliter)[0];
				let value = line.replace(key + spliter, "");
				thebody.set(key, value);
			}
			else
				unknown_lines.push(body[i]);
		}
		return new sstp_info_t(thehead, thebody, unknown_lines);
	}
	//设置报文头
	set_head(head) {
		if (!head)
			head = "NOTIFY SSTP/1.1";
		this.#head = head;
	}
	//获取报文体
	get_body() {
		let body = new Map();
		for (let key in this)
			body.set(key, this[key]);
		return body;
	}
	//获取未知行
	get_unknown_lines() { return this.#unknown_lines; }
	//获取报文头
	get_head() { return this.#head; }
	//获取报文
	//注入toString方法便于使用
	toString() {
		let str = this.#head + "\r\n";
		for (let key in this)
			str += `${key}: ${this[key]}\r\n`;
		return str + "\r\n";
	}
	to_string() { return this.toString(); }//兼容命名
	//获取报头返回码
	return_code() {
		//比如：SSTP/1.4 200 OK，返回200
		let code_table = this.#head.split(" ");
		for (let i = 0; i < code_table.length; i++)
			if (!isNaN(code_table[i]))
				return parseInt(code_table[i]);
		return -1;
	}
	get_passthrough(key) { return this["X-SSTP-PassThru-" + key]; }
}

class sstp_fmo_info_t {
	//构造函数
	constructor(fmo_info = {}) {
		//fmo_info每个key的格式都是"uuid.属性名"
		for (let key in fmo_info) {
			let uuid = key.split(".")[0];
			let name = key.split(".")[1];
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
	keys() { return Object.keys(this); }
	length() { return this.keys().length; }
	available() { return !!this.length(); }
}

class ghost_events_queryer_t {
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
	available() { return this.#ghost_has_has_event; }
	get_supported_events_available() { return this.#ghost_has_get_supported_events; }
	async reset() {
		this.clear();
		this.#ghost_has_has_event = await this.#base_jsstp.has_event("Has_Event");
		this.#ghost_has_get_supported_events = await this.#base_jsstp.has_event("Get_Supported_Events");
		if (this.#ghost_has_get_supported_events)
			this.#ghost_event_list = await this.#base_jsstp.get_supported_events();
		return this;
	}
	async init() { return await this.reset(); }
	clear() {
		this.#ghost_has_has_event = false;
		this.#ghost_has_get_supported_events = false;
		this.#ghost_event_list = null;
		this.#ghost_event_list_cache = {
			local: {},
			external: {}
		};
	}
}

//定义一个包装器
class jsstp_t {
	#headers;
	#default_info;
	#host;

	constructor(sendername, host) {
		this.#headers = new Map();
		//初始化默认的host
		this.set_host(host);
		this.set_RequestHeader("Content-Type", "text/plain");
		//如果可以的话获取url并设置Origin
		this.set_RequestHeader("Origin", window.location.origin);//origin若为null则这句没有效果
		//初始化默认的报文
		this.#default_info = new Map();
		this.set_default_info("Charset", "UTF-8");
		this.set_sendername(sendername);
	}
	static #update_map(map, key, value) {
		if (value == null || value == "")
			map.delete(key);
		else
			map[key] = value;
	}
	//set_RequestHeader
	set_RequestHeader(key, value) { jsstp_t.#update_map(this.#headers, key, value); }
	//设置默认报文
	reset_default_info(info) { this.#default_info = info; }
	set_default_info(key, value) { jsstp_t.#update_map(this.#default_info, key, value); }
	//修改host
	set_host(host) {
		if (!host)
			host = "http://localhost:9801/api/sstp/v1";
		this.#host = host;
	}
	//修改sendername
	set_sendername(sendername) {
		if (!sendername)
			sendername = "jsstp-client";
		this.#default_info["Sender"] = sendername;
	}
	#base_post(data, callback) {
		//使用fetch发送数据
		const param = {
			method: "POST",
			headers: this.#headers,
			body: data
		};
		let call_base = (resolve, reject) => {
			fetch(this.#host, param).then(function (response) {
				if (response.status != 200)
					reject(response.status);
				else response.text().then(
					text => resolve(sstp_info_t.from_string(text))
				);
			});
		};
		if (callback)
			call_base(callback, function(){});
		//如果callback不存在，返回一个promise
		else
			return new Promise(call_base);
	}
	//发送报文
	costom_send(sstphead, info, callback) {
		if (info instanceof Object) {
			//获取报文
			let data = new sstp_info_t();
			data.set_head(sstphead);
			for (let key in this.#default_info) data[key] = this.#default_info[key];
			for (let key in info) data[key] = info[key];
			//使用base_post发送
			return this.#base_post(`${data}`, callback);
		}
		//否则记录错误
		else console.error("jsstp.send: wrong type of info: " + typeof info);
	}
	//发送报文
	//SEND SSTP/1.4
	SEND(info, callback) {
		return this.costom_send("SEND SSTP/1.4", info, callback);
	}
	//NOTIFY SSTP/1.1
	NOTIFY(info, callback) {
		return this.costom_send("NOTIFY SSTP/1.1", info, callback);
	}
	//COMMUNICATE SSTP/1.1
	COMMUNICATE(info, callback) {
		return this.costom_send("COMMUNICATE SSTP/1.1", info, callback);
	}
	//EXECUTE SSTP/1.2
	EXECUTE(info, callback) {
		return this.costom_send("EXECUTE SSTP/1.2", info, callback);
	}
	//GIVE SSTP/1.1
	GIVE(info, callback) {
		return this.costom_send("GIVE SSTP/1.1", info, callback);
	}
	//根据type发送报文
	by_type(type) { return eval("this." + type).bind(this); }
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
			Event: "Has_Event",
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
			Event: "Get_Supported_Events"
		});
		const local = info.get_passthrough("local");
		const external = info.get_passthrough("external");
		return {
			local: local ? local.split(",") : [],
			external: external ? external.split(",") : []
		};
	}
	async get_fmo_infos() {
		let fmo = {};
		try {
			fmo = await this.EXECUTE({
				Command: "GetFMO"
			});
		} catch(e) {}
		return new sstp_fmo_info_t(fmo);
	}
	async available() { return (await this.get_fmo_infos()).available(); }
	async new_event_queryer() { return await (new ghost_events_queryer_t(this)).init(); }
}

var jsstp = new jsstp_t();

//允许typo到jsttp
var jsttp = jsstp;
var jsttp_t = jsstp_t;
var sttp_info_t = sstp_info_t;
var sttp_fmo_info_t = sstp_fmo_info_t;
