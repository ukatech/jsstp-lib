import type { single_fmo_info_t , fmo_info_t } from "./fmo_info_t.d.ts";
import type ghost_events_queryer_t from "./ghost_events_queryer_t.d.ts";
import type sstp_info_t from "./sstp_info_t.d.ts";
import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type list_info_t from "./list_info_t.d.js";
import type { info_object } from "./info_object.d.ts";
import { security_level_t } from "../base/tools.js";

/**
 * sstp method caller
 * @group callers
 */
interface method_caller<T=sstp_info_t, Rest extends any[]=[Object]> {
	(...args: Rest): Promise<T>;
	get_raw(...args: Rest): Promise<String>;
	with_type<nT>(result_type: new (str:string) => nT): method_caller<nT, Rest>;
	bind_args_processor<nRest extends any[]>(processor: (...args: Rest) => Object): method_caller<T, nRest>;
}

/**
 * 可以通过成员访问扩充指定key值的拓展调用器
 * @group callers
 */
interface base_keyed_method_caller<T=sstp_info_t, Rest extends any[]=[Object]> extends method_caller<T, Rest> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: base_keyed_method_caller<T, Rest>
}
/**
 * 对调用参数进行简易处理的可扩展调用器
 * @group callers
 */
interface simple_keyed_method_caller<result_T> extends base_keyed_method_caller<result_T, any[]> {}
/**
 * Generic Event Caller  
 * Called by passing in an object to trigger an event!
 * @example
 * let caller=jsstp.get_caller_of_key("Event","OnTest");
 * //...
 * let data=await caller({
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 * //equivalent to
 * let data = await jsstp.SEND({
 * 	"Event": "OnTest",
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 * @group callers
 */
interface event_caller extends base_keyed_method_caller<sstp_info_t> {}
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
 * @group callers
 */
interface simple_event_caller extends simple_keyed_method_caller<sstp_info_t> {}

/**
 * 命令调用器
 * @example
 * let caller=jsstp.get_caller_of_key("Command","SetCookie");
 * //...
 * let data=await caller({
 * 	"Reference0": "abc",
 * 	"Reference1": "def"
 * });
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Command": "SetCookie",
 * 	"Reference0": "abc",
 * 	"Reference1": "def"
 * });
 * @group callers
 */
interface command_caller extends base_keyed_method_caller<sstp_info_t> {}
/**
 * 简易命令调用器
 * @example
 * let data=await jsstp.SetCookie("abc","def");
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Command": "SetCookie",
 * 	"Reference0": "abc",
 * 	"Reference1": "def"
 * });
 * @group callers
 */
interface simple_command_caller extends simple_keyed_method_caller<sstp_info_t> {}
/**
 * 列表返值命令执行器
 * @example
 * let caller=jsstp.get_caller_of_key("Command","GetNames");
 * //...
 * let data=await caller();
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Command": "GetNames"
 * });
 * @group callers
 */
interface list_command_caller extends base_keyed_method_caller<list_info_t> {}
/**
 * 对参数进行简易处理的列表返值命令执行器
 * @example
 * let data=await jsstp.GetNames();
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Command": "GetNames"
 * });
 * @group callers
 */
interface simple_list_command_caller extends simple_keyed_method_caller<list_info_t> {}

/**
 * One more ghost_info attribute than {@link jsstp_t}  
 * Relies on `ReceiverGhostHWnd` in {@link jsstp_t.default_info} to direct messages to a specific ghost.
 * @see {@link jsstp_with_ghost_info_t.ghost_info}
 */
interface jsstp_with_ghost_info_t extends jsstp_t{
	/**
	 * Information about the ghost pointed to by this instance of jsstp_t
	 */
	ghost_info: single_fmo_info_t
}
//Define a wrapper
/**
 * jsstp object
 * @see {@link jsstp}
 * @alias jsstp.type
 * @example
 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
 */
declare class jsstp_t{
	/**
	 * @group Types
	 */
	type: typeof jsstp_t;
	/**
	 * @group Types
	 */
	base_sstp_info_t: typeof base_sstp_info_t;
	/**
	 * @group Types
	 */
	sstp_info_t: typeof sstp_info_t;
	/**
	 * @group Types
	 */
	fmo_info_t: typeof fmo_info_t;
	/**
	 * @group Types
	 */
	list_info_t: typeof list_info_t;
	/**
	 * @group Types
	 */
	ghost_events_queryer_t: typeof ghost_events_queryer_t;

	/**
	 * @group SSTP Base Methods
	*/
	SEND: method_caller;
	/**
	 * @group SSTP Base Methods
	*/
	NOTIFY: method_caller;
	/**
	 * @group SSTP Base Methods
	*/
	COMMUNICATE: method_caller;
	/**
	 * @group SSTP Base Methods
	*/
	EXECUTE: method_caller;
	/**
	 * @group SSTP Base Methods
	*/
	GIVE: method_caller;

	/**
	 * 匹配事件名称以产生简易调用器
	 * @group Index reflactions
	 * @example
	 * let data=await jsstp.OnTest(123,"abc");
	 */
	[key: `On${string}`]: simple_event_caller;
	/**
	 * 匹配事件名称以产生简易调用器
	 * @group Index reflactions
	 * @example
	 * let data=await jsstp.GetNames();
	 */
	[key: `Get${string}`]: simple_list_command_caller;
	/**
	 * 匹配事件名称以产生简易调用器
	 * @group Index reflactions
	 * @example
	 * let data=await jsstp.SetCookie("abc","def");
	 */
	[key: `Set${string}`]: simple_command_caller;

	/**
	 * The header used in fecth.
	 */
	RequestHeader: {
		[key: string]: string,
	};
	/**
	 * Default Message Content
	 */
	default_info: {
		[key: string]: string,
	};

	/**
	 * SSTP protocol version number list
	 */
	sstp_version_table: {
		[method: string]: Number
	};
	/**
	 * Queries the default security level, which is "local" in nodejs and "external" in browsers.
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;

	/**
	 * Self Proxy
	 */
	proxy: jsstp_t;

	/**
	 * Basic jsstp object
	 * @param {String} sender_name The name of the sender when the object interacts with the server
	 * @param {String} host Target server address
	 * @returns {jsstp_t}
	 */
	/*@__PURE__*/constructor(sender_name?: String, host?: String);
	/**
	 * Modify host
	 * @param {string} host
	 * @group Properties
	 */
	set host(host: string);
	/*@__PURE__*/get host(): string;
	/**
	 * Modify sendername
	 * @param {String} sender_name
	 * @group Properties
	 */
	set sendername(sender_name: String);
	/*@__PURE__*/get sendername(): String;

	/**
	 * Copy a new jsstp object
	 * @group Clone Methods
	 */
	get clone(): jsstp_t;

	/**
	 * Copy a new jsstp object for the given fmo_info
	 * @param fmo_info fmo_info of target ghost
	 * @returns {jsstp_t} New jsstp object pointing to target ghost
	 * @group Clone Methods
	 */
	by_fmo_info(fmo_info: single_fmo_info_t): jsstp_with_ghost_info_t;

	/**
	 * Processing of fmoinfo for all ghosts
	 * @param {Function|undefined} operation Operator function
	 */
	for_all_ghost_infos<result_T>(operation: (fmo_info: single_fmo_info_t) => result_T): Promise<info_object<string,result_T>>;
	/**
	 * Operate on all ghosts
	 * @param {Function|undefined} operation Operator function
	 */
	for_all_ghosts<result_T>(operation: (jsstp: jsstp_with_ghost_info_t) => result_T): Promise<info_object<string,result_T>>;

	/**
	 * Sends a message in text and receives it back in text
	 * @param {any} info Message body (text)
	 * @returns {Promise<String>} Returns a promise.  
	 * @group Basic Send Methods
	 */
	row_send(info: any): Promise<String>;
	/**
	 * Sends the message, but does not process the returned results
	 * @param {String} sstphead The header of the message.
	 * @param {Object} info The body of the message.
	 * @returns {Promise<String>} Returns a promise.  
	 * @group Basic Send Methods
	 */
	costom_text_send(sstphead: String, info: Object): Promise<String>;
	/**
	 * Send message
	 * @param {String} sstphead Message header
	 * @param {Object} info The body of the message.
	 * @param {new (info: String)=> result_type} result_type 返回结果的类型，默认为sstp_info_t
	 * @returns {Promise<sstp_info_t>} 返回一个promise
	 * @group Basic Send Methods
	 */
	costom_send<T>(sstphead: String, info: Object, result_type: new (str: string) => T): Promise<T>;

	/**
	 * 获取指定方法的调用器
	 * @param {String} method_name 方法名称
	 * @param {new (info: String) => result_type} [result_type=sstp_info_t] 返回结果的类型，默认为sstp_info_t
	 * @param {Function} [args_processor=info => info] 参数处理器，默认直接返回输入参数
	 * @returns {method_caller} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_method<T=sstp_info_t,Rest extends any[]=[Object],Res=Object>(
		method_name: String, result_type?: new (str: string) => T, args_processor?: (...args: Rest) => Res
	): method_caller<T,Rest>;
	/**
	 * 获取指定key的调用器
	 * @param {String} key_name 键名
	 * @param {String} value_name 键值
	 * @param {Function} method_caller 方法调用器
	 * @param {Function} args_processor 参数处理器
	 * @returns {Proxy<value>} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_key<T=sstp_info_t,Rest extends any[]=[Object],Res=Object>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T,[Res]>,
		args_processor?: (...args: Rest) => Res
	): base_keyed_method_caller<T,Rest>;

	/**
	 * 用于获取指定key的简单调用器
	 * @param {String} key_name 键名
	 * @param {String} value_name 键值
	 * @param {Function} method_caller 方法调用器
	 * @returns {Proxy<value>} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_simple_caller_of_key<T=sstp_info_t>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T,[Object]>,
	): simple_keyed_method_caller<T>;
	/**
	 * Proxy for a simple caller to get a specified event
	 * @returns {Proxy}
	 * @example
	 * jsstp.event.OnTest("test");
	 * @group Indexer Members
	 */
	/*@__PURE__*/get event(): {
		[event_name: string]: simple_event_caller
	}
	/**
	 * 用于获取指定命令的执行器的代理
	 * @returns {Proxy}
	 * @example
	 * jsstp.command.GetFMO();
	 * @group Indexer Members
	 */
	/*@__PURE__*/get command(): {
		[command_name: string]: simple_command_caller
	}
	/**
	 * Determine if an event exists
	 * Use {@link ghost_events_queryer_t} (obtained via {@link jsstp_t.new_event_queryer}) to query if it is likely to be called frequently
	 * @param {String} event_name event_name
	 * @param {String} security_level security_level
	 * @returns {Promise<Boolean>} whether or not it exists
	 * @example
	 * jsstp.has_event("OnTest").then(result => console.log(result));
	 * @example
	 * //sample code (AYA):
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
	/*@__PURE__*/has_event(event_name: String, security_level?: String): Promise<Boolean>;
	/**
	 * Getting supported events in an agreed structure requires ghost to support `Get_Supported_Events` events
	 * If unsure of ghost support, use {@link ghost_events_queryer_t} (obtained via {@link jsstp_t.new_event_queryer}) to query
	 * @returns {Promise<{local:string[],external:string[]}>} Object containing both local and external arrays
	 * @example
	 * jsstp.get_supported_events().then(result => console.log(result));
	 * @example
	 * //sample code (AYA):
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
	 * Getting fmo information
	 * @returns {Promise<fmo_info_t>} fmo information
	 * @example
	 * let fmo=await jsstp.get_fmo_infos();
	 * if(fmo.available)
	 * 	console.log(fmo);
	 */
	/*@__PURE__*/get_fmo_infos(): Promise<fmo_info_t>;
	/**
	 * Get whether ghost is currently available
	 * @returns {Promise<Boolean>} whether ghost is available or not
	 * @example
	 * if(await jsstp.available())
	 * 	//do something
	 * else
	 * 	console.error("Ghost is not available, please check if ghost is running.");
	 */
	/*@__PURE__*/available(): Promise<Boolean>;
	/**
	 * Get whether ghost is currently available
	 * @param {(jsstp:jsstp_t)=>any} resolve Functions executed when ghost is available
	 * @returns {Promise<any>} whether ghost is available, if so, resolve with jsstp, otherwise reject.
	 * @example
	 * jsstp.if_available(() => {
	 * 	//do something
	 * });
	 * @example
	 * xxx.then(v => jsstp.if_available()).then(() => {
	 * 	//do something
	 * });
	 * @group PromiseLike Methods
	 */
	/*@__PURE__*/if_available<result_T=undefined>(resolve: (value?: jsstp_t) => result_T): Promise<result_T>;
	/**
	 * Get a queryer for querying events supported by ghost
	 * @returns {Promise<ghost_events_queryer_t>} Query the queryer for supported events.
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
