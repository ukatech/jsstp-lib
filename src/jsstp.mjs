//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

import base_sstp_info_t from "./types/base_sstp_info_t.mjs";
import sstp_info_t from "./types/sstp_info_t.mjs";
import fmo_info_t from "./types/fmo_info_t.mjs";
import ghost_events_queryer_t from "./types/ghost_events_queryer_t.mjs";

import jsstp_t from "./types/jsstp_t.mjs";

//定义一个包装器
/**
 * sstp包装器
 * @example
 * jsstp.SEND({
 * 	Event: "OnTest",
 * 	Script: "\\s[0]Hell Wold!\\e"
 * });
 * @var jsstp
 * @type {jsstp_t}
 * @global
 */
var jsstp = new jsstp_t();

//导出
export {
	jsstp as default,
	jsstp,
	jsstp_t,
	base_sstp_info_t,
	sstp_info_t,
	fmo_info_t,
	ghost_events_queryer_t
}
