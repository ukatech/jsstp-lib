import {
	//assign,
	endline,
	undefined,
} from "../base/value_table.mjs";
import {
	key_value_split,
	new_getter_proxy,
	reg_test,
} from "../base/tools.mjs";
import { base_sstp_info_t, split_sstp_text } from "./base_sstp_info_t.mjs";
import new_object from "./info_object.mjs";

//定义sstp报文类
import { x_sstp_passthru_head } from "../base/value_table.mjs"
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
 * sstp报文类
 * @example
 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.sstp_info_t
 */
class sstp_info_t extends base_sstp_info_t {
	/**
	 * 从字符串构造sstp_info_t
	 * @param {String} str 字符串报文
	 * @returns {sstp_info_t} 构造的sstp_info_t
	 * @example
	 * let info = new sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 */
	/*@__PURE__*/constructor(str) {
		let [head, ...lines] = split_sstp_text(str);
		let body = {};
		let unknown_lines = [];
		let last_key;
		for (let line of lines) {
			let [key, value] = key_value_split(line, ': ');
			if (!/*@__INLINE__*/reg_test(/^\w[^\s]*$/, key)) {
				if (last_key)
					body[last_key] += endline + line;
				else
					unknown_lines.push(line);
			}
			else
				body[last_key = key] = value;
		}
		super(head, body, unknown_lines);
		return new_getter_proxy(this, {
			_string_key_handler_: (target, key) =>
				x_sstp_passthru_head + key in target && !Object.getOwnPropertyNames(sstp_info_t.prototype).includes(key) ?
					target.get_passthrough(key) :
				undefined
		});
	}
	/**
	 * 获取PassThru的值
	 * @param {String} key 获取的PassThru名称
	 * @returns {String|undefined} PassThru的值
	 */
	/*@__PURE__*/get_passthrough(key) { return this[x_sstp_passthru_head + key]; }
	/**
	 * 用于缓存所有的PassThru
	 * @type {info_object}
	 * @private
	 */
	#passthroughs;
	/**
	 * 获取所有的PassThru
	 * @returns {info_object} 所有的PassThru
	 */
	/*@__PURE__*/get passthroughs() {
		return this.#passthroughs ??= new_object().push(
			this.map((value, key) => key.startsWith(x_sstp_passthru_head) ?
				[key.slice(x_sstp_passthru_head.length), value] : undefined
			)
		);
	}
	/**
	 * 获取原始对象
	 * @returns {sstp_info_t} 原始对象
	 */
	/*@__PURE__*/get raw() { return this; }
}

export default sstp_info_t;
