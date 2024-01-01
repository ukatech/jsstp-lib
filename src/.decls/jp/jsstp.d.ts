//http://localhost:9801/api/sstp/v1 でラッパーを構築する
//送信方法：Content-Type: text/plain HTTP/1.1 でPOST
//受診方法：HTTP/1.1 200 OK Content-Type: text/plain

import type base_sstp_info_t from "./types/base_sstp_info_t.d.ts";
import type sstp_info_t from "./types/sstp_info_t.d.ts";
import type fmo_info_t from "./types/fmo_info_t.d.ts";
import type ghost_events_queryer_t from "./types/ghost_events_queryer_t.d.ts";

import type jsstp_t from "./types/jsstp_t.d.ts";
import type list_info_t from "./types/list_info_t.d.js";

//ラッパーの定義
/**
 * sstpラッパー
 * @example
 * jsstp.SEND({
 * 	Event: "OnTest",
 * 	Script: "\\s[0]Hello Wold!\\e"
 * });
 * @var jsstp
 * @type {jsstp_t}
 * @global
 */
declare var jsstp: jsstp_t;

//エクスポート
export {
	jsstp as default,
	jsstp,
	jsstp_t,
	base_sstp_info_t,
	sstp_info_t,
	fmo_info_t,
	list_info_t,
	ghost_events_queryer_t
}
