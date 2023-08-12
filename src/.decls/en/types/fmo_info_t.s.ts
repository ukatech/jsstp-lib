import type base_sstp_info_t from "./base_sstp_info_t.d.ts";

/**
 * fmo message class: single fmo message class
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare class single_fmo_info_t extends base_sstp_info_t<string,string> {
	/**
	 * @description Full path to the root folder of the running base software
	 * @example E:\ssp\
	 */
	path: string;
	/**
	 * @description Window handle of the main window
	 * @example 918820
	 */
	hwnd: string;
	/**
	 * @description descript.txt's sakura.name
	 * @example 橘花
	 */
	name: string;
	/**
	 * @description descript.txt's kero.name
	 * @example 斗和
	 */
	keroname: string;
	/**
	 * @description Surface ID currently displayed on side \0
	 * @example 0
	 */
	"sakura.surface": string;
	/**
	 * @description Surface ID currently displayed on the \1 side
	 * @example 10
	 */
	"kero.surface": string;
	/**
	 * @description Window handle of the \1 side window
	 * @example 67008
	 */
	kerohwnd: string;
	/**
	 * @description Comma-separated list of currently used window handles
	 * @example 918820,67008
	 */
	hwndlist: string;
	/**
	 * @description Full path to the running ghost
	 * @example E:\ssp\ghost\Taromati2\
	 */
	ghostpath: string;
	/**
	 * @description Name in the running ghost's descript.txt
	 * @example Taromati2
	 */
	fullname: string;
	/**
	 * @description Module status of the running ghost
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
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare class fmo_info_t extends base_sstp_info_t<string,single_fmo_info_t> {
	/**
	 * Construct fmo_info_t from a string, not recommended for direct use
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name The name of the property to be checked.
	 * @param {String} value The value of the property to be checked.
	 * @returns {String|undefined} corresponding uuid (if any)
	 * @description Get the uuid of the fmo with the specified attribute and the value of the attribute is the specified value
	 * @example 
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description Equivalent to `this.uuids.find(uuid => this[uuid][name] == value)`
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description Gets the values of all the specified properties
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description Equivalent to `this.uuids.map(uuid => this[uuid][name])`
	 */
	/*@__PURE__*/get_list_of(name: String): Array<String>;
	/**
	 * @description Get all uuids
	 */
	/*@__PURE__*/get uuids(): Array<String>;
	/**
	 * @description Determining whether fmo is valid
	 */
	/*@__PURE__*/get available(): Boolean;
	//注入toString方法便于使用
	/**
	 * Getting a String Message
	 * @returns {String} String message.
	 * @ignore
	 */
	/*@__PURE__*/toString(): String;
	/**
	 * Get the object to use for `JSON.stringify`.
	 * @returns {Object} The object to use for `JSON.stringify`.
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;

	/**
	 * fmo members
	 * @type {single_fmo_info_t|undefined}
	 */
	[uuid: string]: single_fmo_info_t|undefined;
};

export {
	single_fmo_info_t,
	fmo_info_t,
	fmo_info_t as default,
};
