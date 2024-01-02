import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type { info_object } from "./info_object.d.ts";

//Define the sstp message class
/*
sstp  message format:
SEND SSTP/1.1
Charset: UTF-8
Sender: SSTP Client
Script: \h\s0Testing!\u\s[10]It's a test.
Option: notranslate
Consists of a fixed header line and an optional set of message lines, with \r\n line breaks and terminated by \r\n\r\n
*/
/**
 * sstp message class
 * @example
 * let info = jsstp.new sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTP Client\r\nScript: \\h\\s0Testing!\\u\\s[10]It's a test.\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.sstp_info_t
 */
declare class sstp_info_t extends base_sstp_info_t<string, string> {
	/**
	 * Constructing sstp_info_t from a string
	 * @param {String} str string message
	 * @returns {sstp_info_t} Constructed sstp_info_t
	 * @example
	 * let info = new sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTP Client\r\nScript: \\h\\s0Testing!\\u\\s[10]It's a test.\r\nOption: notranslate\r\n\r\n");
	 */
	/*@__PURE__*/constructor(str: String);
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

	/**
	 * Other message members
	 * @type {String|undefined}
	 */
	[key: `some ${string}`]: String | undefined;
}

export default sstp_info_t;
