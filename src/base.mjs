//一些会反复用到的常量或函数，提前定义以便在压缩时能够以短名称存在

/**
 * @typename the_object
 * @type {ObjectConstructor}
 * @ignore
 */
let the_object = Object;
/**
 * @typename the_proxy
 * @type {ProxyConstructor}
 * @ignore
 */
let the_proxy = Proxy;
let assign = the_object.assign;
let endline = "\r\n";
let undefined;// =undefined

let Get_Supported_Events = "Get_Supported_Events";
let Has_Event = "Has_Event";
let get_supported_events = "get_supported_events";
let has_event = "has_event";
let get_simple_caller_of_event = "get_simple_caller_of_event";
let trivial_clone = "trivial_clone";
let default_info = "default_info";
let substring = "substring";
let length = "length";
let entries = "entries";
let proxy = "proxy";
let constructor = "constructor";
let then = "then";

let void_string = "";

/**
 * @typename the_string
 * @type {StringConstructor}
 * @ignore
 */
let the_string = void_string[constructor];

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
	return [str[substring](0, index), str[substring](index + spliter[length])];
}
/**
 * 判断某一string是否符合给定的正则表达式
 * @param {String} str 要判断的string
 * @param {RegExp} reg 正则表达式
 * @returns {Boolean} 是否符合给定的正则表达式
 * @inline 这个函数使用的还不够多，以至于它带来的字节减少还没有抵消它本身的定义，我们持续inline直到未来其收益为正
 * @ignore
 */
/*@__INLINE__*/let reg_test = /*@__PURE__*/(reg, str) => reg.test(str);
/**
 * 判断某一string是否是事件名
 * @param {String} str 要判断的string
 * @returns {Boolean} 是否是事件名
 * @ignore
 */
let is_event_name = /*@__PURE__*/(str) => /*@__INLINE__*/reg_test(/^On/, str);
/**
 * 获取重整过的事件名
 * @param {String} str 要重整的事件名
 * @returns {String} 重整后的事件名
 * @ignore
 */
let get_reorganized_event_name = /*@__PURE__*/(str) => str[2] == "_" ? str[substring](3) : str;
/**
 * 判断一个数是否不是NaN
 * @param {Number} num 要判断的数
 * @returns {Boolean} 是否不是NaN
 * @description 不使用Number.isNaN是为了节省压缩后字数
 * @ignore
 */
let is_not_nan = /*@__PURE__*/(num) => num == num;
/**
 * @typename the_function
 * @type {FunctionConstructor}
 * @ignore
 */
let the_function = is_not_nan[constructor];
/**
 * 将任意数据转换为字符串
 * @param {*} data 任意数据
 * @returns {String} 转换后的字符串
 * @inline 这个函数不会带来任何压缩收益，所以我们保持其inline以节省其定义所占空间
 * @ignore
 */
/*@__INLINE__*/let to_string = /*@__PURE__*/(data) => void_string + data;
/**
 * 对代理的get方法进行封装，使其定义更为简单
 * @param {{
 * 	_blocker_: undefined|(target,key:String|Symbol) =>Boolean,
 * 	_string_key_handler_:undefined|(target,key:String) =>any|undefined,
 * 	_symbol_key_handler_:undefined|(target,key:Symbol) =>any|undefined,
 * 	_default_handler_:undefined|(target,key:String|Symbol) =>any|undefined
 * }} info 代理的get方法的信息
 * @returns {(target, key:String|Symbol)=>any|undefined} 代理的get方法
 * @ignore
 */
let new_get_handler = /*@__PURE__*/(info) =>
	(target, key) => {
		/*
		the_function和the_string是为了节省压缩后字数而存在的，但是目前来说Function和String这两个东西只在这个函数有用到
		反而，引入这两个变量会导致压缩后的代码变大，所以在这个函数中我们仍然使用Function和String

		the_function和the_string的相关定义会作为dead code被优化掉
		*/
		if (info._blocker_ && info._blocker_(target, key))
			return;
		let result;
		if (the_object(key) instanceof String)//string
			result = info._string_key_handler_ && info._string_key_handler_(target, key);
		else//symbol
			result = info._symbol_key_handler_ && info._symbol_key_handler_(target, key);
		if (result !== undefined)
			return result;
		else if (info._default_handler_)
			return info._default_handler_(target, key)
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
let get_local_address = /*@__PURE__*/(port) => `http://localhost:${port??9801}`;

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
let default_security_level = /*@__INLINE__*/reg_test(/^\w+:\/\/localhost/, my_origin) ? "local" : "external";

export {
	the_object,
	the_proxy,
	the_function,
	the_string,
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
	length,
	entries,
	proxy,
	then,

	key_value_split,
	is_event_name,
	get_reorganized_event_name,
	is_not_nan,
	new_get_handler,
	reg_test,

	in_browser,
	get_local_address,
	my_origin,
	default_security_level,

	to_string,
	void_string
};
