import {
	assign,
	endline,
	//undefined,

	void_string,
} from "../base/value_table.mjs";
import {
	is_not_nan,
	to_string,
} from "../base/tools.mjs";
import { info_object } from "./info_object.mjs";

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
 * 基础sstp报文类
 * @example
 * let info = jsstp.new sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.base_sstp_info_t
 */
class base_sstp_info_t extends info_object {
	#head;
	/**
	 * 未知行的数组
	 * @type {Array<String>}
	 */
	#unknown_lines;

	/**
	 * 自拆分好的字符串报文或对象报文构造sstp_info_t，不建议直接使用
	 * @param {String} info_head 报文头
	 * @param {Object} info_body 对象格式的报文体
	 * @param {Array<String>|undefined} unknown_lines 未知行的数组
	 * @see {@link sstp_info_t.constructor}
	 * @ignore
	 */
	/*@__PURE__*/constructor(info_head, info_body, unknown_lines) {
		super(info_body);
		this.#head = info_head;
		this.#unknown_lines = unknown_lines || [];
	}
	/**
	 * 获取未知行的数组
	 * @returns {Array<String>} 未知行的数组
	 */
	/*@__PURE__*/get unknown_lines() { return this.#unknown_lines || []; }
	/**
	 * 获取报文头
	 * @returns {String} 报文头
	 */
	/*@__PURE__*/get head() { return this.#head; }
	/**
	 * 获取字符串报文
	 * @returns {String} 字符串报文
	 */
	/*@__PURE__*/get text_content() {
		return [
			this.#head,
			...this.#unknown_lines,
			...this.entries.map(([key, value]) => `${key}: ${value}`),
			void_string,void_string//空行结尾
		].join(endline);
	}
	/**
	 * 获取用于`JSON.stringify`的对象
	 * @returns {Object} 用于`JSON.stringify`的对象
	 * @ignore
	 */
	/*@__PURE__*/toJSON() {
		return {
			head: this.#head,
			unknown_lines: this.#unknown_lines,
			body: this.trivial_clone
		};
	}
	/**
	 * 获取报头返回码（若出现意外返回`NaN`）
	 * @returns {Number} 报头返回码（若出现意外则为`NaN`）
	 */
	/*@__PURE__*/get status_code() {
		//比如：SSTP/1.4 200 OK，返回200
		return +this.#head.split(" ").find(value => is_not_nan(+value));
	}
}
/**
 * 从字符串分割出报文头和报文体
 * @param {String} info_text 字符串报文
 * @returns {Array<String>} [报文头, ...报文体]
 */
/*@__PURE__*/function split_sstp_text(info_text) {
	let result = info_text.split(endline);
	//去掉最后的空行*2
	result.length -= 2;
	return result;
}

export {
	base_sstp_info_t as default,
	base_sstp_info_t,
	split_sstp_text,
};
