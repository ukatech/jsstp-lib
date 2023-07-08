import type jsstp_t from "./jsstp_t.d.ts";
import type { ExtensibleFunction } from "../base/tools.d.ts"

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
declare class ghost_events_queryer_t extends ExtensibleFunction<string[],Promise<Boolean>> {
	/**
	 * 构造一个事件查询器
	 * @param {jsstp_t} base_jsstp
	 * @returns {void}
	 */
	/*@__PURE__*/constructor(base_jsstp: jsstp_t);
	/**
	 * 检查事件是否存在，ghost至少需要`Has_Event`事件的支持，并可以通过提供`Get_Supported_Events`事件来提高效率
	 * @param {String} event_name
	 * @param {String|undefined} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer.check_event("On_connect");
	 * @see 基于 {@link jsstp_t.has_event} 和 {@link jsstp_t.get_supported_events}
	 */
	/*@__PURE__*/check_event(event_name: String, security_level?: String): Promise<Boolean>;
	/**
	 * 调用声明
	 * 检查事件是否存在，ghost至少需要`Has_Event`事件的支持，并可以通过提供`Get_Supported_Events`事件来提高效率
	 * @param {String} event_name
	 * @param {String|undefined} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer("On_connect");
	 * @see 基于 {@link ghost_events_queryer_t.check_event}
	 */
	/*@__PURE__*///**remove from dist**//(event_name: String, security_level?: String): Promise<Boolean>;
	/**
	 * 检查是否能够检查事件
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.available)
	 * 	console.error("无法检查事件");
	 */
	/*@__PURE__*/get available(): Boolean;
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
	/*@__PURE__*/get fast_query_available(): Boolean;
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	reset(): Promise<ghost_events_queryer_t>;
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	init(): Promise<ghost_events_queryer_t>;
	clear(): void;
}

export default ghost_events_queryer_t;