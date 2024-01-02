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
	/*@__PURE__*/toString(): String
	/**
	 * Gets the string message
	 * @returns {String} String message
	 * @ignore
	 */
	/*@__PURE__*/TextContent(): String
	/**
	 * Gets the object for `JSON.stringify`
	 * @returns {Object} Object for `JSON.stringify`
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object
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
