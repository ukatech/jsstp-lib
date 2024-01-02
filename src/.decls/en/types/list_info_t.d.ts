import type base_sstp_info_t from "./base_sstp_info_t.d.ts";

/**
 * List message object
 * @example
 * let list = jsstp.GetNames();
 * for(let name of list)
 * 	console.log(name);
 * @alias jsstp.list_info_t
 */
declare class list_info_t extends base_sstp_info_t<number,string> {
	/**
	 * Constructs list_info_t from a string
	 * @param {String} list_text
	 * @ignore
	 */
	/*@__PURE__*/constructor(list_text: String)
	/**
	 * Get the string representation of the value
	 * @returns {String} The string representation of the value, similar to `${this.values}`
	 * @summary This is not a method to get the string message. If you need to get the string message, please use {@link list_info_t.text_content}
	 * @ignore
	 */
	/*@__PURE__*/toString(): String
	/**
	 * Gets the iterator
	 * @returns {Iterator<Array<String>>} Iterator
	 */
	/*@__PURE__*/[Symbol.iterator](): Iterator<Array<String>>
	/**
	 * Array member
	 * @type {string|undefined}
	 */
	[uuid: number]: string|undefined;
}

export {
	list_info_t,
	list_info_t as default,
};
