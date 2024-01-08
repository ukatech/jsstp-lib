import type base_sstp_info_t from "./base_sstp_info_t.d.ts";

/**
 * listメッセージオブジェクト
 * @example
 * let list = jsstp.GetNames();
 * for(let name of list)
 * 	console.log(name);
 * @alias jsstp.list_info_t
 */
declare class list_info_t extends base_sstp_info_t<number, string> {
	/**
	 * 自己文字列構造 list_info_t
	 * @param {String} list_text
	 * @ignore
	 */
	/*@__PURE__*/constructor(list_text: String)
	/**
	 * 値の文字列形式を取得します
	 * @returns {String} 値の文字列形式、`${this.values}`と同様
	 * @summary これは文字列メッセージを取得するメソッドではありません。文字列メッセージを取得するには、{@link list_info_t.text_content}を使用してください
	 * @ignore
	 */
	/*@__PURE__*/toString(): String
	/**
	 * イテレータ取得
	 * @returns {Iterator<Array<String>>} イテレータ
	 */
	/*@__PURE__*/[Symbol.iterator](): Iterator<Array<String>>
	/**
	 * 配列メンバ
	 * @type {string|undefined}
	 */
	[key: number]: string | undefined;
}

export {
	list_info_t,
	list_info_t as default,
};
