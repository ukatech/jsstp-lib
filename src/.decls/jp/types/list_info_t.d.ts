import type base_sstp_info_t from "./base_sstp_info_t.d.ts";

/**
 * listメッセージオブジェクト
 * @example
 * let list = jsstp.GetNames();
 * for(let name of list)
 * 	console.log(name);
 * @alias jsstp.list_info_t
 */
declare class list_info_t extends base_sstp_info_t<number,string> {
	/**
	 * 自己文字列構造 list_info_t
	 * @param {String} list_text
	 * @ignore
	 */
	/*@__PURE__*/constructor(list_text: String)
	/*@__PURE__*/toString(): String
	/**
	 * 文字列メッセージの取得
	 * @returns {String} 文字列メッセージ
	 * @ignore
	 */
	/*@__PURE__*/TextContent(): String
	/**
	 * `JSON.stringify`用オブジェクトの取得
	 * @returns {Object} `JSON.stringify` 用のオブジェクト。
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object
	/**
	 * イテレータ取得
	 * @returns {Iterator<Array<String>>} イテレータ
	 */
	/*@__PURE__*/[Symbol.iterator](): Iterator<Array<String>>
	/**
	 * 配列メンバ
	 * @type {string|undefined}
	 */
	[uuid: number]: string|undefined;
}

export {
	list_info_t,
	list_info_t as default,
};
