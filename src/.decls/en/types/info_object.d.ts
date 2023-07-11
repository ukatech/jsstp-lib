/**
 * Extend object to provide some simple and iterative operations.
 */
declare class info_object {
	/**
	 * @description Get an array of all keys
	 */
	/*@__PURE__*/get keys(): PropertyKey[];
	/**
	 * @description Get an array of all values
	 */
	/*@__PURE__*/get values(): any[];
	/**
	 * @description Get an array of all key-value pairs.
	 */
	/*@__PURE__*/get entries(): [PropertyKey, any][];
	/**
	 * @description Get the number of members
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * @description Execute a function for each key-value pair.
	 * @param {(value,key?)} func A function to be executed that replaces value if the return value is not undefined.
	 */
	/*@__PURE__*/forEach(func: (value: any, key?: PropertyKey) => any|undefined): void;
	/**
	 * @description Copy a new object
	 * @returns {info_object} Copied object
	 */
	/*@__PURE__*/get trivial_clone(): info_object;
	/**
	 * @description Traverses itself and its children and returns a one-dimensional array of traversal results.
	 * @param {(dimensions[...] ,value):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...PropertyKey[],any]) => T): T[];
	/**
	 * @description Traverses itself and returns a one-dimensional array of traversal results.
	 * @param {(value,key?):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/map<T>(func: (value: any, key?: PropertyKey) => T): T[];
	/**
	 * @description Append elements to itself as an array.
	 * @param {[undefined|[PropertyKey,any]]} array Array to append to.s
	 */
	/*@__PURE__*/push(array: [undefined|[PropertyKey, any]]): void;
}
/**
 * Generate a new info_object
 * @returns {info_object} generated object
 * @ignore
 */
declare var new_object: () => info_object;
export { new_object as default, info_object };
