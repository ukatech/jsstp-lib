import type base_sstp_info_t from "./base_sstp_info_t.d.ts";
import type { info_object } from "./info_object.d.ts";

/**
 * fmo报文类：单个fmo信息类  
 * 记录单个ghost所有的fmo信息
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
	 * @description 正在运行的基础软件根文件夹的完整路径
	 * @example E:\ssp\
	 */
	path: string;
	/**
	 * @description 主窗口的窗口句柄
	 * @example 918820
	 */
	hwnd: string;
	/**
	 * @description descript.txt的sakura.name
	 * @example 橘花
	 */
	name: string;
	/**
	 * @description descript.txt的kero.name
	 * @example 斗和
	 */
	keroname: string;
	/**
	 * @description \0侧当前显示的surface ID
	 * @example 0
	 */
	"sakura.surface": string;
	/**
	 * @description \1侧当前显示的surface ID
	 * @example 10
	 */
	"kero.surface": string;
	/**
	 * @description \1侧窗口的窗口句柄
	 * @example 67008
	 */
	kerohwnd: string;
	/**
	 * @description 当前使用的窗口句柄的逗号分隔列表
	 * @example 918820,67008
	 */
	hwndlist: string;
	/**
	 * @description 正在运行的ghost的完整路径
	 * @example E:\ssp\ghost\Taromati2\
	 */
	ghostpath: string;
	/**
	 * @description 正在运行的ghost的descript.txt的name
	 * @example Taromati2
	 */
	fullname: string;
	/**
	 * @description 正在运行的ghost的模块状态
	 * @example shiori:running,makoto-ghost:running
	 */
	modulestate: string;
};
/**
 * fmo报文类
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
	 * 自字符串构造fmo_info_t，不建议直接使用
	 * @param {String} fmo_text
	 * @returns {void}
	 * @ignore
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name 要检查的属性名
	 * @param {String} value 期望的属性值
	 * @returns {String|undefined} 对应的uuid（如果有的话）
	 * @description 获取具有指定属性且属性值为指定值的fmo的uuid
	 * @example 
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description 等价于`this.uuids.find(uuid => this[uuid][name] == value)`
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description 获取所有指定属性的值
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description 等价于`this.uuids.map(uuid => this[uuid][name])`
	 */
	/*@__PURE__*/get_list_of(name: String): Array<String>;
	/**
	 * @description 获取所有uuid
	 */
	/*@__PURE__*/get uuids(): Array<String>;
	/**
	 * @description 判断fmo是否有效
	 */
	/*@__PURE__*/get available(): Boolean;
	//注入toString方法便于使用
	/**
	 * 获取字符串报文
	 * @returns {String} 字符串报文
	 * @ignore
	 */
	/*@__PURE__*/toString(): String;
	/**
	 * 获取用于`JSON.stringify`的对象
	 * @returns {Object} 用于`JSON.stringify`的对象
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;
	/**
	 * fmo成员
	 * @type {single_fmo_info_t|undefined}
	 */
	[uuid: string]: single_fmo_info_t|undefined;
};

export {
	single_fmo_info_t,
	fmo_info_t,
	fmo_info_t as default,
};
