/**
 * 拓展object，提供一些简单且遍历的操作
 */
declare class info_object<key_T = PropertyKey, value_T = any> {
	/**
	 * @description 获取所有key的数组
	 */
	/*@__PURE__*/get keys(): key_T[];
	/**
	 * @description 获取所有value的数组
	 */
	/*@__PURE__*/get values(): value_T[];
	/**
	 * @description 获取所有key-value对的数组
	 */
	/*@__PURE__*/get entries(): [key_T, value_T][];
	/**
	 * @description 获取成员数量
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * @description 对每个key-value对执行某个函数
	 * @param {(value,key?)} func 要执行的函数，若返回值不为undefined，则会替换原value
	 */
	/*@__PURE__*/forEach(func: (value: value_T, key?: key_T) => value_T | undefined): void;
	/**
	 * @description 复制一个新的对象
	 * @returns {info_object} 复制的对象
	 */
	/*@__PURE__*/get trivial_clone(): info_object<key_T, value_T>;
	/**
	 * @description 遍历自身和子对象并返回一个由遍历结果构成的一维数组
	 * @param {(dimensions[...],value):any} func 要执行的函数，返回值将被添加到数组中
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...key_T[], value_T]) => T): T[];
	/**
	 * @description 遍历自身并返回一个由遍历结果构成的一维数组
	 * @param {(value,key?):any} func 要执行的函数，返回值将被添加到数组中
	 */
	/*@__PURE__*/map<T>(func: (value: value_T, key?: key_T) => T): T[];
	/**
	 * @description 对自身按照数组追加元素
	 * @param {[undefined|[key_T,value_T]]} array 要追加的数组
	 */
	/*@__PURE__*/push(array: [undefined | [key_T, value_T]]): void;
}
/**
 * 生成一个新的info_object
 * @returns {info_object} 生成的对象
 * @ignore
 */
declare function new_object<key_T = PropertyKey, value_T = any>(): info_object<key_T, value_T>;
export { new_object as default, info_object };
