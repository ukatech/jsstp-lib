/**
 * Extend object to provide some simple and iterative operations.
 */
declare class info_object {
	/**
	 * @description Get an array of all keys
	 */
	/*@__PURE__*/get keys(): PropertyKey[];
	/**
	 * @description Get an array of all values
	 */
	/*@__PURE__*/get values(): any[];
	/**
	 * @description Get an array of all key-value pairs.
	 */
	/*@__PURE__*/get entries(): [PropertyKey, any][];
	/**
	 * @description Get the number of members
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * @description Execute a function for each key-value pair.
	 * @param {(value,key?)} func A function to be executed that replaces value if the return value is not undefined.
	 */
	/*@__PURE__*/forEach(func: (value: any, key?: PropertyKey) => any|undefined): void;
	/**
	 * @description Copy a new object
	 * @returns {info_object} Copied object
	 */
	/*@__PURE__*/get trivial_clone(): info_object;
	/**
	 * @description Traverses itself and its children and returns a one-dimensional array of traversal results.
	 * @param {(dimensions[...] ,value):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...PropertyKey[],any]) => T): T[];
	/**
	 * @description Traverses itself and returns a one-dimensional array of traversal results.
	 * @param {(value,key?):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/map<T>(func: (value: any, key?: PropertyKey) => T): T[];
	/**
	 * @description Append elements to itself as an array.
	 * @param {[undefined|[PropertyKey,any]]} array Array to append to.s
	 */
	/*@__PURE__*/push(array: [undefined|[PropertyKey, any]]): void;
}

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
 * Base sstp message class
 * @example
 * let info = jsstp.base_sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.base_sstp_info_t
 */
declare class base_sstp_info_t extends info_object {
	/**
	 * Constructing sstp_info_t from split string or object messages, is not recommended.
	 * @param {String} info_head The header of the message.
	 * @param {Object} info_body The body of the message in object format.
	 * @param {Array<String>|undefined} unknown_lines Array of unknown lines.
	 * @see {@link sstp_info_t.from_string}
	 * @ignore
	 */
	/*@__PURE__*/constructor(info_head: String, info_body: Object, unknown_lines?: String[]);
	/**
	 * Get array of unknown rows
	 * @returns {Array<String>} array of unknown rows
	 */
	/*@__PURE__*/get unknown_lines(): Array<String>;
	/**
	 * Get the header of the message
	 * @returns {String} message header
	 */
	/*@__PURE__*/get head(): String;
	//注入toString方法便于使用
	/**
	 * Getting a String Message
	 * @returns {String} String message.
	 * @ignore
	 */
	/*@__PURE__*/toString(): String;
	/**
	 * Getting a String Message
	 * @returns {String} String message.
	 */
	/*@__PURE__*/to_string(): String;
	/**
	 * Get the object to use for `JSON.stringify`.
	 * @returns {Object} The object to use for `JSON.stringify`.
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;
	/**
	 * Get header return code (`NaN` if unexpected)
	 * @returns {Number} header return code (`NaN` if unexpected)
	 */
	/*@__PURE__*/get status_code(): Number;
	/**
	 * 其他报文成员
	 * @type {any|undefined}
	 */
	[key: string]: any|undefined;
}

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
 * sstp message class
 * @example
 * let info = jsstp.sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.sstp_info_t
 */
declare class sstp_info_t extends base_sstp_info_t {
	/**
	 * Construct sstp_info_t from split string or object messages, not recommended to use directly
	 * @param {String} info_head The header of the message.
	 * @param {Object} info_body The body of the message in object format.
	 * @param {Array<String>|undefined} unknown_lines Array of unknown lines.
	 * @see {@link sstp_info_t.from_string}
	 * @returns {sstp_info_t}
	 * @ignore
	 */
	/*@__PURE__*/constructor(info_head: String, info_body: Object, unknown_lines?: String[]);
	/**
	 * Construct sstp_info_t from string
	 * @param {String} str String message.
	 * @returns {sstp_info_t} constructed sstp_info_t
	 * @example
	 * let info = sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 */
	/*@__PURE__*/static from_string(str: String): sstp_info_t;
	/**
	 * Get the value of PassThru
	 * @param {String} key The name of the PassThru to get.
	 * @returns {String|undefined} the value of PassThru
	 */
	/*@__PURE__*/get_passthrough(key: String): String | undefined;
	/**
	 * Get all PassThru
	 * @returns {info_object} all PassThru
	 */
	/*@__PURE__*/get passthroughs(): info_object;
	/**
	 * Get the original object
	 * @returns {sstp_info_t} raw object
	 */
	/*@__PURE__*/get raw(): sstp_info_t;

	//base_sstp_info_t的成员

	/**
	 * @description Get an array of all keys
	 */
	/*@__PURE__*/ get keys(): string[];
	/**
	 * @description Get an array of all values.
	 */
	/*@__PURE__*/ get values(): String[];
	/**
	 * @description Get an array of all key-value pairs.
	 */
	/*@__PURE__*/get entries(): [string, String][];
	/**
	 * @description Execute some function on each key-value pair.
	 * @param {(value,key?)} func The function to execute, replacing the original value if the return value is not undefined.
	 */
	/*@__PURE__*/forEach(func: (value: String, key?: string) => String|undefined): void;
	/**
	 * @description Iterates over itself and its children and returns a one-dimensional array of the results of the iteration.
	 * @param {(dimensions[...] ,value):any} func Function to be executed, the return value will be added to the array
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...string[],String]) => T): T[];
	/**
	 * @description Traverses itself and returns a one-dimensional array consisting of the results of the traversal.
	 * @param {(value,key?):any} func The function to be executed, the return value will be added to the array
	 */
	/*@__PURE__*/map<T>(func: (value: String, key?: string) => T): T[];
	/**
	 * @description Append elements to itself according to array
	 * @param {[undefined|[String,any]]} array Array to append to.
	 */
	/*@__PURE__*/push(array: [undefined|[string, String]]): void;

	/**
	 * Other message members
	 * @type {String|undefined}
	 */
	[key: string]: String | undefined;
}

/**
 * fmo message class
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @alias jsstp.fmo_info_t
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare class fmo_info_t extends base_sstp_info_t {
	/**
	 * Construct fmo_info_t from a string, not recommended for direct use
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name The name of the property to be checked.
	 * @param {String} value The value of the property to be checked.
	 * @returns {String|undefined} corresponding uuid (if any)
	 * @description Get the uuid of the fmo with the specified attribute and the value of the attribute is the specified value
	 * @example 
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description Equivalent to `this.uuids.find(uuid => this[uuid][name] == value)`
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description Gets the values of all the specified properties
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description Equivalent to `this.uuids.map(uuid => this[uuid][name])`
	 */
	/*@__PURE__*/get_list_of(name: String): Array<String>;
	/**
	 * @description Get all uuids
	 */
	/*@__PURE__*/get uuids(): Array<String>;
	/**
	 * @description Determining whether fmo is valid
	 */
	/*@__PURE__*/get available(): Boolean;
	//注入toString方法便于使用
	/**
	 * Getting a String Message
	 * @returns {String} String message.
	 * @ignore
	 */
	/*@__PURE__*/toString(): String;
	/**
	 * Get the object to use for `JSON.stringify`.
	 * @returns {Object} The object to use for `JSON.stringify`.
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;

	//base_sstp_info_t的成员

	/**
	 * @description Get an array of all keys
	 */
	/*@__PURE__*/get keys(): string[];
	/**
	 * @description Get an array of all values
	 */
	/*@__PURE__*/get values(): base_sstp_info_t[];
	/**
	 * @description Get an array of all key-value pairs.
	 */
	/*@__PURE__*/get entries(): [string, base_sstp_info_t][];
	/**
	 * @description Execute a function for each key-value pair.
	 * @param {(value,key?)} func A function to be executed that replaces value if the return value is not undefined.
	 */
	/*@__PURE__*/forEach(func: (value: base_sstp_info_t, key?: string) => base_sstp_info_t|undefined): void;
	/**
	 * @description Traverses itself and its children and returns a one-dimensional array of traversal results.
	 * @param {(dimensions[...] ,value):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...string[],base_sstp_info_t]) => T): T[];
	/**
	 * @description Traverses itself and returns a one-dimensional array of traversal results.
	 * @param {(value,key?):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/map<T>(func: (value: base_sstp_info_t, key?: string) => T): T[];
	/**
	 * @description Append an array to itself.
	 * @param {[undefined|[String,any]]} array The array to append.
	 */
	/*@__PURE__*/push(array: [undefined|[string, base_sstp_info_t]]): void;

	/**
	 * fmo members
	 * @type {base_sstp_info_t|undefined}
	 */
	[uuid: string]: base_sstp_info_t|undefined;
}

/**
 * sstp method caller
 */
interface method_caller{
	(info: Object): Promise<sstp_info_t>,
	get_raw(info: Object): Promise<String>
}

/**
 * event caller
 */
interface base_event_caller{
	[key: string]: base_event_caller,//扩展事件名称
}
/**
 * Simple event caller
 * Called directly to trigger an event!
 * @example
 * let data=await jsstp.OnTest(123,"abc");
 * //equivalent to
 * let data = await jsstp.SEND({
 * 	"Event": "OnTest",
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 */
interface simple_event_caller extends base_event_caller {
	(...args: any[]): Promise<sstp_info_t>,
	[key: string]: simple_event_caller,//扩展事件名称
}
/**
 * Generic Event Caller
 * Called by passing in an object to trigger an event!
 * @example
 * let caller=jsstp.get_caller_of_event("OnTest");
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
 */
interface common_event_caller extends base_event_caller{
	(info: Object): Promise<sstp_info_t>,
	[key: string]: common_event_caller,//扩展事件名称
}

//定义一个包装器
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
	 * Match event names to generate simple callers
	 * @group jsstp_event_members
	 * @example
	 * let data=await jsstp.OnTest(123,"abc");
	 */
	[key: `On${string}`]: simple_event_caller;

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
	 * @type {String}
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: String;

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
	 * Sends a message in text and receives it back in text
	 * @param {any} info Message body (text)
	 * @returns {Promise<String|undefined>} Returns a promise.  
	 * If everything is fine the content is the value returned after sending, otherwise it is `undefined`.
	 * @group Basic Send Methods
	 */
	row_send(info: any): Promise<String | undefined>;
	/**
	 * Sends the message, but does not process the returned results
	 * @param {String} sstphead The header of the message.
	 * @param {Object} info The body of the message.
	 * @returns {Promise<String|undefined>} Returns a promise.  
	 * If everything is OK it will be the value returned after sending, otherwise it will be `undefined`.
	 * @group Basic Send Methods
	 */
	costom_text_send(sstphead: String, info: Object): Promise<String | undefined>;
	/**
	 * Send message
	 * @param {String} sstphead Message header
	 * @param {Object} info The body of the message.
	 * @returns {Promise<sstp_info_t>} returns a promise
	 * @group Basic Send Methods
	 */
	costom_send(sstphead: String, info: Object): Promise<sstp_info_t>;
	
	/**
	 * Get the caller of the specified method
	 * @param {String} method_name method_name
	 * @returns {{
	 * 	(info: Object): Promise<sstp_info_t>,
	 * 	get_raw(info: Object): Promise<String>
	 * }} caller
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_method(method_name: String): method_caller;
	/**
	 * Get the caller of the specified event
	 * @param {String} event_name event_name
	 * @param {String|undefined} method_name method_name
	 * @returns {{(info: Object) => Promise<sstp_info_t>}} caller
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_event(event_name: String, method_name?: String): common_event_caller;
	/**
	 * Simple caller for getting the specified event
	 * @param {String} event_name event_name
	 * @param {String|undefined} method_name method_name
	 * @returns {{(info: Object) => Promise<sstp_info_t>}} caller
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_simple_caller_of_event(event_name: String, method_name?: String): simple_event_caller;
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
	 * @returns {Promise} whether ghost is available or not
	 * @example
	 * jsstp.then(() => {
	 * 	//do something
	 * });
	 * @group PromiseLike Methods
	 */
	/*@__PURE__*/then<result_T,reject_T>(resolve: (value?: jsstp_t) => result_T, reject?: (reason?: any) => reject_T): Promise<result_T|reject_T>;
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

/**
 * An extensible function type that can be initialised with a function for the more readable derived class function type
 */
declare class ExtensibleFunction<args_T extends Array<any>,return_T> extends Function {
	/**
	 * Initialising from a function instance
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	constructor(func: (...args: args_T) => return_T);
	/**
	 * Calls a function and replaces the function's this value with the specified object and the function's arguments with the specified array.
	 * @param thisArg The object that will be used as the this object.
	 * @param argArray A set of arguments to be passed to the function.
	 */
	apply(thisArg: (...args: args_T) => return_T, argArray?: args_T): return_T;

	/**
	 * Calls a method on an object that replaces the current object with another object.
	 * @param thisArg The object that will be used as the current object.
	 * @param argArray The list of arguments to be passed to the method.
	 */
	call(thisArg: (...args: args_T) => return_T, ...argArray: args_T): return_T;

	/**
	 * For a given function, creates a bound function with the same body as the original function.
	 * The this object of the bound function is associated with the specified object and has the specified initial argument.
	 * @param thisArg An object that the this keyword can refer to in the new function.
	 * @param argArray A list of arguments to be passed to the new function.
	 */
	bind(thisArg: (...args: args_T) => return_T, ...argArray: any): (...args: args_T) => return_T;
}

/**
 * ghost event finder: class definition implementation
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("Currently ghost does not support event queries");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @see {@link jsstp_t.new_event_queryer}
 */
declare class ghost_events_queryer_t_class_impl extends ExtensibleFunction<string[],Promise<Boolean>> {
	/**
	 * Constructing an Event Querier
	 * @param {jsstp_t} base_jsstp
	 * @returns {void}
	 */
	/*@__PURE__*/constructor(base_jsstp: jsstp_t);
	/**
	 * Queries the default security level, which is "local" in nodejs and "external" in browsers.
	 * @type {String}
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: String;
	/**
	 * To check for the existence of events, ghost requires at least `Has_Event` event support and can be made more efficient by providing `Get_Supported_Events` events
	 * @param {String} event_name
	 * @param {String|undefined} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer.check_event("On_connect");
	 * @see base on {@link jsstp_t.has_event} and {@link jsstp_t.get_supported_events}
	 */
	/*@__PURE__*/check_event(event_name: String, security_level?: String): Promise<Boolean>;
	/**
	 * Check if the event can be checked
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.available)
	 * 	console.error("Unable to check events");
	 */
	/*@__PURE__*/get available(): Boolean;
	/**
	 * Check if you can use `Get_Supported_Events` to quickly get a list of supported events
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.fast_query_available)
	 * 	console.info("Unable to quickly fetch list of supported events");
	 * else
	 * 	console.info("Hell yeah");
	 * @description If it's not supported it will just be slower, `check_event` will still work
	 */
	/*@__PURE__*/get fast_query_available(): Boolean;
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	reset(): Promise<ghost_events_queryer_t>;
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	init(): Promise<ghost_events_queryer_t>;
	clear(): void;
}
/**
 * ghost event finder: call signatures
 */
type ghost_events_queryer_t_call_signature = {
	/**
	 * Call declarations
	 * Check for the existence of events, ghost requires at least `Has_Event` event support and can be made more efficient by providing `Get_Supported_Events` events
	 * @param {String} event_name
	 * @param {String|undefined} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer("On_connect");
	 * @see based on {@link ghost_events_queryer_t.check_event}
	 */
	/*@__PURE__*/(event_name: String, security_level?: String): Promise<Boolean>;
}
/**
 * ghost event finder: constructor interface declaration
 */
type ghost_events_queryer_t_constructor = {
	/**
	 * Constructing an Event Querier
	 * @param {jsstp_t} base_jsstp
	 * @returns {void}
	 */
	/*@__PURE__*/new(base_jsstp: jsstp_t): ghost_events_queryer_t;
}
/**
 * ghost event finder
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("Currently ghost does not support event queries");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
declare const ghost_events_queryer_t: typeof ghost_events_queryer_t_class_impl & ghost_events_queryer_t_constructor;
/**
 * ghost event finder
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("Currently ghost does not support event queries");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
type ghost_events_queryer_t = ghost_events_queryer_t_class_impl & ghost_events_queryer_t_call_signature & {
	constructor: typeof ghost_events_queryer_t;
}

//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain



//Define a wrapper
/**
 * sstp wrapper
 * @example
 * jsstp.SEND({
 *   Event: "OnTest",
 *   Script: "\\s[0]Hell Wold!\\e"
 * });
 * @var jsstp
 * @type {jsstp_t}
 * @global
 */
declare var jsstp: jsstp_t;

export { base_sstp_info_t, jsstp as default, fmo_info_t, ghost_events_queryer_t, jsstp, jsstp_t, sstp_info_t };
