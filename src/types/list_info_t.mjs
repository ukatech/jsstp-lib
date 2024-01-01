import {
	//assign,
	endline,
	//undefined,

	void_string
} from "../base/value_table.mjs";
import {base_sstp_info_t,split_sstp_text} from "./base_sstp_info_t.mjs";

/**
 * list报文对象
 * @example
 * let list = jsstp.GetNames();
 * for(let name of list)
 * 	console.log(name);
 * @alias jsstp.list_info_t
 */
class list_info_t extends base_sstp_info_t {
	/**
	 * 自字符串构造list_info_t
	 * @param {String} list_text
	 * @ignore
	 */
	/*@__PURE__*/constructor(list_text) {
		let [head, _, ...lines] = split_sstp_text(list_text);
		super(head, lines);
	}
	/*@__PURE__*/toString() { return this.length == 1 ? this[0] : to_string(this.values); }
	/**
	 * 获取字符串报文
	 * @returns {String} 字符串报文
	 * @ignore
	 */
	/*@__PURE__*/TextContent() {
		return [
			this.head,
			void_string,
			...this.values,
			void_string,void_string
		].join(endline);
	}
	/**
	 * 获取用于`JSON.stringify`的对象
	 * @returns {Object} 用于`JSON.stringify`的对象
	 * @ignore
	 */
	/*@__PURE__*/toJSON() {
		return {
			head: this.head,
			data: this.values
		};
	}
	//可迭代
	/**
	 * 获取迭代器
	 * @returns {Iterator<Array<String>>} 迭代器
	 */
	/*@__PURE__*/[Symbol.iterator]() {
		return this.values[Symbol.iterator]()
	}
}

export default list_info_t;
