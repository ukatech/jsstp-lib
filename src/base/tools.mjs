import { 
	the_object,
	the_proxy,
	the_string,
	the_function,
	undefined,

	void_string,
	
	substring,
	length,
	prototype,
	assign,
} from "./value_table.mjs"

import{local,external}from"./base_values.mjs";

/**
 * 以spliter分割字符串str，只对第一个匹配的分隔符做分割
 * @param {String} str 需要分割的字符串
 * @param {String} spliter 分隔符
 * @returns {[String,String]} 分割后的字符串数组
 * @example
 * var [key,value] = key_value_split("key: value",": ");
 * @ignore
 */
var key_value_split = /*@__PURE__*/(str, spliter) => {
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
/*@__INLINE__*/var reg_test = /*@__PURE__*/(reg, str) => reg.test(str);
/**
 * 判断某一string是否是事件名
 * @param {String} str 要判断的string
 * @returns {Boolean} 是否是事件名
 * @ignore
 */
var is_event_name = /*@__PURE__*/(str) => /*@__INLINE__*/reg_test(/^On/, str);
/**
 * 获取重整过的事件名
 * @param {String} str 要重整的事件名
 * @returns {String} 重整后的事件名
 * @ignore
 */
var get_reorganized_event_name = /*@__PURE__*/(str) => str[2] == "_" ? str[substring](3) : str;
/**
 * 判断一个数是否不是NaN
 * @param {Number} num 要判断的数
 * @returns {Boolean} 是否不是NaN
 * @description 不使用Number.isNaN是为了节省压缩后字数
 * @ignore
 */
var is_not_nan = /*@__PURE__*/(num) => num == num;
/**
 * 将任意数据转换为字符串
 * @param {*} data 任意数据
 * @returns {String} 转换后的字符串
 * @inline 这个函数不会带来任何压缩收益，所以我们保持其inline以节省其定义所占空间
 * @ignore
 */
/*@__INLINE__*/var to_string = /*@__PURE__*/(data) => void_string + data;
/**
 * 判断给定值是否为X类型
 * @param {*} value 要判断的值
 * @param {Function} X X类型
 * @returns {Boolean} 是否为X类型
 * @ignore
 */
var type_judge = /*@__PURE__*/(value, X) => the_object(value) instanceof X;
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
var new_get_handler = /*@__PURE__*/(info) =>
	(target, key) => {
		/*
		the_function和the_string是为了节省压缩后字数而存在的，但是目前来说Function和String这两个东西只在这个函数有用到
		反而，引入这两个变量会导致压缩后的代码变大，所以在这个函数中我们仍然使用Function和String

		the_function和the_string的相关定义会作为dead code被优化掉
		*/
		if (info._blocker_?.(target, key))
			return;
		let result;
		if (type_judge(key, the_string))
			result = info._string_key_handler_?.(target, key);
		else//symbol
			result = info._symbol_key_handler_?.(target, key);
		if (result !== undefined)
			return result;
		else if (info._default_handler_)
			return info._default_handler_(target, key)
		return type_judge(result = target[key], the_function) ? result.bind(target) : result;
	}
/**
 * 更合适的默认代理setter
 * @param {Object} target 要代理的对象
 * @param {String|Symbol} key 要代理的键
 * @param {*} value 要代理的值
 * @returns {Number} 1
 * @ignore
 */
var default_setter = (target, key, value)=>((target[key] = value),1);
/**
 * 根据getter信息创建一个代理
 * @param {Object} target 要代理的对象
 * @param {{
 * 	_blocker_: undefined|(target,key:String|Symbol) =>Boolean,
 * 	_string_key_handler_:undefined|(target,key:String) =>any|undefined,
 * 	_symbol_key_handler_:undefined|(target,key:Symbol) =>any|undefined,
 * 	_default_handler_:undefined|(target,key:String|Symbol) =>any|undefined
 * }} getter_info 代理的get方法的信息
 * @param {Object} other_info 其他信息
 * @returns {Proxy} 代理
 * @ignore
 */
var new_getter_proxy = (target, getter_info, other_info) => new the_proxy(target,assign({
	get: new_get_handler(getter_info),
	set: default_setter
},other_info));
/**
 * 一个可用函数初始化的可扩展的函数类型，用于更为可读的派生类函数类型
 */
class ExtensibleFunction extends the_function {
	/**
	 * 自函数实例初始化
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	constructor(func) {
		return the_object.setPrototypeOf(func, new.target[prototype]);
	}
}

/**
 * 以给定的多个索引索引某个对象
 * @param {Object} obj 要索引的对象
 * @param  {Array<String|Symbol>} keys 索引
 * @returns {*} 索引后的对象
 * @ignore
 */
var index_by_keys = /*@__PURE__*/(obj, ...keys) => {
	for (let key of keys)
		obj = obj[key];
	return obj;
}
/**
 * 扔出一个错误
 */
var throw_error = /*@__PURE__*/(error) => { throw error; }

/**
 * 根据端口返回本地地址
 * @param {Number|undefined} [port] 端口，默认为9801
 * @returns {String} 本地地址
 * @ignore
 */
var get_local_address = /*@__PURE__*/(port) => `http://localhost:${port??9801}`;

/**
 * 默认的origin，在nodejs中为`http://localhost: env.PORT?? 9801`，在浏览器中为location.origin
 * @type {String}
 * @ignore
 */
var my_origin = globalThis.window ? location.origin : get_local_address(process.env.PORT);//尽管globalThis.self也可以做到同样的事情（并且可以在压缩后的代码中节省2字节）
//但是为了避免node今后实现self，我们使用window
//node大概率不会实现window，因为多数代码都在使用windows判断是否在浏览器中
//这样做还能兼容html4！...大概？

/**
 * 默认的安全等级，视origin而定，如果是本地的话为local，否则为external
 * @type {String}
 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
 * @ignore
 */
var my_default_security_level = /*@__INLINE__*/reg_test(/^\w+:\/\/localhost/, my_origin) ? local : external;

export {
	key_value_split,
	is_event_name,
	get_reorganized_event_name,
	is_not_nan,
	new_get_handler,
	default_setter,
	new_getter_proxy,
	reg_test,
	index_by_keys,
	throw_error,

	get_local_address,
	my_origin,
	my_default_security_level,

	to_string,
	type_judge,
	ExtensibleFunction
};
