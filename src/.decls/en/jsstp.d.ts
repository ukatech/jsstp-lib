//Construct a wrapper to communicate with http://localhost:9801/api/sstp/v1
//Method of sending: Content-Type: text/plain HTTP/1.1 with POST
//Method of receiving: HTTP/1.1 200 OK Content-Type: text/plain

import type base_sstp_info_t from "./types/base_sstp_info_t.d.ts";
import type sstp_info_t from "./types/sstp_info_t.d.ts";
import type fmo_info_t from "./types/fmo_info_t.d.ts";
import type ghost_events_queryer_t from "./types/ghost_events_queryer_t.d.ts";

import type jsstp_t from "./types/jsstp_t.d.ts";
import type list_info_t from "./types/list_info_t.d.js";

//Define a wrapper
/**
 * sstp wrapper
 * @example
 * jsstp.SEND({
 * 	Event: "OnTest",
 * 	Script: "\\s[0]Hell Wold!\\e"
 * });
 * @var jsstp
 * @type {jsstp_t}
 * @global
 */
declare var jsstp: jsstp_t;

//导出
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
