import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type { info_object } from "./info_object.d.ts";

/**
 * fmo message class: single fmo information class  
 * Record all fmo info of a single ghost.
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
	 * Full path to the root folder of the running baseware
	 * @example E:\ssp\
	 */
	path: string;
	/**
	 * Window handle of the main window
	 * @example 918820
	 */
	hwnd: string;
	/**
	 * sakura.name in descript.txt
	 * @example 橘花
	 */
	name: string;
	/**
	 * kero.name in descript.txt
	 * @example 斗和
	 */
	keroname: string;
	/**
	 * Surface ID currently displayed on the \0 side
	 * @example 0
	 */
	"sakura.surface": string;
	/**
	 * Surface ID currently displayed on the \1 side
	 * @example 10
	 */
	"kero.surface": string;
	/**
	 * Window handle of the \1 side window
	 * @example 67008
	 */
	kerohwnd: string;
	/**
	 * Comma-separated list of currently used window handles
	 * @example 918820,67008
	 */
	hwndlist: string;
	/**
	 * Full path to the running ghost
	 * @example E:\ssp\ghost\Taromati2\
	 */
	ghostpath: string;
	/**
	 * Name in the running ghost's descript.txt
	 * @example Taromati2
	 */
	fullname: string;
	/**
	 * Module status of the running ghost
	 * @example shiori:running,makoto-ghost:running
	 */
	modulestate: string;
}
/**
 * fmo message class
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
	 * Construct fmo_info_t from a string
	 * @param {String} fmo_text
	 * @returns {void}
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * Get the uuid of the fmo with the specified attribute and the value of the attribute is the specified value
	 * @param {String} name The name of the property to be checked.
	 * @param {String} value The value of the property to be checked.
	 * @returns {String|undefined} corresponding uuid (if any)
	 * @example
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description Equivalent to `this.uuids.find(uuid => this[uuid][name] == value)`
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * Gets the values of all the specified properties
	 * @param {String} name
	 * @returns {Array<String>}
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description Equivalent to `this.uuids.map(uuid => this[uuid][name])`
	 */
	/*@__PURE__*/get_list_of(name: String): Array<String>;
	/**
	 * Get all uuids
	 */
	/*@__PURE__*/get uuids(): Array<String>;
	/**
	 * Determining whether fmo is valid
	 */
	/*@__PURE__*/get available(): Boolean;
	/**
	 * fmo members
	 * @type {single_fmo_info_t|undefined}
	 */
	[uuid: `some ${string}`]: single_fmo_info_t | undefined;
}

export {
	single_fmo_info_t,
	fmo_info_t,
	fmo_info_t as default,
};
