/**
 * 一个可用函数初始化的可扩展的函数类型，用于更为可读的派生类函数类型
 */
declare class ExtensibleFunction<args_T extends Array<any>, return_T> extends Function {
	/**
	 * 自函数实例初始化
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	constructor(func: (...args: args_T) => return_T);
	/**
	 * 调用函数，用指定的对象代替函数的this值，用指定的数组代替函数的参数。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
	 * @param thisArg 将被用作this对象的对象。
	 * @param argArray 一组要传递给函数的参数。
	 */
	apply(thisArg: (...args: args_T) => return_T, argArray?: args_T): return_T;

	/**
	 * 调用一个对象的方法，用另一个对象代替当前对象。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
	 * @param thisArg 将被用作当前对象的对象。
	 * @param argArray 要传递给方法的参数列表。
	 */
	call(thisArg: (...args: args_T) => return_T, ...argArray: args_T): return_T;

	/**
	 * 对于一个给定的函数，创建一个绑定的函数，其主体与原函数相同。  
	 * 绑定函数的this对象与指定的对象相关联，并具有指定的初始参数。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
	 * @param thisArg 一个对象，this关键字可以在新函数中引用。
	 * @param argArray 一个要传递给新函数的参数列表。
	 */
	bind(thisArg: (...args: args_T) => return_T, ...argArray: any): (...args: args_T) => return_T;

	/**
	 * 函数的显示名称。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
	 */
	readonly name: string;

	/**
	 * 函数所接受的命名参数的数量。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
	 */
	readonly length: number;
}
/**
 * ghost交互中的安全等级
 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
 */
type security_level_t = "local" | "external";

export { ExtensibleFunction, security_level_t };
