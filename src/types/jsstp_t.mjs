//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

import {
	assign,
	//endline,
	//undefined,

	Get_Supported_Events,
	Has_Event,
	get_simple_caller_of_event,
	default_info,

	is_event_name,
	get_reorganized_event_name,
	new_get_handler,

	my_origin,
	default_security_level
} from "../base.mjs";

import fmo_info_t from "./fmo_info_t.mjs";
import ghost_events_queryer_t from "./ghost_events_queryer_t.mjs";
import sstp_info_t from "./sstp_info_t.mjs";
import base_sstp_info_t from "./base_sstp_info_t.mjs";

//SSTP协议版本号列表
let sstp_version_table = {
	SEND: 1.4,
	NOTIFY: 1.1,
	COMMUNICATE: 1.1,
	EXECUTE: 1.2,
	GIVE: 1.1
};
/**
 * 根据方法名称获取SSTP协议头
 * @param {String} type 方法名称
 * @returns {String} SSTP协议头
 */
let get_sstp_header = (type) => `${type} SSTP/${sstp_version_table[type]}`;
//定义一个包装器
/**
 * jsstp对象
 * @see {@link jsstp}
 * @alias jsstp.type
 * @example
 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
 */
class jsstp_t {
	/**
	 * 对象与服务器交互时的发送者名称
	 * @type {String}
	 */
	#host;
	/**
	 * 对自身的代理
	 * @type {Proxy}
	 */
	proxy;
	RequestHeader;
	default_info;
	static sstp_version_table = sstp_version_table;
	/**
	 * 查询默认的安全等级，在nodejs中为"local"，在浏览器中为"external"
	 * @type {String}
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	static default_security_level = default_security_level;

	/**
	 * 基础jsstp对象
	 * @param {String} sendername 对象与服务器交互时的发送者名称
	 * @param {String} host 目标服务器地址
	 */
	/*@__PURE__*/constructor(sendername, host) {
		this.RequestHeader = {
			"Content-Type": "text/plain",
			"Origin": my_origin
		};
		this[default_info] = { Charset: "UTF-8" };

		this.host = host;
		this.sendername = sendername;
		this.proxy = new Proxy(this, {
			get: new_get_handler({
				string_key_handler: (target, key) => {
					if (key in sstp_version_table)
						return target.get_caller_of_method(key);
					if (is_event_name(key))
						return target[get_simple_caller_of_event](get_reorganized_event_name(key));
				}
			})
		});
		return this.proxy;
	}
	/**
	 * 修改host
	 * @param {string} host
	 */
	set host(host) { this.#host = host || "http://localhost:9801/api/sstp/v1"; }
	/*@__PURE__*/get host() { return this.#host; }
	/**
	 * 修改sendername
	 * @param {String} sendername
	 */
	set sendername(sendername) { this[default_info].Sender = sendername || "jsstp-client"; }
	/*@__PURE__*/get sendername() { return this[default_info].Sender; }
	/**
	 * 发送报文，但是不对返回结果进行处理
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @returns {Promise<String|undefined>} 返回一个promise  
	 * 若一切正常其内容为发送后得到的返回值，否则为`undefined`
	 */
	costom_text_send(sstphead, info) {
		//使用fetch发送数据
		return new Promise(
			(resolve, reject) =>
				fetch(this.host, {
					method: "POST",
					headers: this.RequestHeader,
					body: `${new sstp_info_t(sstphead, { ...this.default_info, ...info })}`
				}).then(response =>
					response.status != 200 ?
						reject(response.status) :
						response.text().then(resolve)
				).catch(reject)
		);
	}
	/**
	 * 发送报文
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @returns {Promise<sstp_info_t>} 返回一个promise
	 */
	async costom_send(sstphead, info) {
		return this.costom_text_send(sstphead, info).then(
			result => sstp_info_t.from_string(result)
		);
	}
	/**
	 * 获取指定方法的调用器
	 * @param {String} method_name 方法名称
	 * @returns {{
	 * 	(info: Object): Promise<sstp_info_t>,
	 * 	get_row(info: Object): Promise<String>
	 * }} 调用器
	 */
	/*@__PURE__*/get_caller_of_method(method_name) {
		let header = get_sstp_header(method_name);
		return assign((info) => this.costom_send(header, info), {
			get_row: (info) => this.costom_text_send(header, info)
		});
	}
	/**
	 * 获取指定事件的调用器
	 * @param {String} event_name 事件名称
	 * @param {String|undefined} method_name 方法名称
	 * @returns {(info: Object) => Promise<sstp_info_t>} 调用器
	 */
	/*@__PURE__*/get_caller_of_event(event_name, method_name = "SEND") {
		return (info) => this.proxy[method_name](assign({ Event: event_name }, info));
	}
	/**
	 * 用于获取指定事件的简单调用器
	 * @param {String} event_name 事件名称
	 * @param {String|undefined} method_name 方法名称
	 * @returns {(...args: any[]) => Promise<sstp_info_t>} 调用器
	 */
	/*@__PURE__*/get_simple_caller_of_event(event_name, method_name = "SEND") {
		return (...args) => {
			let reference_num = 0;
			let info = {};
			args.forEach((arg) =>
				info[`Reference${reference_num++}`] = arg
			);
			return this.get_caller_of_event(event_name, method_name)(info);
		};
	}
	/**
	 * 用于获取指定事件的简单调用器的代理
	 * @returns {Proxy}
	 * @example
	 * jsstp.event.OnTest("test");
	 */
	/*@__PURE__*/get event() {
		return new Proxy({}, {
			get: (_target, prop) => this[get_simple_caller_of_event](prop)
		});
	}
	/**
	 * 判断是否存在某个事件
	 * 若可能频繁调用，使用{@link ghost_events_queryer_t}（通过{@link jsstp_t.new_event_queryer}获取）来查询
	 * @param {String} event_name 事件名
	 * @param {String} security_level 安全等级
	 * @returns {Promise<Boolean>} 是否存在
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
	/*@__PURE__*/async has_event(event_name, security_level = default_security_level) {
		return this.event[Has_Event](event_name, security_level).then(({ Result }) => Result == "1");
	}
	/**
	 * 以约定好的结构获取支持的事件，需要ghost支持`Get_Supported_Events`事件
	 * 若不确定ghost的支持情况，使用{@link ghost_events_queryer_t}（通过{@link jsstp_t.new_event_queryer}获取）来查询
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
		return this.event[Get_Supported_Events]().then(({ local, external }) => (
			{
				local: (local || "").split(","),
				external: (external || "").split(",")
			}
		));
	}
	/**
	 * 获取fmo信息
	 * @returns {Promise<fmo_info_t>} fmo信息
	 * @example
	 * let fmo=await jsstp.get_fmo_infos();
	 * if(fmo.available)
	 * 	console.log(fmo);
	 */
	/*@__PURE__*/async get_fmo_infos() {
		return this.proxy.EXECUTE.get_row({
			Command: "GetFMO"
		}).then(
			fmo_text => new fmo_info_t(fmo_text)
		);
	}
	/**
	 * 获取当前ghost是否可用
	 * @returns {Promise<Boolean>} ghost是否可用
	 * @example
	 * if(await jsstp.available())
	 * 	//do something
	 * else
	 * 	console.error("ghost不可用,请检查ghost是否启动");
	 */
	/*@__PURE__*/async available() {
		return this.get_fmo_infos().then(fmo => fmo.available).catch(() => false);
	}
	/**
	 * 获取一个用于查询ghost所支持事件的queryer
	 * @returns {Promise<ghost_events_queryer_t>} 查询支持事件的queryer
	 * @example
	 * jsstp.new_event_queryer().then(queryer => 
	 * 	queryer.check_event("OnTest").then(result =>
	 * 		console.log(result)
	 * 	)
	 * );
	 */
	/*@__PURE__*/async new_event_queryer() { return (new ghost_events_queryer_t(this)).init(); }//省略await是合法的
}
//对定义中的所有类型补充到原型
//纯为了压缩体积（不然每个类型都要写一遍`static`）
assign(jsstp_t.prototype, {
	type: jsstp_t,
	base_sstp_info_t: base_sstp_info_t,
	sstp_info_t: sstp_info_t,
	fmo_info_t: fmo_info_t,
	ghost_events_queryer_t: ghost_events_queryer_t
});

export default jsstp_t;
