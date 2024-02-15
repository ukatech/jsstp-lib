import type jsstp_t from "./jsstp_t.d.ts";
import type { ExtensibleFunction, security_level_t } from "../base/tools.d.ts"

/**
 * ghost event finder: class definition implementation
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("Currently ghost does not support event queries");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @see {@link jsstp_t.new_event_queryer}
 * @group ghost_events_queryer_t implementations
 */
declare class ghost_events_queryer_t_class_impl extends ExtensibleFunction<[string,string], Promise<Boolean>> {
	/**
	 * Constructing an Event Querier
	 * @param {jsstp_t} base_jsstp
	 * @returns {void}
	 */
	/*@__PURE__*/constructor(base_jsstp: jsstp_t);
	/**
	 * Queries the default security level, which is "local" in nodejs and "external" in browsers.
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;
	/**
	 * To check for the existence of events, ghost requires at least `Has_Event` event support and can be made more efficient by providing `Get_Supported_Events` events
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer.check_event("On_connect");
	 * @see base on {@link jsstp_t.has_event} and {@link jsstp_t.get_supported_events}
	 */
	/*@__PURE__*/check_event(event_name: String, security_level?: security_level_t): Promise<Boolean>;
	/**
	 * Check if the event can be checked
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.available)
	 * 	console.error("Unable to check events");
	 */
	/*@__PURE__*/get available(): Boolean;
	/**
	 * Check if you can use `Get_Supported_Events` to quickly get a list of supported events
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.fast_query_available)
	 * 	console.info("Unable to quickly fetch list of supported events");
	 * else
	 * 	console.info("Hell yeah");
	 * @description If it's not supported it will just be slower, `check_event` will still work
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
/**
 * ghost event finder: call signatures
 * @group ghost_events_queryer_t implementations
 */
type ghost_events_queryer_t_call_signature = {
	/**
	 * Call declarations
	 * Check for the existence of events, ghost requires at least `Has_Event` event support and can be made more efficient by providing `Get_Supported_Events` events
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer("On_connect");
	 * @see based on {@link ghost_events_queryer_t_class_impl.check_event}
	 */
	/*@__PURE__*/(event_name: String, security_level?: security_level_t): Promise<Boolean>;
}
/**
 * ghost event finder: constructor interface declaration
 * @group ghost_events_queryer_t implementations
 */
type ghost_events_queryer_t_constructor = {
	/**
	 * Constructing an Event Querier
	 * @param {jsstp_t} base_jsstp
	 * @returns {void}
	 */
	/*@__PURE__*/new(base_jsstp: jsstp_t): ghost_events_queryer_t;
}
/**
 * ghost event finder
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("Current ghost does not support event queries");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 * @class
 */
declare const ghost_events_queryer_t: typeof ghost_events_queryer_t_class_impl & ghost_events_queryer_t_constructor;
/**
 * ghost event finder
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("Current ghost does not support event queries");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 * @class
 */
type ghost_events_queryer_t = ghost_events_queryer_t_class_impl & ghost_events_queryer_t_call_signature & {
	constructor: typeof ghost_events_queryer_t;
}

export default ghost_events_queryer_t;
