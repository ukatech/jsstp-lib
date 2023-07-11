import type base_sstp_info_t from "./base_sstp_info_t.d.ts";

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
declare class fmo_info_t extends base_sstp_info_t {
	/**
	 * 自己文字列構造 fmo_info_t, 直接の使用は推奨されない。
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name チェックするプロパティの名前
	 * @param {String} value 望ましい属性値
	 * @returns {String|undefined} 対応するuuid（もしあれば）
	 * @description 指定された属性を持ち、その属性の値が指定された値であるfmoのuuidを取得する。
	 * @example 
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description this.uuids.find(uuid => this[uuid][name] == value)`に相当する。
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description 指定されたすべてのプロパティの値を取得する
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description this.uuids.map(uuid=>this[uuid][name])`に相当する。
	 */
	/*@__PURE__*/get_list_of(name: String): Array<String>;
	/**
	 * @description すべてのuuidsを取得する
	 */
	/*@__PURE__*/get uuids(): Array<String>;
	/**
	 * @description fmoが有効かどうかの判断
	 */
	/*@__PURE__*/get available(): Boolean;
	//注入toString方法便于使用
	/**
	 * 文字列メッセージの取得
	 * @returns {String} 文字列メッセージ。
	 * @ignore
	 */
	/*@__PURE__*/toString(): String;
	/**
	 * `JSON.stringify`用オブジェクトの取得
	 * @returns {Object} `JSON.stringify` 用のオブジェクト。
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
	 * @param {(dimensions[...],value):any} func 実行する関数。 value):any} func 関数を実行し、戻り値を配列に追加します。
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

	/**
	 * fmoメンバー
	 * @type {base_sstp_info_t|undefined}
	 */
	[uuid: string]: base_sstp_info_t|undefined;
};

export default fmo_info_t;
