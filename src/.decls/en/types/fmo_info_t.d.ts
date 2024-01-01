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
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare interface single_fmo_info_t extends info_object<string,string> {
	/**
	 * @description Full path to the root folder of the running baseware
	 * @example E:\ssp\
	 */
	path: string;
	/**
	 * @description Window handle of the main window
	 * @example 918820
	 */
	hwnd: string;
	/**
	 * @description sakura.name in descript.txt
	 * @example 橘花
	 */
	name: string;
	/**
	 * @description kero.name in descript.txt
	 * @example 斗和
	 */
	keroname: string;
	/**
	 * @description Surface ID currently displayed on the \0 side
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
 * fmo message class: class definition implementation
 * @see fmo_info_t
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 * @group fmo_info_t implementations
 */
declare class fmo_info_t_class_impl extends base_sstp_info_t<string,single_fmo_info_t> {
	/**
	 * Self-string construction fmo_info_t, not recommended for direct use
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name The name of the property to be checked.
	 * @param {String} value The value of the property to be checked.
	 * @returns {String|undefined} corresponding uuid (if any)
	 * @description Get the uuid of the fmo with the specified attribute and the value of the attribute.
	 * @example 
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description equivalent to `this.uuids.find(uuid => this[uuid][name] == value)`
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description Get the values of all the specified properties.
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
	//Inject the toString method for ease of use
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
}
/**
 * Default members of the supplementary fmo message class
 * @group fmo_info_t implementations
 */
type fmo_info_t_members = {
	/**
	 * fmo members
	 * @type {single_fmo_info_t|undefined}
	 */
	[uuid: string]: single_fmo_info_t|undefined;
};
/**
 * fmo message class: constructor interface declaration
 * @group fmo_info_t implementations
 */
type fmo_info_t_constructor = {
	/**
	 * Construct fmo_info_t from a string, not recommended for direct use
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/new(fmo_text: String): fmo_info_t;
};
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
 * @group fmo_info_t implementations
 */
declare const fmo_info_t: typeof fmo_info_t_class_impl & fmo_info_t_constructor;
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
 * @group fmo_info_t implementations
 */
type fmo_info_t = fmo_info_t_class_impl & fmo_info_t_members & {
	constructor: typeof fmo_info_t;
}

export {
	single_fmo_info_t,
	fmo_info_t,
	fmo_info_t as default,
};
