/**
 * 拓展object，提供一些简单且遍历的操作
 */
class info_object {
	/**
	 * @description 获取所有key的数组
	 */
	/*@__PURE__*/get keys(): (string|number|symbol)[];
	/**
	 * @description 获取所有value的数组
	 */
	/*@__PURE__*/get values(): any[];
	/**
	 * @description 获取所有key-value对的数组
	 */
	/*@__PURE__*/get entries(): [string|number|symbol, any][];
	/**
	 * @description 获取成员数量
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * @description 对每个key-value对执行某个函数
	 * @param {(value,key?)} func 要执行的函数
	 */
	/*@__PURE__*/forEach(func: (value: any, key?: string|number|symbol) => any): void;
	/**
	 * @description 复制一个新的对象
	 * @returns {info_object} 复制的对象
	 */
	/*@__PURE__*/get trivial_clone(): info_object;
	/**
	 * @description 遍历自身和子对象并返回一个由遍历结果构成的一维数组
	 * @param {(dimensions[...],value):any} func 要执行的函数，返回值将被添加到数组中
	 */
	/*@__PURE__*/flat_map(func: (...dimensions: (string|number|symbol)[], value: any) => any): any[];
	/**
	 * @description 遍历自身并返回一个由遍历结果构成的一维数组
	 * @param {(value,key?):any} func 要执行的函数，返回值将被添加到数组中
	 */
	/*@__PURE__*/map(func: (value: any, key?: string|number|symbol) => any): any[];
	/**
	 * @description 对自身按照数组追加元素
	 * @param {[undefined|[String,Any]]} array 要追加的数组
	 */
	/*@__PURE__*/push(array: [undefined|[string|number|symbol, any]]): void;
}
/**
 * 生成一个新的info_object
 * @returns {info_object} 生成的对象
 * @ignore
 */
var new_object: () => info_object;
export { new_object as default, info_object };