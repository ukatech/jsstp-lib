import type { single_fmo_info_t , fmo_info_t } from "./fmo_info_t.d.ts";
import type ghost_events_queryer_t from "./ghost_events_queryer_t.d.ts";
import type sstp_info_t from "./sstp_info_t.d.ts";
import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type list_info_t from "./list_info_t.d.js";
import type { info_object } from "./info_object.d.ts";
import { security_level_t } from "../base/tools.js";

/**
 * sstp メソッド呼び出し元
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
	//_call Ts-index-excluder get_raw,with_type,bind_args_processor base_keyed_method_caller<T, Rest>
}
/**
 * 对调用参数进行简易处理的可扩展调用器
 * @group callers
 */
interface simple_keyed_method_caller<result_T> extends base_keyed_method_caller<result_T, any[]> {}
/**
 * 汎用イベント・コーラー  
 * イベントをトリガーするオブジェクトを渡すことで呼び出される！
 * @example
 * let caller=jsstp.get_caller_of_key("Event","OnTest");
 * //...
 * let data=await caller({
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 * //に相当する。
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
 * link jsstp_t} よりも ghost_info 属性が1つ多い。  
 * 特定のゴーストにメッセージを送るには {@link jsstp_t.default_info} の `ReceiverGhostHWnd` に依存する。
 * @see {@link jsstp_with_ghost_info_t.ghost_info}
 */
interface jsstp_with_ghost_info_t extends jsstp_t{
	/**
	 * このjsstp_tのインスタンスが指すゴーストに関する情報
	 */
	ghost_info: single_fmo_info_t
}
//定义一个包装器
/**
 * jsstpオブジェクト
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
	 * fecth のヘッダ
	 */
	RequestHeader: {
		[key: string]: string,
	};
	/**
	 * デフォルトのメッセージ内容
	 */
	default_info: {
		[key: string]: string,
	};

	/**
	 * SSTP プロトコルバージョン番号リスト
	 */
	sstp_version_table: {
		[method: string]: Number
	};
	/**
	 * デフォルトのセキュリティレベルを問い合わせます。nodejsでは "local"、ブラウザでは "external "です。
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;

	/**
	 * 自己弁護
	 */
	proxy: jsstp_t;

	/**
	 * 基本的なjsstpオブジェクト
	 * @param {String} sender_name オブジェクトがサーバーとやりとりする際の送信者名
	 * @param {String} host 宛先サーバーアドレス
	 * @returns {jsstp_t}
	 */
	/*@__PURE__*/constructor(sender_name?: String, host?: String);
	/**
	 * ホストの変更
	 * @param {string} host
	 * @group Properties
	 */
	set host(host: string);
	/*@__PURE__*/get host(): string;
	/**
	 * 送信者名を変更する
	 * @param {String} sender_name
	 * @group Properties
	 */
	set sendername(sender_name: String);
	/*@__PURE__*/get sendername(): String;

	/**
	 * 新しいjsstpオブジェクトをコピーする
	 * @group Clone Methods
	 */
	get clone(): jsstp_t;

	/**
	 * 与えられたfmo_infoに対して新しいjsstpオブジェクトをコピーする。
	 * @param fmo_info ターゲットゴーストのfm_info
	 * @returns {jsstp_t} ターゲットゴーストを指す新しいjsstpオブジェクト
	 * @group Clone Methods
	 */
	by_fmo_info(fmo_info: single_fmo_info_t): jsstp_with_ghost_info_t;

	/**
	 * すべてのゴーストのfmoinfoを処理する
	 * @param {Function|undefined} operation 操作函数
	 */
	for_all_ghost_infos<result_T>(operation: (fmo_info: single_fmo_info_t) => result_T): Promise<info_object<string,result_T>>;
	/**
	 * すべてのゴースト・オペレーション
	 * @param {Function|undefined} operation 操作函数
	 */
	for_all_ghosts<result_T>(operation: (jsstp: jsstp_with_ghost_info_t) => result_T): Promise<info_object<string,result_T>>;

	/**
	 * テキストでメッセージを送信し、テキストでそれを受信する
	 * @param {any} info メッセージ本文 (テキスト)
	 * @returns {Promise<String>} プロミスを返します。  
	 * @group Basic Send Methods
	 */
	row_send(info: any): Promise<String>;
	/**
	 * メッセージを送信するが、返された結果は処理しない。
	 * メッセージのヘッダー。
	 * @param {Object} info メッセージのボディ。
	 * @returns {Promise<String>} プロミスを返します。 
	 * @group Basic Send Methods
	 */
	costom_text_send(sstphead: String, info: Object): Promise<String>;
	/**
	 * @returns {Promise<sstp_info_t>} プロミスを返します。
	 * 发送报文
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @param {new (info: String)=> result_type} result_type 返回结果的类型，默认为sstp_info_t
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
	 * 単純な呼び出し元が指定されたイベントを取得するためのプロキシ
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
	 * イベントが存在するかどうかを判断する
	 * {@link ghost_events_queryer_t}（{@link jsstp_t.new_event_queryer}で取得）を使って、頻繁に呼び出されそうかどうかを問い合わせる。
	 * @param {String} event_name イベント名
	 * @param {String} security_level セキュリティレベル
	 * @returns {Promise<Boolean>} 存在するかどうかを返します。
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
	/*@__PURE__*/has_event(event_name: String, security_level?: String): Promise<Boolean>;
	/**
	 * サポートされているイベントを合意された構造で取得するには、ゴーストが `Get_Supported_Events` イベントをサポートしている必要があります。
	 * ゴーストのサポートが不明な場合は、{@link ghost_events_queryer_t}（{@link jsstp_t.new_event_queryer}で取得）を使用してクエリを実行する。
	 * @returns {Promise<{local:string[],external:string[]}>}ローカル配列と外部配列を含むオブジェクト。
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
	 * fmo情報を入手
	 * @returns {Promise<fmo_info_t>} fmoインフォメーション
	 * @example
	 * let fmo=await jsstp.get_fmo_infos();
	 * if(fmo.available)
	 * 	console.log(fmo);
	 */
	/*@__PURE__*/get_fmo_infos(): Promise<fmo_info_t>;
	/**
	 * 現在のホストの稼働状況を取得する
	 * @returns {Promise<Boolean>} ゴーストが利用可能かどうかのステータス
	 * @example
	 * if(await jsstp.available())
	 * 	//do something
	 * else
	 * 	console.error("ゴーストが利用できません。ゴーストが起動しているか確認してください。");
	 */
	/*@__PURE__*/available(): Promise<Boolean>;
	/**
	 * 現在のホストの稼働状況を取得する
	 * @param {(jsstp:jsstp_t)=>any} resolve ゴーストがいるときに実行される機能
	 * @returns {Promise<any>} ゴーストが利用可能ならjsstpで解決し、そうでなければ拒否する。
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
	 * ghostがサポートするイベントのクエリーを取得する
	 * @returns {Promise<ghost_events_queryer_t>} イベントをサポートするクエリへの問い合わせ
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
