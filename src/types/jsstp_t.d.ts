import fmo_info_t from "./fmo_info_t.d.ts";
import ghost_events_queryer_t from "./ghost_events_queryer_t.d.ts";
import sstp_info_t from "./sstp_info_t.d.ts";
import base_sstp_info_t from "./base_sstp_info_t.d.ts";

/**
 * 任何事件名称或其一部分！
 */
type event_body=string;
/**
 * 匹配事件名称
 */
type event_name=`On${event_body}`;

/**
 * sstp方法调用器
 */
interface method_caller{
	(info: Object): Promise<sstp_info_t>,
	get_raw(info: Object): Promise<String>
};

/**
 * 事件调用器
 */
interface base_event_caller{
	then(resolve: (result: sstp_info_t)=>any, reject: (reason?: any)=>any): Promise<any>,
	[key: event_body]: base_event_caller,//扩展事件名称
};
/**
 * 简易事件调用器
 * 直接调用以触发事件！
 * @example
 * let data=await jsstp.OnTest(123,"abc");
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Event": "OnTest",
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 */
interface simple_event_caller extends base_event_caller{
	(...args: any[]): Promise<sstp_info_t>,
	[key: event_body]: simple_event_caller,//扩展事件名称
};
/**
 * 通用事件调用器
 * 调用时传入一个对象以触发事件！
 * @example
 * let caller=jsstp.get_caller_of_event("OnTest");
 * //...
 * let data=await caller({
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Event": "OnTest",
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 */
interface common_event_caller extends base_event_caller{
	(info: Object): Promise<sstp_info_t>,
	[key: event_body]: common_event_caller,//扩展事件名称
};

interface jsstp_types{
	type: class,
	base_sstp_info_t: class,
	sstp_info_t: class,
	fmo_info_t: class,
	ghost_events_queryer_t: class
};
interface jsstp_base_methods{
	SEND: method_caller,
	NOTIFY: method_caller,
	COMMUNICATE: method_caller,
	EXECUTE: method_caller,
	GIVE: method_caller,
};
//定义一个包装器
/**
 * jsstp对象
 * @see {@link jsstp}
 * @alias jsstp.type
 * @example
 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
 */
declare class jsstp_t implements jsstp_types, jsstp_base_methods {
	//interface jsstp_types
	type=jsstp_t;
	base_sstp_info_t=base_sstp_info_t;
	sstp_info_t=sstp_info_t;
	fmo_info_t=fmo_info_t;
	ghost_events_queryer_t=ghost_events_queryer_t;

	//interface jsstp_base_methods
	SEND: method_caller;
	NOTIFY: method_caller;
	COMMUNICATE: method_caller;
	EXECUTE: method_caller;
	GIVE: method_caller;

	//proxy
	[key: event_name]: simple_event_caller;

	/**
	 * 对象与服务器交互时的发送者名称
	 * @type {String}
	 */
	#host: String;

	/**
	 * 基础jsstp对象
	 * @param {String} sender_name 对象与服务器交互时的发送者名称
	 * @param {String} host 目标服务器地址
	 */
	/*@__PURE__*/constructor(sender_name: String, host: String): jsstp_t;
	/**
	 * 修改host
	 * @param {string} host
	 */
	set host(host: string): void;
	/*@__PURE__*/get host(): string;
	/**
	 * 修改sendername
	 * @param {String} sender_name
	 */
	set sendername(sender_name: String): void;
	/*@__PURE__*/get sendername(): String;
	/**
	 * 以文本发送报文并以文本接收返信
	 * @param {Any} info 报文体（文本）
	 * @returns {Promise<String|undefined>} 返回一个promise  
	 * 若一切正常其内容为发送后得到的返回值，否则为`undefined`
	 */
	row_send(info: Any): Promise<String | undefined>;
	/**
	 * 发送报文，但是不对返回结果进行处理
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @returns {Promise<String|undefined>} 返回一个promise  
	 * 若一切正常其内容为发送后得到的返回值，否则为`undefined`
	 */
	costom_text_send(sstphead: String, info: Object): Promise<String | undefined>;
	/**
	 * 发送报文
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @returns {Promise<sstp_info_t>} 返回一个promise
	 */
	costom_send(sstphead: String, info: Object): Promise<sstp_info_t>;
	
	/**
	 * 获取指定方法的调用器
	 * @param {String} method_name 方法名称
	 * @returns {{
	 * 	(info: Object): Promise<sstp_info_t>,
	 * 	get_raw(info: Object): Promise<String>
	 * }} 调用器
	 */
	/*@__PURE__*/get_caller_of_method(method_name: String): method_caller;
	/**
	 * 对指定事件名的调用器进行适当的包装
	 * 作用1：使得调用器可以像promise一样使用then方法
	 * 作用2：使得调用器可以通过属性追加事件名来获取新的调用器
	 * @param {String} event_name 事件名称
	 * @param {String|undefined} method_name 方法名称
	 * @param {Function} value 调用器的值
	 * @param {{[String]:(event_name: String, method_name: String)}} caller_factory 调用器工厂
	 * @returns {base_event_caller} 调用器
	 */
	/*@__PURE__*/#warp_the_caller_of_event(event_name: String, method_name: String, value: Function, caller_factory: { [String]: (event_name: String, method_name: String) => any }): base_event_caller;
	/**
	 * 获取指定事件的调用器
	 * @param {String} event_name 事件名称
	 * @param {String|undefined} method_name 方法名称
	 * @returns {{
	 * 	(info: Object) => Promise<sstp_info_t>
	 * 	then(
	 * 		resolve: (Function) => any,
	 * 		reject: (Boolean|any) => any
	 * 	): Promise<any>
	 * }} 调用器
	 */
	/*@__PURE__*/get_caller_of_event(event_name: String, method_name?: String): common_event_caller;
	/**
	 * 用于获取指定事件的简单调用器
	 * @param {String} event_name 事件名称
	 * @param {String|undefined} method_name 方法名称
	 * @returns {{
	 * 	(...args: any[]) => Promise<sstp_info_t>
	 * 	then(
	 * 		resolve: (Function) => any,
	 * 		reject: (Boolean|any) => any
	 * 	): Promise<any>
	 * }} 调用器
	 */
	/*@__PURE__*/get_simple_caller_of_event(event_name: String, method_name?: String): simple_event_caller;
	/**
	 * 用于获取指定事件的简单调用器的代理
	 * @returns {Proxy}
	 * @example
	 * jsstp.event.OnTest("test");
	 */
	/*@__PURE__*/get event(): {
		[event_name: String]: simple_event_caller
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
	/*@__PURE__*/[has_event](event_name: String, security_level?: String): Promise<Boolean>;
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
	/*@__PURE__*/get_supported_events(): Promise<{
		local: string[],
		external: string[]
	}>;
	/**
	 * 获取fmo信息
	 * @returns {Promise<fmo_info_t>} fmo信息
	 * @example
	 * let fmo=await jsstp.get_fmo_infos();
	 * if(fmo.available)
	 * 	console.log(fmo);
	 */
	/*@__PURE__*/get_fmo_infos(): Promise<fmo_info_t>;
	/**
	 * 获取当前ghost是否可用
	 * @returns {Promise<Boolean>} ghost是否可用
	 * @example
	 * if(await jsstp.available())
	 * 	//do something
	 * else
	 * 	console.error("ghost不可用,请检查ghost是否启动");
	 */
	/*@__PURE__*/available(): Promise<Boolean>;
	/**
	 * 获取当前ghost是否可用
	 * @returns {Promise} ghost是否可用
	 * @example
	 * jsstp.then(() => {
	 * 	//do something
	 * });
	 * //or
	 * await jsstp;
	 */
	/*@__PURE__*/then(resolve: (value?: jsstp_t) => any, reject?: (reason?: any) => any): Promise<any>;
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
	/*@__PURE__*/new_event_queryer(): Promise<ghost_events_queryer_t>;
}

export default jsstp_t;
