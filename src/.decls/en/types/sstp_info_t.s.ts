import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type { info_object } from "./info_object.d.ts";

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
};

export default sstp_info_t;
