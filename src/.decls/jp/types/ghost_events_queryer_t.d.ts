import type jsstp_t from "./jsstp_t.d.ts";
import type { ExtensibleFunction, security_level_t } from "../base/tools.d.ts"

/**
 * ゴースト・イベント・ファインダー
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("現在、ゴーストはイベントクエリをサポートしていません。");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
declare class ghost_events_queryer_t extends ExtensibleFunction<[string, security_level_t], Promise<Boolean>> {
	/**
	 * イベントクエリアの構築
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/constructor(base_jsstp: jsstp_t);
	/**
	 * デフォルトのセキュリティレベルを問い合わせます。nodejsでは "local"、ブラウザでは "external"です。
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;
	/**
	 * イベントの存在をチェックするには、ゴーストは少なくとも `Has_Event` イベントをサポートしている必要があり、`Get_Supported_Events` イベントを提供することでより効率的にすることができる。
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer.check_event("On_connect");
	 * @see {@link jsstp_t.has_event} と {@link jsstp_t.get_supported_events} に基づいています。
	 */
	/*@__PURE__*/check_event(event_name: String, security_level?: security_level_t): Promise<Boolean>;
	/**
	 * イベントをチェックできるかどうかを確認する
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.available)
	 * 	console.error("イベントをチェックできない");
	 */
	/*@__PURE__*/get available(): Boolean;
	/**
	 * `Get_Supported_Events`を使用して、サポートされているイベントのリストを素早く取得できるかどうかを確認する。
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.fast_query_available)
	 * 	console.info("サポートされているイベントのリストを素早く取得できない");
	 * else
	 * 	console.info("そうだね！");
	 * @description サポートされていない場合は、動作が遅くなるだけで、`check_event`はまだ機能する。
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
 * ゴースト・イベント・ファインダー
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("現在、ゴーストはイベントクエリをサポートしていません。");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
interface ghost_events_queryer_t {
	/**
	 * イベントクエリアの構築
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/new(base_jsstp: jsstp_t): ghost_events_queryer_t;
	/**
	 * 宣言の呼び出し  
	 * ゴーストには少なくとも `Has_Event` イベントサポートが必要で、 `Get_Supported_Events` イベントを提供することでより効率的にすることができる。
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer("On_connect");
	 * @see {@link ghost_events_queryer_t_class.check_event} に基づく。
	 */
	/*@__PURE__*/(event_name: String, security_level?: security_level_t): Promise<Boolean>;
}

export default ghost_events_queryer_t;
