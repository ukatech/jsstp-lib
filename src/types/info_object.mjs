import {
	assign,
	undefined,
} from "../base/value_table.mjs";
import {
	type_judge,
} from "../base/tools.mjs";
/**
 * 拓展object，提供一些简单且遍历的操作
 */
class info_object {
	/**
	 * @description 构造函数
	 * @param {Object} base_value 
	 */
	constructor(base_value) {
		Object.assign(this, base_value);
	}
	/**
	 * @description 获取所有key的数组
	 */
	/*@__PURE__*/get keys() { return Object.keys(this); }
	/**
	 * @description 获取所有value的数组
	 */
	/*@__PURE__*/get values() { return Object.values(this); }
	/**
	 * @description 获取所有key-value对的数组
	 */
	/*@__PURE__*/get entries() { return Object.entries(this); }
	/**
	 * @description 获取成员数量
	 */
	/*@__PURE__*/get length() { return this.keys.length; }
	/**
	 * @description 对每个key-value对执行某个函数
	 * @param {(value,key?)} func 要执行的函数
	 */
	/*@__PURE__*/forEach(func) {
		this.entries.forEach(([key, value]) => {
			this[key] = func(value, key) ?? value;
		});
	}
	/**
	 * @description 复制一个新的对象
	 * @returns {info_object} 复制的对象
	 */
	/*@__PURE__*/get trivial_clone() {
		return assign(new_object(), this);
	}
	/**
	 * @description 遍历自身和子对象并返回一个由遍历结果构成的一维数组
	 * @param {(dimensions[...],value):any} func 要执行的函数，返回值将被添加到数组中
	 */
	/*@__PURE__*/flat_map(func) {
		let result = [];
		this.entries.map(([key, value]) => 
			result.push(...(
				type_judge(value, info_object)?
				value.flat_map(func.bind(func, key)):
				[func(key, value)]//构建数组，因为外部有展开操作
			))
		);
		return result;
	}
	/**
	 * @description 遍历自身并返回一个由遍历结果构成的一维数组
	 * @param {(value,key?):any} func 要执行的函数，返回值将被添加到数组中
	 */
	/*@__PURE__*/map(func) {
		return this.entries.map(([key, value]) => func(value, key));
	}
	/**
	 * @description 对自身按照数组追加元素
	 * @param {[undefined|[PropertyKey,any]]} array 要追加的数组
	 */
	/*@__PURE__*/push(array) {
		array.forEach((pair) => pair ? this[pair[0]] = pair[1] : undefined);
		return this;
	}
	/**
	 * @description 每一个key-value对都满足条件则返回true
	 * @param {(value,key?):boolean} func 要执行的函数
	 */
	/*@__PURE__*/every(func) {
		return this.entries.every(([key, value]) => func(value, key));
	}
}
/**
 * 生成一个新的info_object
 * @returns {info_object} 生成的对象
 * @ignore
 */
var new_object = (value) => new info_object(value);
export { new_object as default, info_object };
