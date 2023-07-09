//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain
import {
	the_proxy,

	assign,
	//endline,
	undefined,

	void_string,

	Get_Supported_Events,
	Has_Event,
	get_supported_events,
	has_event,
	get_simple_caller_of_event,
	default_info,
	default_security_level,
	sstp_version_table,
	available,
	forEach,
	costom_text_send,
	get_caller_of_method,
	get_caller_of_event,
	sendername,
	get_fmo_infos,
	split,
	proxy,
	then,
	prototype,
	from_string,
	RequestHeader,
	SEND,

	local,
	external,

	_false_,
} from "../base/value_table.mjs";
import {
	is_event_name,
	get_reorganized_event_name,
	new_get_handler,
	to_string,

	my_origin,
	get_local_address,
	my_default_security_level,
} from "../base/tools.mjs";

import fmo_info_t from "./fmo_info_t.mjs";
import ghost_events_queryer_t from "./ghost_events_queryer_t.mjs";
import sstp_info_t from "./sstp_info_t.mjs";
import base_sstp_info_t from "./base_sstp_info_t.mjs";

/**
 * 根据方法名称获取SSTP协议头
 * @param {String} type 方法名称
 * @param {Object} version_table SSTP协议版本号列表
 * @returns {String} SSTP协议头
 * @ignore
 */
var get_sstp_header = (type,version_table) => `${type} SSTP/${version_table[type]}`;

import{SEND as default_sstp_method}from"../base/value_table.mjs"

//定义一个包装器
/**
 * jsstp对象
 * @see {@link jsstp}
 * @alias jsstp.type
 * @example
 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
 */
class jsstp_t /*extends Function*/ {
	/**
	 * 对象与服务器交互时的发送者名称
	 * @type {String}
	 */
	#host;

	/**
	 * 基础jsstp对象
	 * @param {String} sender_name 对象与服务器交互时的发送者名称
	 * @param {String} host 目标服务器地址
	 */
	/*@__PURE__*/constructor(sender_name, host) {
		//super();
		this[RequestHeader] = {
			//"Content-Type": "text/plain",//省略Content-Type并不会导致sstp无法正常工作，还能压缩dist体积。
			"Origin": my_origin
		};
		this[default_info] = { Charset: "UTF-8" };//指定字符集，否则ssp会以本地字符集解码

		this.host = host;
		this[sendername] = sender_name;

		/**
		 * SSTP协议版本号列表
		 */
		this[sstp_version_table] = {
			[SEND]: 1.4,
			NOTIFY: 1.1,
			COMMUNICATE: 1.1,
			EXECUTE: 1.2,
			GIVE: 1.1
		};
		/**
		 * 查询默认的安全等级，在nodejs中为"local"，在浏览器中为"external"
		 * @type {String}
		 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
		 */
		this[default_security_level] = my_default_security_level;

		return this[proxy] = new the_proxy(this, {
			get: new_get_handler({
				_string_key_handler_: (target, key) =>
					(key in target[sstp_version_table]) ?
						target[get_caller_of_method](key) :
					(is_event_name(key)) ?
						target[get_simple_caller_of_event](get_reorganized_event_name(key)) :
					undefined
			}),
			/*
			//for useage like `new jsstp()`?
			apply: (target, thisArg, args) => {
				if(new.target) return new target.constructor(...args);
			}
			*/
		});
	}
	/**
	 * 修改host
	 * @param {string} host
	 * @group Properties
	 */
	set host(host) { this.#host = host || get_local_address()+"/api/sstp/v1"; }
	/*@__PURE__*/get host() { return this.#host; }
	/**
	 * 修改sendername
	 * @param {String} sender_name
	 * @group Properties
	 */
	set [sendername](sender_name) { this[default_info].Sender = sender_name || "jsstp-client"; }
	/*@__PURE__*/get [sendername]() { return this[default_info].Sender; }
	/**
	 * 以文本发送报文并以文本接收返信
	 * @param {any} info 报文体（文本）
	 * @returns {Promise<String|undefined>} 返回一个promise  
	 * 若一切正常其内容为发送后得到的返回值，否则为`undefined`
	 * @group Basic Send Methods
	 */
	row_send(info) {
		//使用fetch发送数据
		return new Promise(
			(resolve, reject) =>
				fetch(this.#host, {
					method: "POST",
					headers: this[RequestHeader],
					body: /*@__INLINE__*/to_string(info)
				})[then](response =>
					response.status != 200 ?
						reject(response.status) :
						response.text()[then](resolve),
					/*catch*/reject
				)
		);
	}
	/**
	 * 发送报文，但是不对返回结果进行处理
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @returns {Promise<String|undefined>} 返回一个promise  
	 * 若一切正常其内容为发送后得到的返回值，否则为`undefined`
	 * @group Basic Send Methods
	 */
	[costom_text_send](sstphead, info) {
		return this.row_send(new sstp_info_t(sstphead, { ...this[default_info], ...info }));
	}
	/**
	 * 发送报文
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @returns {Promise<sstp_info_t>} 返回一个promise
	 * @group Basic Send Methods
	 */
	costom_send(sstphead, info) {
		return this[costom_text_send](sstphead, info)[then](
			result => sstp_info_t[from_string](result)
		);
	}
	/**
	 * 获取指定方法的调用器
	 * @param {String} method_name 方法名称
	 * @returns {{
	 * 	(info: Object): Promise<sstp_info_t>,
	 * 	get_raw(info: Object): Promise<String>
	 * }} 调用器
	* @group Caller Methods
	 */
	/*@__PURE__*/[get_caller_of_method](method_name) {
		let header = get_sstp_header(method_name,this[sstp_version_table]);
		return assign((info) => this.costom_send(header, info), {
			get_raw: (info) => this[costom_text_send](header, info)
		});
	}
	/**
	 * 对指定事件名的调用器进行适当的包装
	 * 作用1：使得调用器可以像promise一样使用then方法
	 * 作用2：使得调用器可以通过属性追加事件名来获取新的调用器
	 * @param {String} event_name 事件名称
	 * @param {String|undefined} method_name 方法名称
	 * @param {Function} value 调用器的值
	 * @param {{[String]:(event_name: String, method_name: String)}} caller_factory 调用器工厂
	 * @returns {Proxy<value>} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/#warp_the_caller_of_event(event_name,method_name,value,caller_factory) {
		return new the_proxy(value, {
			get: (target, prop) => 
				prop in target ?
					target[prop] :
				//else
					this[caller_factory](event_name+"."+prop, method_name)
		});
	}
	/**
	 * 获取指定事件的调用器
	 * @param {String} event_name 事件名称
	 * @param {String|undefined} method_name 方法名称
	 * @returns {{(info: Object) => Promise<sstp_info_t>}} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/[get_caller_of_event](event_name, method_name = default_sstp_method) {
		return this.#warp_the_caller_of_event(
			event_name,
			method_name,
			(info) => this[proxy][method_name](assign({ Event: event_name }, info)),
			get_caller_of_event
		);
	}
	/**
	 * 用于获取指定事件的简单调用器
	 * @param {String} event_name 事件名称
	 * @param {String|undefined} method_name 方法名称
	 * @returns {{(info: Object) => Promise<sstp_info_t>}} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/[get_simple_caller_of_event](event_name, method_name = default_sstp_method) {
		return this.#warp_the_caller_of_event(
			event_name,
			method_name,
			(...args) => {
				let reference_num = 0;
				let info = {};
				args[forEach]((arg) =>
					info[`Reference${reference_num++}`] = arg
				);
				return this[get_caller_of_event](event_name, method_name)(info);
			},
			get_simple_caller_of_event
		);
	}
	/**
	 * 用于获取指定事件的简单调用器的代理
	 * @returns {Proxy}
	 * @example
	 * jsstp.event.OnTest("test");
	 * @group Indexer Members
	 */
	/*@__PURE__*/get event() {
		return new the_proxy({}, {
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
	/*@__PURE__*/[has_event](event_name, security_level = this[default_security_level]) {
		return this.event[Has_Event](event_name, security_level)[then](({ Result }) => Result == 1);
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
	/*@__PURE__*/[get_supported_events]() {
		return this.event[Get_Supported_Events]()[then](({ [local]:local_evt, [external]:external_evt }) => (
			{
				[local]: (local_evt || void_string)[split](","),
				[external]: (external_evt || void_string)[split](",")
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
	/*@__PURE__*/[get_fmo_infos]() {
		return this[proxy].EXECUTE.get_raw({
			Command: "GetFMO"
		})[then](
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
	/*@__PURE__*/[available]() {
		return this[get_fmo_infos]()[then](fmo => fmo[available],/*catch*/() => _false_);
	}
	/**
	 * 获取当前ghost是否可用
	 * @returns {Promise} ghost是否可用
	 * @example
	 * jsstp.then(() => {
	 * 	//do something
	 * });
	 * //or
	 * await jsstp;
	 * @group PromiseLike Methods
	 */
	/*@__PURE__*/[then](resolve, reject) {
		return this[available]()[then](result => 
			result ? resolve(this) : reject(),
			/*catch*/reject
		);
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
	/*@__PURE__*/new_event_queryer() { return (new ghost_events_queryer_t(this)).init(); }
}
//对定义中的所有类型补充到原型
//纯为了压缩体积（不然每个类型都要写一遍`static`）
assign(jsstp_t[prototype], {
	type: jsstp_t,
	base_sstp_info_t: base_sstp_info_t,
	sstp_info_t: sstp_info_t,
	fmo_info_t: fmo_info_t,
	ghost_events_queryer_t: ghost_events_queryer_t
});

export default jsstp_t;
