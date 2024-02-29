import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type { info_object } from "./info_object.d.ts";

/**
 * fmoメッセージクラス：単一のfmo情報クラス  
 * 単一のゴーストの全てのfmo情報を記録します。
 * @example
 * info_object {
 * 	path: 'E:\\ssp\\',
 * 	hwnd: '918820',
 * 	name: '橘花',
 * 	keroname: '斗和',
 * 	'sakura.surface': '-1',
 * 	'kero.surface': '-1',
 * 	kerohwnd: '67008',
 * 	hwndlist: '918820,67008',
 * 	ghostpath: 'E:\\ssp\\ghost\\Taromati2\\',
 * 	fullname: 'Taromati2',
 * 	modulestate: 'shiori:running'
 * }
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare interface single_fmo_info_t extends info_object<string, string> {
	/**
	 * @description 実行中のベースウェアのルートフォルダへのフルパス
	 * @example E:\ssp\
	 */
	path: string;
	/**
	 * @description \0側のウィンドウハンドル
	 * @example 918820
	 */
	hwnd: string;
	/**
	 * @description descript.txtのsakura.name
	 * @example 橘花
	 */
	name: string;
	/**
	 * @description descript.txtのkero.name
	 * @example 斗和
	 */
	keroname: string;
	/**
	 * @description \0側に表示されているサーフェスID
	 * @example 0
	 */
	"sakura.surface": string;
	/**
	 * @description \1側に表示されているサーフェスID
	 * @example 10
	 */
	"kero.surface": string;
	/**
	 * @description \1側のウィンドウのハンドル
	 * @example 67008
	 */
	kerohwnd: string;
	/**
	 * @description 現在使用されているウィンドウハンドルのカンマ区切りリスト
	 * @example 918820,67008
	 */
	hwndlist: string;
	/**
	 * @description 実行中のゴーストへのフルパス
	 * @example E:\ssp\ghost\Taromati2\
	 */
	ghostpath: string;
	/**
	 * @description 実行中のゴーストのdescript.txtの名前
	 * @example Taromati2
	 */
	fullname: string;
	/**
	 * @description 実行中のゴーストのモジュール状態
	 * @example shiori:running,makoto-ghost:running
	 */
	modulestate: string;
}
/**
 * FMOメッセージクラス
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @alias jsstp.fmo_info_t
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare class fmo_info_t extends base_sstp_info_t<string, single_fmo_info_t> {
	/**
	 * 分割された文字列メッセージまたはオブジェクト・メッセージから fmo_info_t を構築する
	 * @param {String} fmo_text
	 * @returns {void}
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name チェックするプロパティの名前
	 * @param {String} value 望ましい属性値
	 * @returns {String|undefined} 対応するuuid（もしあれば）
	 * @description 指定された属性を持ち、その属性の値が指定された値であるfmoのuuidを取得する。
	 * @example
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description `this.uuids.find(uuid => this[uuid][name] == value)`に相当する。
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description 指定されたすべてのプロパティの値を取得する
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description `this.uuids.map(uuid=>this[uuid][name])`に相当する。
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
	/**
	 * fmoメンバー
	 * @type {single_fmo_info_t|undefined}
	 */
	[uuid: `some ${string}`]: single_fmo_info_t | undefined;
}

export {
	single_fmo_info_t,
	fmo_info_t,
	fmo_info_t as default,
};
