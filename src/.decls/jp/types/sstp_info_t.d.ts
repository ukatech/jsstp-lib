import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type { info_object } from "./info_object.d.ts";

//sstpメッセージ・クラスの定義
/*
sstpメッセージフォーマット：
SEND SSTP/1.1
Charset: UTF-8
Sender: SSTPクライアント
Script: \h\s0テストー。\u\s[10]テストやな。
Option: notranslate
固定行のメッセージヘッダと任意行のメッセージボディのセットから構成される。
*/
/**
 * SSTPメッセージクラス
 * @example
 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.sstp_info_t
 */
declare class sstp_info_t extends base_sstp_info_t<string, string> {
	/**
	 * 文字列から sstp_info_t を構築する
	 * @param {String} str メッセージ文字列
	 * @returns {sstp_info_t} 構築された sstp_info_t
	 * @example
	 * let info = new sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 */
	/*@__PURE__*/constructor(str: String);
	/**
	 * PassThruの値を取得する
	 * @param {String} key 取得するPassThruの名前。
	 * @returns {String|undefined} PassThruの値。
	 */
	/*@__PURE__*/get_passthrough(key: String): String | undefined;
	/**
	 * すべてのPassThruを取得する
	 * @returns {info_object} すべてのパススルー
	 */
	/*@__PURE__*/get passthroughs(): info_object;
	/**
	 * 元のオブジェクトの取得
	 * @returns {sstp_info_t} 原物
	 */
	/*@__PURE__*/get raw(): sstp_info_t;

	/**
	 * その他のメッセージメンバー
	 * @type {String|undefined}
	 */
	[key: `some ${string}`]: String | undefined;
}

export default sstp_info_t;
