import type { single_fmo_info_t, fmo_info_t } from "./fmo_info_t.d.ts";
import type ghost_events_queryer_t from "./ghost_events_queryer_t.d.ts";
import type sstp_info_t from "./sstp_info_t.d.ts";
import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type list_info_t from "./list_info_t.d.js";
import type { info_object } from "./info_object.d.ts";
import type { base_sstp_content_t, common_communicate_sstp_content_t, common_event_sstp_content_t, common_execute_sstp_content_t, common_give_sstp_content_t, security_level_t } from "../base/tools.d.ts";

/**
 * sstp方法调用器
 * @group 调用器
 */
interface method_caller<T = sstp_info_t, Rest extends any[] = [Object]> {
	(...args: Rest): Promise<T>;
	get_raw(...args: Rest): Promise<String>;
	with_type<nT>(result_type: new (str: string) => nT): method_caller<nT, Rest>;
	bind_args_processor<nRest extends any[]>(processor: (...args: Rest) => Object): method_caller<T, nRest>;
}

/**
 * 可以通过成员访问扩充指定key值的拓展调用器
 * @group 调用器
 */
interface base_keyed_method_caller<T = sstp_info_t, Rest extends any[] = [Object]> extends method_caller<T, Rest> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: base_keyed_method_caller<T, Rest>
}
/**
 * 对调用参数进行简易处理的可扩展调用器
 * @group 调用器
 */
interface simple_keyed_method_caller<result_T> extends base_keyed_method_caller<result_T, any[]> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: simple_keyed_method_caller<result_T>
}
/**
 * 通用事件调用器  
 * 调用时传入一个对象以触发事件！
 * @example
 * let caller=jsstp.get_caller_of_key("Event","OnTest");
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
 * @group 调用器
 */
interface event_caller extends base_keyed_method_caller<sstp_info_t> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: event_caller
}
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
 * @group 调用器
 */
interface simple_event_caller extends simple_keyed_method_caller<sstp_info_t> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: simple_event_caller
}
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
 * @group 调用器
 */
interface command_caller extends base_keyed_method_caller<sstp_info_t> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: command_caller
}
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
 * @group 调用器
 */
interface simple_command_caller extends simple_keyed_method_caller<sstp_info_t> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: simple_command_caller
}
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
 * @group 调用器
 */
interface list_command_caller extends base_keyed_method_caller<list_info_t> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: list_command_caller
}
/**
 * 对参数进行简易处理的列表返值命令执行器
 * @example
 * let data=await jsstp.GetNames();
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Command": "GetNames"
 * });
 * @group 调用器
 */
interface simple_list_command_caller extends simple_keyed_method_caller<list_info_t> {
	/**
	 * 扩展调用器
	 */
	[uuid: `some ${string}`]: simple_list_command_caller
}

/**
 * 比{@link jsstp_t}多了一个ghost_info属性  
 * 依赖{@link jsstp_t.default_info}中的`ReceiverGhostHWnd`定向给特定的ghost发送信息
 * @see {@link jsstp_with_ghost_info_t.ghost_info}
 */
interface jsstp_with_ghost_info_t extends jsstp_t {
	/**
	 * 该jsstp_t实例所指向的ghost的信息
	 */
	ghost_info: single_fmo_info_t
}
//定义一个包装器
/**
 * jsstp对象
 * @see {@link jsstp}
 * @alias jsstp.type
 * @example
 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
 */
declare class jsstp_t {
	/**
	 * jsstp对象
	 * @see {@link jsstp}
	 * @example
	 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
	 * @group 类型
	 * @see {@link jsstp_t}
	 */
	type: typeof jsstp_t;
	/**
	 * 基础sstp报文类
	 * @example
	 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 * console.log(info.head);//SSTP/1.4 200 OK
	 * console.log(info.Option);//notranslate
	 * @group 类型
	 * @see {@link base_sstp_info_t}
	 */
	base_sstp_info_t: typeof base_sstp_info_t;
	/**
	 * sstp报文类
	 * @example
	 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 * console.log(info.head);//SSTP/1.4 200 OK
	 * console.log(info.Option);//notranslate
	 * @group 类型
	 * @see {@link sstp_info_t}
	 */
	sstp_info_t: typeof sstp_info_t;
	/**
	 * fmo报文类
	 * @example
	 * let fmo = jsstp.get_fmo_infos();
	 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
	 * if(kikka_uuid)
	 * 	console.log(fmo[kikka_uuid].ghostpath);
	 * @see {@link jsstp_t.get_fmo_infos}
	 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
	 * @group 类型
	 * @see {@link fmo_info_t}
	 */
	fmo_info_t: typeof fmo_info_t;
	/**
	 * list报文对象
	 * @example
	 * let list = jsstp.GetNames();
	 * for(let name of list)
	 * 	console.log(name);
	 * @group 类型
	 * @see {@link list_info_t}
	 */
	list_info_t: typeof list_info_t;
	/**
	 * ghost事件查询器
	 * @example
	 * let ghost_events_queryer = jsstp.new_event_queryer();
	 * if(!ghost_events_queryer.available)
	 * 	console.log("当前ghost不支持事件查询");
	 * if(ghost_events_queryer.has_event("OnBoom"))
	 * 	jsstp.OnBoom();
	 * @see {@link jsstp_t.new_event_queryer}
	 * @group 类型
	 * @see {@link ghost_events_queryer_t}
	 */
	ghost_events_queryer_t: typeof ghost_events_queryer_t;

	/**
	 * @group SSTP基础通讯类型
	 * @see https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_send
	*/
	SEND: method_caller<sstp_info_t, [common_event_sstp_content_t]>;
	/**
	 * @group SSTP基础通讯类型
	 * @see https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_notify
	*/
	NOTIFY: method_caller<sstp_info_t, [common_event_sstp_content_t]>;
	/**
	 * @group SSTP基础通讯类型
	 * @see https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_communicate
	*/
	COMMUNICATE: method_caller<sstp_info_t, [common_communicate_sstp_content_t]>;
	/**
	 * @group SSTP基础通讯类型
	 * @see https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_execute
	*/
	EXECUTE: method_caller<sstp_info_t, [common_execute_sstp_content_t]>;
	/**
	 * @group SSTP基础通讯类型
	 * @see https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_give
	*/
	GIVE: method_caller<sstp_info_t, [common_give_sstp_content_t]>;

	/**
	 * 匹配事件名称以产生简易调用器
	 * @group 访问反射
	 * @example
	 * let data=await jsstp.OnTest(123,"abc");
	 */
	[key: `On${string}`]: simple_event_caller;
	/**
	 * 匹配事件名称以产生简易调用器
	 * @group 访问反射
	 * @example
	 * let data=await jsstp.GetNames();
	 */
	[key: `Get${string}`]: simple_list_command_caller;
	/**
	 * 匹配事件名称以产生简易调用器
	 * @group 访问反射
	 * @example
	 * let data=await jsstp.SetCookie("abc","def");
	 */
	[key: `Set${string}`]: simple_command_caller;

	/**
	 * 在fecth时使用的header
	 */
	RequestHeader: {
		[key: string]: string,
	};
	/**
	 * 默认的报文内容
	 */
	default_info: base_sstp_content_t;

	/**
	 * SSTP协议版本号列表
	 */
	sstp_version_table: {
		[method: string]: Number
	};
	/**
	 * 查询默认的安全等级，在nodejs中为"local"，在浏览器中为"external"
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;

	/**
	 * 自身代理
	 */
	proxy: jsstp_t;

	/**
	 * 基础jsstp对象
	 * @param {String} sender_name 对象与服务器交互时的发送者名称
	 * @param {String} host 目标服务器地址
	 * @returns {jsstp_t}
	 */
	/*@__PURE__*/constructor(sender_name?: String, host?: String);
	/**
	 * 修改host
	 * @param {string} host
	 * @group 属性
	 */
	set host(host: string);
	/*@__PURE__*/get host(): string;
	/**
	 * 修改sendername
	 * @param {String} sender_name
	 * @group 属性
	 */
	set sendername(sender_name: String);
	/*@__PURE__*/get sendername(): String;

	/**
	 * 复制一个新的jsstp对象
	 * @group 复制函数
	 */
	get clone(): jsstp_t;

	/**
	 * 复制一个新的jsstp对象对于给定的fmo_info
	 * @param fmo_info 目标ghost的fmo_info
	 * @returns {jsstp_t} 新的指向目标ghost的jsstp对象
	 * @group 复制函数
	 */
	by_fmo_info(fmo_info: single_fmo_info_t): jsstp_with_ghost_info_t;

	/**
	 * 对于所有ghost的fmoinfo进行处理
	 * @param {Function|undefined} operation 操作函数
	 */
	for_all_ghost_infos<result_T>(operation: (fmo_info: single_fmo_info_t) => result_T): Promise<info_object<string, result_T>>;
	/**
	 * 对于所有ghost进行操作
	 * @param {Function|undefined} operation 操作函数
	 */
	for_all_ghosts<result_T>(operation: (jsstp: jsstp_with_ghost_info_t) => result_T): Promise<info_object<string, result_T>>;

	/**
	 * 以文本发送报文并以文本接收返信
	 * @param {any} info 报文体（文本）
	 * @returns {Promise<String>} 返回一个promise
	 * @group 基础送信函数
	 */
	row_send(info: any): Promise<String>;
	/**
	 * 发送报文，但是不对返回结果进行处理
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @returns {Promise<String>} 返回一个promise
	 * @group 基础送信函数
	 */
	costom_text_send(sstphead: String, info: Object): Promise<String>;
	/**
	 * 发送报文
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @param {new (info: String)=> result_type} result_type 返回结果的类型，默认为sstp_info_t
	 * @returns {Promise<sstp_info_t>} 返回一个promise
	 * @group 基础送信函数
	 */
	costom_send<T>(sstphead: String, info: Object, result_type: new (str: string) => T): Promise<T>;

	/**
	 * 获取指定方法的调用器
	 * @param {String} method_name 方法名称
	 * @param {new (info: String) => result_type} [result_type=sstp_info_t] 返回结果的类型，默认为sstp_info_t
	 * @param {Function} [args_processor=info => info] 参数处理器，默认直接返回输入参数
	 * @returns {method_caller} 调用器
	 * @group 调用器生成函数
	 */
	/*@__PURE__*/get_caller_of_method<T = sstp_info_t, Rest extends any[] = [Object], Res = Object>(
		method_name: String, result_type?: new (str: string) => T, args_processor?: (...args: Rest) => Res
	): method_caller<T, Rest>;
	/**
	 * 获取指定key的调用器
	 * @param {String} key_name 键名
	 * @param {String} value_name 键值
	 * @param {Function} method_caller 方法调用器
	 * @param {Function} args_processor 参数处理器
	 * @returns {Proxy<value>} 调用器
	 * @group 调用器生成函数
	 */
	/*@__PURE__*/get_caller_of_key<T = sstp_info_t, Rest extends any[] = [Object], Res = Object>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T, [Res]>,
		args_processor?: (...args: Rest) => Res
	): base_keyed_method_caller<T, Rest>;

	/**
	 * 用于获取指定key的简单调用器
	 * @param {String} key_name 键名
	 * @param {String} value_name 键值
	 * @param {Function} method_caller 方法调用器
	 * @returns {Proxy<value>} 调用器
	 * @group 调用器生成函数
	 */
	/*@__PURE__*/get_simple_caller_of_key<T = sstp_info_t>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T, [Object]>,
	): simple_keyed_method_caller<T>;
	/**
	 * 用于获取指定事件的简单调用器的代理
	 * @returns {Proxy}
	 * @example
	 * jsstp.event.OnTest("test");
	 * @group 反射器成员
	 */
	/*@__PURE__*/get event(): {
		[event_name: string]: simple_event_caller
	}
	/**
	 * 用于获取指定命令的执行器的代理
	 * @returns {Proxy}
	 * @example
	 * jsstp.command.GetFMO();
	 * @group 反射器成员
	 */
	/*@__PURE__*/get command(): {
		[command_name: string]: simple_command_caller
	}
	/**
	 * 判断是否存在某个事件  
	 * 若可能频繁调用，使用{@link ghost_events_queryer_t}（通过{@link jsstp_t.new_event_queryer}获取）来查询
	 * @param {String} event_name 事件名
	 * @param {security_level_t} security_level 安全等级
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
	/*@__PURE__*/has_event(event_name: String, security_level?: security_level_t): Promise<Boolean>;
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
	 * @param {(jsstp:jsstp_t)=>any} resolve ghost可用时执行的函数
	 * @returns {Promise<any>} ghost是否可用，若可用则以jsstp为参数执行resolve，否则执行reject
	 * @example
	 * jsstp.if_available(() => {
	 * 	//do something
	 * });
	 * @example
	 * xxx.then(v => jsstp.if_available()).then(() => {
	 * 	//do something
	 * });
	 * @group 类Promise函数
	 */
	/*@__PURE__*/if_available<result_T = undefined>(resolve: (value?: jsstp_t) => result_T): Promise<result_T>;
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
