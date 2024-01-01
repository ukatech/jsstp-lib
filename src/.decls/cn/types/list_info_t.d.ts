import type base_sstp_info_t from "./base_sstp_info_t.d.ts";

/**
 * list报文对象
 * @example
 * let list = jsstp.GetNames();
 * for(let name of list)
 * 	console.log(name);
 * @alias jsstp.list_info_t
 */
declare class list_info_t extends base_sstp_info_t<number,string> {
	/**
	 * 自字符串构造list_info_t
	 * @param {String} list_text
	 * @ignore
	 */
	/*@__PURE__*/constructor(list_text: String)
	/*@__PURE__*/toString(): String
	/**
	 * 获取字符串报文
	 * @returns {String} 字符串报文
	 * @ignore
	 */
	/*@__PURE__*/TextContent(): String
	/**
	 * 获取用于`JSON.stringify`的对象
	 * @returns {Object} 用于`JSON.stringify`的对象
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object
	/**
	 * 获取迭代器
	 * @returns {Iterator<Array<String>>} 迭代器
	 */
	/*@__PURE__*/[Symbol.iterator](): Iterator<Array<String>>
	/**
	 * 数组成员
	 * @type {string|undefined}
	 */
	[uuid: number]: string|undefined;
}

export {
	list_info_t,
	list_info_t as default,
};
