import { throw_error, type_judge } from "../base/tools.mjs";
import {
	//assign,
	//endline,
	undefined,

	//void_string,

	the_proxy,
	the_object,
	then,
} from "../base/value_table.mjs";
import new_object, { info_object } from "./info_object.mjs";

class smart_array_object extends info_object {
	static #build_new_with_result_base(result_base, default_value){
		//若每个值都是undefined，则返回target[key]
		if(result_base.every(([_key,value])=>value===undefined))
			return default_value;
		return new smart_array_object(the_object.fromEntries(result_base));
	}

	constructor(base_value) {
		let value_base = new_object(base_value);
		return new the_proxy(throw_error, {
			get: (_target, key) => {
				if(key === then)
					return;
				//对于每个在数组中的值，以key为索引，构建一个新的smart_array
				return smart_array_object.#build_new_with_result_base(value_base.map((value,the_key) => [the_key,value?.[key]]), value_base[key]);
			},
			apply: (_target, _thisArg, argumentsList) => {
				//对于每个在数组中的值，以key为索引，以argumentsList为参数，用调用结果构建一个新的smart_array
				return smart_array_object.#build_new_with_result_base(value_base.map((value,the_key) => [the_key,value(...argumentsList)]));
			},
			set: (_target, key, value) => {
				value_base[key] = value;
				return true;
			}
		});
	}
}

export default smart_array_object;
