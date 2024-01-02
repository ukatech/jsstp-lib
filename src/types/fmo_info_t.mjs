import {
	//assign,
	endline,
	//undefined,

	void_string,
} from "../base/value_table.mjs";
import {
	key_value_split,
} from "../base/tools.mjs";
import new_object from "./info_object.mjs";
import { base_sstp_info_t, split_sstp_text } from "./base_sstp_info_t.mjs";

/**
 * fmo报文类
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @alias jsstp.fmo_info_t
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
class fmo_info_t extends base_sstp_info_t {
	/**
	 * 自字符串构造fmo_info_t
	 * @param {String} fmo_text
	 * @ignore
	 */
	/*@__PURE__*/constructor(fmo_text) {
		let [head, _, ...lines] = split_sstp_text(fmo_text);
		super(head, {});
		//fmo_info每个key的格式都是"uuid.属性名"
		for (let line of lines) {
			let [key_base, value] = key_value_split(line, String.fromCharCode(1));
			let [uuid, key] = key_value_split(key_base, ".");
			(this[uuid] ||= new_object())[key] = value;//uuid对应的对象应是info_object以方便使用，且下方flat_map调用需要其方法
		}
	}
	/**
	 * @param {String} name 要检查的属性名
	 * @param {String} value 期望的属性值
	 * @returns {String|undefined} 对应的uuid（如果有的话）
	 * @description 获取具有指定属性且属性值为指定值的fmo的uuid
	 * @example 
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description 等价于`this.uuids.find(uuid => this[uuid][name] == value)`
	 */
	/*@__PURE__*/get_uuid_by(name, value) {
		return this.uuids.find(uuid => this[uuid][name] == value);
	}
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description 获取所有指定属性的值
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description 等价于`this.uuids.map(uuid => this[uuid][name])`
	 */
	/*@__PURE__*/get_list_of(name) {
		return this.uuids.map(uuid => this[uuid][name]);
	}
	/**
	 * @description 获取所有uuid
	 */
	/*@__PURE__*/get uuids() { return this.keys; }
	/**
	 * @description 判断fmo是否有效
	 */
	/*@__PURE__*/get available() { return !!this.length; }
	/**
	 * 获取字符串报文
	 * @returns {String} 字符串报文
	 * @ignore
	 */
	/*@__PURE__*/get text_content() {
		return [
			this.head,
			void_string,
			...this.flat_map((uuid, key, value) => uuid + "." + key + String.fromCharCode(1) + value),
			void_string, void_string
		].join(endline);
	}
	/**
	 * 获取用于`JSON.stringify`的对象
	 * @returns {Object} 用于`JSON.stringify`的对象
	 * @ignore
	 */
	/*@__PURE__*/toJSON() {
		return {
			head: this.head,
			fmo_infos: this.trivial_clone
		};
	}
}

export default fmo_info_t;
