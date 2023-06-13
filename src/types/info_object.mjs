import { object, assign } from "../base.mjs";
/**
 * 拓展object，提供一些简单且遍历的操作
 */
class info_object {
	/**
	 * @description 获取所有key的数组
	 */
	/*@__PURE__*/get keys() { return object.keys(this); }
	/**
	 * @description 获取所有value的数组
	 */
	/*@__PURE__*/get values() { return object.values(this); }
	/**
	 * @description 获取所有key-value对的数组
	 */
	/*@__PURE__*/get entries() { return object.entries(this); }
	/**
	 * @description 获取成员数量
	 */
	/*@__PURE__*/get length() { return this.keys.length; }
	/**
	 * @description 对每个key-value对执行某个函数
	 * @param {(value,key?)} func 要执行的函数
	 */
	/*@__PURE__*/forEach(func) {
		return this.entries.forEach(([key, value]) => {
			this[key] = func(value, key) || value;
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
		this.entries.map(([key, value]) => {
			if (value instanceof info_object)
				result.push(...value.flat_map(func.bind(func, key)));
			else
				result.push(func(key, value));
		});
		return result;
	}
}
/**
 * 生成一个新的info_object
 * @returns {info_object} 生成的对象
 */
let new_object = () => new info_object();
export { new_object as default, info_object };
