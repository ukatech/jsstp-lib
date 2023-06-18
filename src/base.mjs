//一些会反复用到的常量或函数，提前定义以便在压缩时能够以短名称存在
let object = Object;
let assign = object.assign;
let endline = "\r\n";
let undefined;// =undefined

let Get_Supported_Events = "Get_Supported_Events";
let Has_Event = "Has_Event";
let get_supported_events = Get_Supported_Events.toLowerCase();
let has_event = Has_Event.toLowerCase();
let get_simple_caller_of_event = "get_simple_caller_of_event";
let trivial_clone = "trivial_clone";
let default_info = "default_info";
let [blocker, string_key_handler, symbol_key_handler, default_handler] = ["blocker", "string_key_handler", "symbol_key_handler", "default_handler"];

/**
 * 以spliter分割字符串str，只对第一个匹配的分隔符做分割
 * @param {String} str 需要分割的字符串
 * @param {String} spliter 分隔符
 * @returns {[String,String]} 分割后的字符串数组
 * @example
 * let [key,value] = key_value_split("key: value",": ");
 * @ignore
 */
let key_value_split = /*@__PURE__*/(str, spliter) => {
	let index = str.indexOf(spliter);
	return [str.substring(0, index), str.substring(index + spliter.length)];
}
/**
 * 判断某一string是否是事件名
 * @param {String} str 要判断的string
 * @returns {Boolean} 是否是事件名
 * @ignore
 */
let is_event_name = /*@__PURE__*/(str) => /^On/.test(str);
/**
 * 获取重整过的事件名
 * @param {String} str 要重整的事件名
 * @returns {String} 重整后的事件名
 * @ignore
 */
let get_reorganized_event_name = /*@__PURE__*/(str) => str[2] == "_" ? str.substring(3) : str;
/**
 * 判断一个数是否不是NaN
 * @param {Number} num 要判断的数
 * @returns {Boolean} 是否不是NaN
 * @ignore
 */
let is_not_nan = /*@__PURE__*/(num) => num == num;
/**
 * 对代理的get方法进行封装，使其定义更为简单
 * @param {{
 * 	blocker: undefined|(target,key:String|Symbol) =>Boolean,
 * 	string_key_handler:undefined|(target,key:String) =>any|undefined,
 * 	symbol_key_handler:undefined|(target,key:Symbol) =>any|undefined,
 * 	default_handler:undefined|(target,key:String|Symbol) =>any|undefined
 * }} info 代理的get方法的信息
 * @returns {(target, key:String|Symbol)=>any|undefined} 代理的get方法
 * @ignore
 */
let new_get_handler = /*@__PURE__*/(info) =>
	(target, key) => {
		if (info[blocker] && info[blocker](target, key))
			return;
		let result;
		if (Object(key) instanceof String)//string
			result = info[string_key_handler] && info[string_key_handler](target, key);
		else//symbol
			result = info[symbol_key_handler] && info[symbol_key_handler](target, key);
		if (result !== undefined)
			return result;
		else if (info[default_handler])
			return info[default_handler](target, key)
		return (result = target[key]) instanceof Function ? result.bind(target) : result;
	}

/**
 * 是否在浏览器中
 * @type {Boolean}
 * @ignore
 */
let in_browser = !!globalThis.window;

/**
 * 根据端口返回本地地址
 * @param {Number|undefined} [port] 端口，默认为9801
 * @returns {String} 本地地址
 * @ignore
 */
let get_local_address = (port) => `http://localhost:${port??9801}`;

/**
 * 默认的origin，在nodejs中为`http://localhost: env.PORT?? 9801`，在浏览器中为location.origin
 * @type {String}
 * @ignore
 */
let my_origin = in_browser ? location.origin : get_local_address(process.env.PORT);
/**
 * 默认的安全等级，视origin而定，如果是本地的话为local，否则为external
 * @type {String}
 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
 * @ignore
 */
let default_security_level = /^\w+:\/\/localhost/.test(my_origin) ? "local" : "external";

export {
	object,
	assign,
	endline,
	undefined,

	Get_Supported_Events,
	Has_Event,
	get_supported_events,
	has_event,
	get_simple_caller_of_event,
	trivial_clone,
	default_info,
	blocker,
	string_key_handler,
	symbol_key_handler,
	default_handler,

	key_value_split,
	is_event_name,
	get_reorganized_event_name,
	is_not_nan,
	new_get_handler,

	in_browser,
	get_local_address,
	my_origin,
	default_security_level
};
