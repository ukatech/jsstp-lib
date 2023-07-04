import {
	/*
	assign,
	endline,
	undefined,
	*/

	Get_Supported_Events,
	Has_Event,
	get_supported_events,
	has_event,
	default_security_level,

	local,
	external,
} from "../base/value_table.mjs";
import {
} from "../base/tools.mjs";

/**
 * ghost事件查询器
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("当前ghost不支持事件查询");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
class ghost_events_queryer_t {
	/**
	 * 基础{@link jsstp_t}对象
	 * @type {jsstp_t}
	 */
	#base_jsstp;
	/**
	 * 是否有`Has_Event`方法
	 * @type {Boolean}
	 */
	#ghost_has_has_event;
	/**
	 * 是否有`Get_Supported_Events`方法
	 * @type {Boolean}
	 */
	#ghost_has_get_supported_events;
	/**
	 * 自`Get_Supported_Events`获取的事件列表
	 * @type {{local:Array<String>,external:Array<String>}}
	 * @example 
	 * {
	 * 	local:["On_connect","On_disconnect"],
	 * 	external:["On_connect"]
	 * }
	 */
	#ghost_event_list;
	/**
	 * 自`Has_Event`获取的事件列表缓存
	 * @type {{local:{String:Boolean},external:{String:Boolean}}}
	 * @example 
	 * {
	 * 	local:{On_connect:true,On_disconnect:true},
	 * 	external:{On_connect:true}
	 * }
	 * @description 仅当`#ghost_has_get_supported_events`为false时有效
	 */
	#ghost_event_list_cache;

	/**
	 * 构造一个事件查询器
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/constructor(base_jsstp) {
		this.#base_jsstp = base_jsstp;
		/**
		 * 查询默认的安全等级，在nodejs中为"local"，在浏览器中为"external"
		 * @type {String}
		 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
		 */
		this[default_security_level] = base_jsstp[default_security_level];
	}
	/**
	 * 检查事件是否存在，ghost至少需要`Has_Event`事件的支持，并可以通过提供`Get_Supported_Events`事件来提高效率
	 * @param {String} event_name
	 * @param {String} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer.check_event("On_connect");
	 * @see 基于 {@link jsstp_t.has_event} 和 {@link jsstp_t.get_supported_events}
	 */
	/*@__PURE__*/async check_event(event_name, security_level = this[default_security_level]) {
		if (this.#ghost_has_get_supported_events)
			return this.#ghost_event_list[security_level].includes(event_name);
		else if (this.#ghost_has_has_event)
			return this.#ghost_event_list_cache[security_level][event_name] ??= await this.#base_jsstp[has_event](event_name);
		else
			return false;
	}
	/**
	 * 检查是否能够检查事件
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.available)
	 * 	console.error("无法检查事件");
	 */
	/*@__PURE__*/get available() { return this.#ghost_has_has_event; }
	/**
	 * 检查是否能够使用`Get_Supported_Events`快速获取支持的事件列表
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.fast_query_available)
	 * 	console.info("无法快速获取支持的事件列表");
	 * else
	 * 	console.info("好哦");
	 * @description 如果不支持也只是会变慢，`check_event`仍然可以使用
	 */
	/*@__PURE__*/get fast_query_available() { return this.#ghost_has_get_supported_events; }
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	reset() {
		this.clear();
		return this.init();
	}
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	async init() {
		let jsstp = this.#base_jsstp;
		this.#ghost_has_has_event = await jsstp[has_event](Has_Event);
		this.#ghost_has_get_supported_events = this.#ghost_has_has_event && await jsstp[has_event](Get_Supported_Events);
		if (this.#ghost_has_get_supported_events)
			this.#ghost_event_list = await jsstp[get_supported_events]();
		return this;
	}
	clear() {
		this.#ghost_has_has_event = this.#ghost_has_get_supported_events = false;
		this.#ghost_event_list_cache = { [local]: {}, [external]: {} };
	}
}

export default ghost_events_queryer_t;
