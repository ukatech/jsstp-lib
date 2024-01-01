import type { info_object } from "./info_object.d.ts";

/*
sstp message format:
SEND SSTP/1.1
Charset: UTF-8
Sender: SSTP Client
Script: \h\s0Testing!\u\s[10]It's a test.
Option: notranslate
Consists of a fixed header line and an optional set of message lines, with \r\n line breaks and terminated by \r\n\r\n
*/
/**
 * Base sstp message class
 * @example
 * let info = jsstp.base_sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTP Client\r\nScript: \\h\\s0Testing!\\u\\s[10]It's a test.\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.base_sstp_info_t
 */
declare class base_sstp_info_t<key_T=PropertyKey,value_T=any> extends info_object<key_T,value_T> {
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
	/**
	 * Getting a String Message
	 * @returns {String} String message.
	 * @ignore
	 */
	/*@__PURE__*/TextContent(): String;
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
	 * Other message members
	 * @type {any|undefined}
	 */
	[key: string]: any|undefined;
}

export default base_sstp_info_t;
