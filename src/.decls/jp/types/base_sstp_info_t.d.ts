import type { info_object } from "./info_object.d.ts";

/*
sstp报文格式：
SEND SSTP/1.1
Charset: UTF-8
Sender: SSTPクライアント
Script: \h\s0テストー。\u\s[10]テストやな。
Option: notranslate
由一行固定的报文头和一组可选的报文体组成，以\r\n换行，结尾以\r\n\r\n结束。
*/
/**
 * ベースsstpメッセージクラス
 * @example
 * let info = jsstp.base_sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.base_sstp_info_t
 */
declare class base_sstp_info_t<key_T=PropertyKey,value_T=any> extends info_object<key_T,value_T> {
	/**
	 * 分割された文字列やオブジェクト・メッセージから sstp_info_t を構築することは推奨されない。
	 * @param {String} info_head メッセージのヘッダー。
	 * @param {Object} info_body オブジェクト形式のメッセージ本文。
	 * @param {Array<String>|undefined} unknown_lines 未知の行の配列。
	 * @see {@link sstp_info_t.from_string}
	 * @ignore
	 */
	/*@__PURE__*/constructor(info_head: String, info_body: Object, unknown_lines?: String[]);
	/**
	 * 未知の行の配列を取得する
	 * @returns {Array<String>} 未知の行の配列
	 */
	/*@__PURE__*/get unknown_lines(): Array<String>;
	/**
	 * メッセージのヘッダを取得する
	 * @returns {String}メッセージヘッダ
	 */
	/*@__PURE__*/get head(): String;
	/**
	 * 文字列メッセージの取得
	 * @returns {String} 文字列メッセージ。
	 * @ignore
	 */
	/*@__PURE__*/TextContent(): String;
	/**
	 * JSON.stringify` で使用するオブジェクトを取得する。
	 * @returns {Object} `JSON.stringify` で使用するオブジェクト。
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;
	/**
	 * ヘッダーのリターンコード (予期しない場合は `NaN`) を取得します。
	 * @returns {Number} ヘッダのリターンコード (予期しない場合は `NaN`)
	 */
	/*@__PURE__*/get status_code(): Number;
	/**
	 * その他のメッセージメンバー
	 * @type {any|undefined}
	 */
	[key: string]: any|undefined;
}

export default base_sstp_info_t;
