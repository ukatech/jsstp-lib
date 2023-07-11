import type base_sstp_info_t from "./base_sstp_info_t.d.ts";

/**
 * fmo message class: class definition implementation
 * @see fmo_info_t
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare class fmo_info_t_class_impl extends base_sstp_info_t {
	/**
	 * Self-string construction fmo_info_t, not recommended for direct use
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name The name of the property to be checked.
	 * @param {String} value The value of the property to be checked.
	 * @returns {String|undefined} corresponding uuid (if any)
	 * @description Get the uuid of the fmo with the specified attribute and the value of the attribute.
	 * @example 
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description equivalent to `this.uuids.find(uuid => this[uuid][name] == value)`
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description Get the values of all the specified properties.
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description Equivalent to `this.uuids.map(uuid => this[uuid][name])`
	 */
	/*@__PURE__*/get_list_of(name: String): Array<String>;
	/**
	 * @description Get all uuids
	 */
	/*@__PURE__*/get uuids(): Array<String>;
	/**
	 * @description Determining whether fmo is valid
	 */
	/*@__PURE__*/get available(): Boolean;
	//注入toString方法便于使用
	/**
	 * Getting a String Message
	 * @returns {String} String message.
	 * @ignore
	 */
	/*@__PURE__*/toString(): String;
	/**
	 * Get the object to use for `JSON.stringify`.
	 * @returns {Object} The object to use for `JSON.stringify`.
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;

	//base_sstp_info_t的成员

	/**
	 * @description Get an array of all keys
	 */
	/*@__PURE__*/get keys(): string[];
	/**
	 * @description Get an array of all values
	 */
	/*@__PURE__*/get values(): base_sstp_info_t[];
	/**
	 * @description Get an array of all key-value pairs.
	 */
	/*@__PURE__*/get entries(): [string, base_sstp_info_t][];
	/**
	 * @description Execute a function for each key-value pair.
	 * @param {(value,key?)} func A function to be executed that replaces value if the return value is not undefined.
	 */
	/*@__PURE__*/forEach(func: (value: base_sstp_info_t, key?: string) => base_sstp_info_t|undefined): void;
	/**
	 * @description Traverses itself and its children and returns a one-dimensional array of traversal results.
	 * @param {(dimensions[...] ,value):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...string[],base_sstp_info_t]) => T): T[];
	/**
	 * @description Traverses itself and returns a one-dimensional array of traversal results.
	 * @param {(value,key?):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/map<T>(func: (value: base_sstp_info_t, key?: string) => T): T[];
	/**
	 * @description Append an array to itself.
	 * @param {[undefined|[String,any]]} array The array to append.
	 */
	/*@__PURE__*/push(array: [undefined|[string, base_sstp_info_t]]): void;
}
/**
 * Default members of the supplementary fmo message class
 */
type fmo_info_t_members = {
	/**
	 * fmo members
	 * @type {base_sstp_info_t|undefined}
	 */
	[uuid: string]: base_sstp_info_t|undefined;
};
/**
 * fmo message class: constructor interface declaration
 */
type fmo_info_t_constructor = {
	/**
	 * Construct fmo_info_t from a string, not recommended for direct use
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/new(fmo_text: String): fmo_info_t;
};
/**
 * fmo message class
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @alias jsstp.fmo_info_t
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare const fmo_info_t: typeof fmo_info_t_class_impl & fmo_info_t_constructor;
/**
 * fmo message class
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @alias jsstp.fmo_info_t
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
type fmo_info_t = fmo_info_t_class_impl & fmo_info_t_members & {
	constructor: typeof fmo_info_t;
}

export default fmo_info_t;
