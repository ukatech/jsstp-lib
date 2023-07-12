import type base_sstp_info_t from "./base_sstp_info_t.d.ts";

/**
 * fmoメッセージクラス：クラス定義の実装
 * @see fmo_info_t
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare class fmo_info_t_class_impl extends base_sstp_info_t {
	/**
	 * 分割された文字列メッセージまたはオブジェクト・メッセージから fmo_info_t を構築する，直接の使用は推奨されない。
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name チェックするプロパティの名前。
	 * @param {String} value チェックするプロパティの値。
	 * returns {String|undefined}対応するuuid(もしあれば)
	 * @description 指定された属性と属性値を持つfmoのuuidを取得します。
	 * @example
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description `this.uuids.find(uuid => this[uuid][name] == value)` と等価です。
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description 指定されたすべてのプロパティの値を取得する
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description `this.uuids.map(uuid=>this[uuid][name])`と同じ。
	 */
	/*@__PURE__*/get_list_of(name: String): Array<String>;
	/**
	 * @description すべてのuidsを取得する
	 */
	/*@__PURE__*/get uuids(): Array<String>;
	/**
	 * @description fmoが有効かどうかの判断
	 */
	/*@__PURE__*/get available(): Boolean;
	//注入toString方法便于使用
	/**
	 * 文字列メッセージの取得
	 * @returns {String} 文字列メッセージ
	 * @ignore
	 */
	/*@__PURE__*/toString(): String;
	/**
	 * `JSON.stringify` で使用するオブジェクトを取得する。
	 * @returns {Object} `JSON.stringify` で使用するオブジェクト。
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;

	//base_sstp_info_t的成员

	/**
	 * @description すべてのキーの配列を取得する
	 */
	/*@__PURE__*/get keys(): string[];
	/**
	 * @description すべての値の配列を取得する
	 */
	/*@__PURE__*/get values(): base_sstp_info_t[];
	/**
	 * @description すべてのキーと値のペアの配列を取得します。
	 */
	/*@__PURE__*/get entries(): [string, base_sstp_info_t][];
	/**
	 * @description キーと値のペアごとに関数を実行する。
	 * @param {(value,key?)} func 返り値がundefinedでない場合にvalueを置き換える関数を実行する。
	 */
	/*@__PURE__*/forEach(func: (value: base_sstp_info_t, key?: string) => base_sstp_info_t|undefined): void;
	/**
	 * @description 自分自身とその子をトラバースし、トラバース結果の1次元配列を返す。
	 * @param {(dimensions[...] ,value):any} func 関数を実行し、戻り値を配列に追加します。
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...string[],base_sstp_info_t]) => T): T[];
	/**
	 * @description 自分自身をトラバースし、トラバース結果の1次元配列を返す。
	 * @param {(value,key?):any} func 関数を実行し、戻り値を配列に追加します。
	 */
	/*@__PURE__*/map<T>(func: (value: base_sstp_info_t, key?: string) => T): T[];
	/**
	 * @description 配列をそれ自身に追加する。
	 * @param {[undefined|[String,any]]} array 追加する配列。
	 */
	/*@__PURE__*/push(array: [undefined|[string, base_sstp_info_t]]): void;
}
/**
 * 補足fmoメッセージ・クラスのデフォルト・メンバー
 */
type fmo_info_t_members = {
	/**
	 * fmoメンバー
	 * @type {base_sstp_info_t|undefined}
	 */
	[uuid: string]: base_sstp_info_t|undefined;
};
/**
 * fmoメッセージ・クラス：コンストラクタ・インターフェース宣言
 */
type fmo_info_t_constructor = {
	/**
	 * 分割された文字列メッセージまたはオブジェクト・メッセージから fmo_info_t を構築する，直接の使用は推奨されない。
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/new(fmo_text: String): fmo_info_t;
};
/**
 * FMOメッセージクラス
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @alias jsstp.fmo_info_t
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare const fmo_info_t: typeof fmo_info_t_class_impl & fmo_info_t_constructor;
/**
 * FMOメッセージクラス
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @alias jsstp.fmo_info_t
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
type fmo_info_t = fmo_info_t_class_impl & fmo_info_t_members & {
	constructor: typeof fmo_info_t;
}

export default fmo_info_t;
