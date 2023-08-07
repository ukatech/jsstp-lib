import {
	//assign,
	//endline,
	//undefined,

	//void_string,

	the_proxy,
	the_array,
} from "../base/value_table.mjs";

class smart_array extends the_array {
	#build_new_with_result_base(result_base, default_value){
		//若每个值都是undefined，则返回target[key]
		if(result_base.every((value)=>value===undefined))
			return default_value;
		return new smart_array(...result_base);
	}

	constructor(...values) {
		super(...values);
		return new the_proxy(this, {
			get: (target, key) => {
				//对于每个在数组中的值，以key为索引，构建一个新的smart_array
				return this.#build_new_with_result_base(target.map((value) => value[key]), target[key]);
			},
			apply: (target, thisArg, argumentsList) => {
				//对于每个在数组中的值，以key为索引，以argumentsList为参数，用调用结果构建一个新的smart_array
				return this.#build_new_with_result_base(target.map((value) => value(...argumentsList)));
			},
		});
	}
}

export default smart_array;
