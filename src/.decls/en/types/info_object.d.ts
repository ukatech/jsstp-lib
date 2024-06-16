/**
 * Extend object to provide some simple and iterative operations.
 */
declare class info_object<key_T = PropertyKey, value_T = any> {
	/**
	 * Get an array of all keys
	 */
	/*@__PURE__*/get keys(): key_T[];
	/**
	 * Get an array of all values
	 */
	/*@__PURE__*/get values(): value_T[];
	/**
	 * Get an array of all key-value pairs.
	 */
	/*@__PURE__*/get entries(): [key_T, value_T][];
	/**
	 * Get the number of members
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * Execute a function for each key-value pair.
	 * @param {(value,key?)} func A function to be executed that replaces value if the return value is not undefined.
	 */
	/*@__PURE__*/forEach(func: (value: value_T, key?: key_T) => value_T | undefined): void;
	/**
	 * Copy a new object
	 * @returns {info_object} Copied object
	 */
	/*@__PURE__*/get trivial_clone(): info_object<key_T, value_T>;
	/**
	 * Traverses itself and its children and returns a one-dimensional array of traversal results.
	 * @param {(dimensions[...] ,value):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...key_T[], value_T]) => T): T[];
	/**
	 * Traverses itself and returns a one-dimensional array of traversal results.
	 * @param {(value,key?):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/map<T>(func: (value: value_T, key?: key_T) => T): T[];
	/**
	 * Append elements to itself as an array.
	 * @param {[undefined|[key_T,value_T]]} array Array to append to.
	 */
	/*@__PURE__*/push(array: [undefined | [key_T, value_T]]): void;
}
/**
 * Generate a new info_object
 * @returns {info_object} generated object
 * @ignore
 */
declare function new_object<key_T = PropertyKey, value_T = any>(): info_object<key_T, value_T>;
export { new_object as default, info_object };
