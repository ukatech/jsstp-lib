/**
 * 一个可用函数初始化的可扩展的函数类型，用于更为可读的派生类函数类型
 */
declare class ExtensibleFunction<args_T extends Array<any>, return_T> extends Function {
	/**
	 * 自函数实例初始化
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	constructor(func: (...args: args_T) => return_T);
	/**
	 * 调用函数，用指定的对象代替函数的this值，用指定的数组代替函数的参数。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
	 * @param thisArg 将被用作this对象的对象。
	 * @param argArray 一组要传递给函数的参数。
	 */
	apply(thisArg: (...args: args_T) => return_T, argArray?: args_T): return_T;

	/**
	 * 调用一个对象的方法，用另一个对象代替当前对象。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
	 * @param thisArg 将被用作当前对象的对象。
	 * @param argArray 要传递给方法的参数列表。
	 */
	call(thisArg: (...args: args_T) => return_T, ...argArray: args_T): return_T;

	/**
	 * 对于一个给定的函数，创建一个绑定的函数，其主体与原函数相同。  
	 * 绑定函数的this对象与指定的对象相关联，并具有指定的初始参数。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
	 * @param thisArg 一个对象，this关键字可以在新函数中引用。
	 * @param argArray 一个要传递给新函数的参数列表。
	 */
	bind(thisArg: (...args: args_T) => return_T, ...argArray: any): (...args: args_T) => return_T;

	/**
	 * 函数的显示名称。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
	 */
	readonly name: string;

	/**
	 * 函数所接受的命名参数的数量。  
	 * [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
	 */
	readonly length: number;
}
interface ExtensibleFunction<args_T extends Array<any>, return_T> {
	/**
	 * 自函数实例初始化
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	new(func: (...args: args_T) => return_T): ExtensibleFunction<args_T, return_T>;
	/**
	 * 调用签名
	 */
	(...args: args_T): return_T;
}
/**
 * ghost交互中的安全等级
 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
 */
type security_level_t = "local" | "external";
/**
 * SSTP 返回码  
 * 和 HTTP 一样，200 系列是正常接受，其他的是错误。  
 * 200 系列是正常接受，其他的是错误。
 * @enum {number}
 */
declare enum documented_sstp_return_code_t {
	/** 正常结束（有返回值） */
	OK = 200,
	/** 正常结束（无返回值） */
	NO_CONTENT = 204,
	/**
	 * 执行了，但是在脚本执行中被中断了  
	 * ※只限于极少数情况，比如带有 Entry 的 SEND/1.x 等，通常是立即返回 200 或 204。
	 */
	BREAK = 210,
	/** 请求中有些东西无法覆盖或处理 */
	BAD_REQUEST = 400,
	/** 指定人格的 SSTP，但是没有安装或启动相应的人格 ※只适用于 SSP */
	NOT_FOUND = 404,
	/** 超时：无法和人格/SHIORI 通信等情况（一般很少发生） */
	REQUEST_TIMEOUT = 408,
	/** \t 标签等禁止中断的状态，或者正在处理其他请求 */
	CONFLICT = 409,
	/** SSTP 请求太长，拒绝处理 ※只适用于 SSP */
	PAYLOAD_TOO_LARGE = 413,
	/** 人格的设置的原因，拒绝接收 */
	REFUSE = 420,
	/** 处理系统内部发现了某些问题，无法处理 ※只适用于 SSP */
	INTERNAL_SERVER_ERROR = 500,
	/** 包含了未实现的命令等，无法处理 */
	NOT_IMPLEMENTED = 501,
	/** 处理系统内部的原因，无法接受 SSTP */
	SERVICE_UNAVAILABLE = 503,
	/** SSTP 的版本有问题（低于 1.0，高于 3.0 等） ※只适用于 SSP */
	VERSION_NOT_SUPPORTED = 505,
	/** 最小化等，人格没有显示，无法处理 */
	INVISIBLE = 512,
	/** 报文解析失败 */
	PARSE_ERROR = NaN
}
/**
 * SSTP 返回码  
 * 和 HTTP 一样，200 系列是正常接受，其他的是错误。  
 * 200 系列是正常接受，其他的是错误。
 * @enum {number}
 */
type sstp_return_code_t = documented_sstp_return_code_t | number;
/**
 * 基本的SSTP包
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#req_res}
 */
type base_sstp_content_t = {
	/**
	 * 请求的字符编码。最好出现在第一行。  
	 * 没有特别的理由的话，推荐使用UTF-8。
	 */
	CharSet: string | undefined,

	/**
	 * 表示发送者的字符串。例如“SSTP发送工具”。COMMUNICATE方法的情况下，是发送源的ghost\0名。
	 */
	Sender: string | undefined,

	/**
	 * SHIORI和SakuraScript处理时的安全级别的指定。local/external其中之一。  
	 * DirectSSTP，或者明显是从本地来的请求（如127.0.0.1）才有效。
	 */
	SecurityLevel: security_level_t | undefined,

	/**
	 * 指定SSTP执行的SakuraScript的处理方式的选项。  
	 * 用逗号分隔，可以指定多个。指定的字符串如下。  
	 * nodescript : 禁用气球的SSTP显示（远程的SSTP无效）  
	 * notranslate : 不进行OnTranslate或MAKOTO的翻译处理  
	 * nobreak : 不中断当前执行中的脚本，等待它结束
	 */
	Option: string | undefined,

	/**
	 * 所谓的“Owned SSTP”。用SHIORI uniqueid发送过来的ID或者FMO的识别ID（仅SSP）指定的话，忽略各种安全检查和锁等，把本SSTP当作ghost内部的处理和同样的优先级处理。  
	 * SecurityLevel指定变成local，而且即使是\t等的中断禁止状态也强制地中断播放。
	 */
	ID: string | undefined,

	/**
	 * NOTIFY等和ghost的通信时，直接传给SHIORI的头。  
	 * 只进行字符编码转换等最低限的处理，（任意的字符串）的部分和内容原样中继。
	 */
	[key: `X-SSTP-PassThru-${string}`]: string | undefined,

	/**
	 * DirectSSTP限定，表示应该回复response的窗口句柄。  
	 * 窗口句柄（指针相当）的数据作为无符号十进制整数处理，然后字符串化。  
	 * 省略时是WM_COMMUNICATE的wParam。
	 */
	HWnd: string | undefined,

	/**
	 * (Socket)SSTP限定，表示应该发送request的ghost的\0的窗口句柄。  
	 * 指定这个的话，固定处理的ghost，Socket经由也可以和DirectSSTP一样的处理。  
	 * 找不到的话，用404 Not Found立即错误结束。
	 */
	ReceiverGhostHWnd: string | undefined,

	/**
	 * (Socket)SSTP限定，表示应该发送request的ghost的\0名。  
	 * 指定这个的话，固定处理的ghost，Socket经由也可以和DirectSSTP一样的处理。HWnd的名字版。  
	 * 找不到的话，用404 Not Found立即错误结束。
	 */
	ReceiverGhostName: string | undefined,

	/**
	 * 其他的SSTP内容
	 */
	[key: string]: string | undefined
};
/**
 * 常见的SSTP事件包内容
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_notify}
 */
type common_event_sstp_content_t = {
	/**
	 * 事件名
	 */
	Event: string
	/**
	 * 参数
	 */
	[key: `Reference${number}`]: any
	/**
	 * 如果以 \0 端名称和 \1 端名称的格式指定 ghost 的名称，则紧随其后的{@link common_event_sstp_content_t.Script}标头将被视为专用于特定 ghost。  
	 * 如果省略内容，将为任何 ghost 播放相同的 Script 标头。  
	 * 如果启用了 SSTP ghost激活选项，则此处指定的ghost将被临时激活。  
	 * 由于js的语言限制，这里只能指定一个ghost。  
	 * 需要使用多个 IfGhost 时，考虑使用{@link jsstp_t.row_send}发送SSTP消息
	 */
	IfGhost: string | undefined
	/**
	 * Sakura脚本  
	 * 如果 Script 标头不紧跟在 IfGhost 之后，则当它与 IfGhost 不对应时，它将是默认的处理脚本。  
	 * 由于js的语言限制，这里只能指定一个脚本。  
	 * 需要使用多个 Script 时，考虑使用{@link jsstp_t.row_send}发送SSTP消息
	 */
	Script: string | undefined
	/**
	 * 其他的SSTP内容
	 */
	[key: string]: string | undefined
};
/**
 * @enum {string} documented_sstp_command_name_t
 * @description SSTP的已记录于文档的命令名称的枚举类型
 */
declare enum documented_sstp_command_name_t {
	/**
	 * 返回正在运行的人格的名字，以(\0名),(\1名)的格式用逗号分隔
	 */
	GetName = "GetName",
	/**
	 * 返回已安装的人格的名字的列表，以每行一个\0名的格式，以空行结束
	 */
	GetNames = "GetNames",
	/**
	 * 返回FMO，即保存正在运行的人格的状态的文件和同等的信息  
	 * 但是，这个命令仅限于通过SSTP通信的应用程序内部的管理部分，与原本的FMO不同，它是同时运行的应用程序群共用的  
	 * 主要用于没有窗口且不能发送Direct SSTP的控制台应用等，通过仅使用Socket SSTP和ReceiverGhostHWnd头实现Direct SSTP相当的功能  
	 * 每行返回一个人格的信息，以空行结束  
	 * 如果是远程请求的话，各路径信息会被省略，头和hwnd会被替换为虚拟的
	 */
	GetFMO = "GetFMO",
	/**
	 * 返回正在运行的人格本体的名字（descript.txt的name）
	 */
	GetGhostName = "GetGhostName",
	/**
	 * 返回正在运行的人格当前使用的外壳的名字
	 */
	GetShellName = "GetShellName",
	/**
	 * 返回正在运行的人格当前使用的气球的名字
	 */
	GetBalloonName = "GetBalloonName",
	/**
	 * 返回基础软件（运行人格的软件）的版本
	 */
	GetVersion = "GetVersion",
	/**
	 * 返回SSP识别的所有人格的名字（descript.txt的name）的列表，以每行一个名字的格式，以空行结束
	 */
	GetGhostNameList = "GetGhostNameList",
	/**
	 * 返回正在运行的人格识别的所有外壳的名字（descript.txt的name）的列表，以每行一个名字的格式，以空行结束
	 */
	GetShellNameList = "GetShellNameList",
	/**
	 * 返回SSP识别的所有气球的名字（descript.txt的name）的列表，以每行一个名字的格式，以空行结束
	 */
	GetBalloonNameList = "GetBalloonNameList",
	/**
	 * 返回SSP识别的所有头条的名字（descript.txt的name）的列表，以每行一个名字的格式，以空行结束
	 */
	GetHeadlineNameList = "GetHeadlineNameList",
	/**
	 * 返回SSP识别的所有插件的名字（descript.txt的name）的列表，以每行一个名字的格式，以空行结束
	 */
	GetPluginNameList = "GetPluginNameList",
	/**
	 * 返回基础软件（运行人格的软件）的版本，以点分隔的版本号的格式  
	 * 这可以和version.json的ssp.full.version等简单比较，就可以检查是否是最新版
	 */
	GetShortVersion = "GetShortVersion",
	/**
	 * 执行Restore或者人格沉默16秒。没有附加数据（状态码200系列表示成功）
	 */
	Quiet = "Quiet",
	/**
	 * 解除Quiet。没有附加数据（状态码200系列表示成功）
	 */
	Restore = "Restore",
	/**
	 * 将指定文件夹内的文件压缩成压缩文件  
	 * 响应会在处理结束后才返回，注意  
	 * 参数0：压缩文件名  
	 * 参数1：要压缩的文件夹的完整路径  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	CompressArchive = "CompressArchive",
	/**
	 * 将指定的压缩文件解压  
	 * 响应会在处理结束后才返回，注意  
	 * 参数0：压缩文件名  
	 * 参数1：解压目标文件夹的完整路径  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	ExtractArchive = "ExtractArchive",
	/**
	 * 将合成好的表面图片输出到指定的目录。参数和\![execute,dumpsurface]相同  
	 * 响应会在处理结束后才返回，注意  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	DumpSurface = "DumpSurface",
	/**
	 * 不通过Sakura Script执行和\![moveasync]相同的事情。参数指定方法和Sakura Script版相同  
	 * 因为不能在SSTP的超时时间内返回响应，而且会导致死锁，所以不能执行没有async的move  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	MoveAsync = "MoveAsync",
	/**
	 * 不通过Sakura Script执行和\![set,tasktrayicon]相同的事情。参数指定方法和Sakura Script版相同  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	SetTrayIcon = "SetTrayIcon",
	/**
	 * 不通过Sakura Script执行和\![set,trayballoon]相同的事情。参数指定方法和Sakura Script版相同  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	SetTrayBalloon = "SetTrayBalloon",
	/**
	 * 向属性系统写入值  
	 * 参数0：属性的名字  
	 * 参数1：要设置的值  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	SetProperty = "SetProperty",
	/**
	 * 从属性系统读出值  
	 * 参数0：属性的名字  
	 * 附加数据是获取的属性的值
	 */
	GetProperty = "GetProperty",
	/**
	 * 按Sender指定的客户端名分别保存的，通用数据保存区域写入  
	 * 和浏览器的「Cookie」相同的用法  
	 * 参数0：Cookie的名字  
	 * 参数1：要设置的值  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	SetCookie = "SetCookie",
	/**
	 * 按Sender指定的客户端名分别保存的，通用数据保存区域读出  
	 * 参数0：Cookie的名字  
	 * 附加数据是获取的Cookie的值
	 */
	GetCookie = "GetCookie"
}
/**
 * SSTP命令名称
 * @enum {string}
 */
type sstp_command_name_t = documented_sstp_command_name_t | string;
/**
 * 常见的SSTP执行包内容
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_execute}
 */
type common_execute_sstp_content_t = {
	/**
	 * 执行的命令。
	 */
	Command: sstp_command_name_t | `${sstp_command_name_t}[${string}]`
	/**
	 * 执行的参数信息。
	 */
	[key: `Reference${number}`]: any
	/**
	 * 其他的SSTP内容
	 */
	[key: string]: string | undefined
};
/**
 * 常见的SSTP沟通包内容
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_communicate}
 */
type common_communicate_sstp_content_t = {
	/**
	 * 传输的Sakura Script
	 */
	Sentence: string
	/**
	 * 通信的扩展信息。  
	 * SHIORI/3.0中存储在Reference2及以后。SSTP Reference0 = SHIORI Reference2。
	 */
	[key: `Reference${number}`]: any
	/**
	 * 发送源ghost的通信发送时点（≒脚本执行结束时点）的\0和\1的表情编号。  
	 * 在OnCommunicate事件中作为Surface头传递。
	 * @example `5,11` //表示\0为5，\1为11
	 */
	Surface: string
	/**
	 * 其他的SSTP内容
	 */
	[key: string]: string | undefined
};
/**
 * 常见的SSTP给予包内容
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_give}
 */
type common_give_sstp_content_t = {
	/**
	 * 给予的文本  
	 * 在 SHIORI/3.0 中，这与用户通信相同，并生成 OnCommunicate 事件。
	 */
	Document: string
	/**
	 * 给予的歌的名字。  
	 * 在SHIORI/3.0中，发生OnMusicPlay事件并且Reference0成为指定的字符串。
	 */
	Song: string
	/**
	 * 其他的SSTP内容
	 */
	[key: string]: string | undefined
};

/**
 * 拓展object，提供一些简单且遍历的操作
 */
declare class info_object<key_T = PropertyKey, value_T = any> {
	/**
	 * @description 获取所有key的数组
	 */
	/*@__PURE__*/get keys(): key_T[];
	/**
	 * @description 获取所有value的数组
	 */
	/*@__PURE__*/get values(): value_T[];
	/**
	 * @description 获取所有key-value对的数组
	 */
	/*@__PURE__*/get entries(): [key_T, value_T][];
	/**
	 * @description 获取成员数量
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * @description 对每个key-value对执行某个函数
	 * @param {(value,key?)} func 要执行的函数，若返回值不为undefined，则会替换原value
	 */
	/*@__PURE__*/forEach(func: (value: value_T, key?: key_T) => value_T | undefined): void;
	/**
	 * @description 复制一个新的对象
	 * @returns {info_object} 复制的对象
	 */
	/*@__PURE__*/get trivial_clone(): info_object<key_T, value_T>;
	/**
	 * @description 遍历自身和子对象并返回一个由遍历结果构成的一维数组
	 * @param {(dimensions[...],value):any} func 要执行的函数，返回值将被添加到数组中
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...key_T[], value_T]) => T): T[];
	/**
	 * @description 遍历自身并返回一个由遍历结果构成的一维数组
	 * @param {(value,key?):any} func 要执行的函数，返回值将被添加到数组中
	 */
	/*@__PURE__*/map<T>(func: (value: value_T, key?: key_T) => T): T[];
	/**
	 * @description 对自身按照数组追加元素
	 * @param {[undefined|[key_T,value_T]]} array 要追加的数组
	 */
	/*@__PURE__*/push(array: [undefined | [key_T, value_T]]): void;
}

/**
 * 基础sstp报文类
 * @example
 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.base_sstp_info_t
 */
declare class base_sstp_info_t<key_T = PropertyKey, value_T = any> extends info_object<key_T, value_T> {
	/**
	 * 自拆分好的字符串报文或对象报文构造sstp_info_t，不建议直接使用
	 * @param {String} info_head 报文头
	 * @param {Object} info_body 对象格式的报文体
	 * @param {Array<String>|undefined} unknown_lines 未知行的数组
	 * @see {@link sstp_info_t.constructor}
	 * @ignore
	 */
	/*@__PURE__*/constructor(info_head: String, info_body: Object, unknown_lines?: String[]);
	/**
	 * 获取未知行的数组
	 * @returns {Array<String>} 未知行的数组
	 */
	/*@__PURE__*/get unknown_lines(): Array<String>;
	/**
	 * 获取报文头
	 * @returns {String} 报文头
	 */
	/*@__PURE__*/get head(): String;
	/**
	 * 获取字符串报文
	 * @returns {String} 字符串报文
	 */
	/*@__PURE__*/get text_content(): String;
	/**
	 * 获取用于`JSON.stringify`的对象
	 * @returns {Object} 用于`JSON.stringify`的对象
	 * @example console.log(JSON.stringify(info));
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;
	/**
	 * 获取报头返回码（若出现意外返回`NaN`）
	 * @returns {sstp_return_code_t} 报头返回码（若出现意外则为`NaN`）
	 */
	/*@__PURE__*/get status_code(): sstp_return_code_t;
	/**
	 * 其他报文成员
	 * @type {any|undefined}
	 */
	[key: string]: any | undefined;
}

/**
 * sstp报文类
 * @example
 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.sstp_info_t
 */
declare class sstp_info_t extends base_sstp_info_t<string, string> {
	/**
	 * 从字符串构造sstp_info_t
	 * @param {String} str 字符串报文
	 * @returns {sstp_info_t} 构造的sstp_info_t
	 * @example
	 * let info = new sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 */
	/*@__PURE__*/constructor(str: String);
	/**
	 * 获取PassThru的值
	 * @param {String} key 获取的PassThru名称
	 * @returns {String|undefined} PassThru的值
	 */
	/*@__PURE__*/get_passthrough(key: String): String | undefined;
	/**
	 * 获取所有的PassThru
	 * @returns {info_object} 所有的PassThru
	 */
	/*@__PURE__*/get passthroughs(): info_object;
	/**
	 * 获取原始对象
	 * @returns {sstp_info_t} 原始对象
	 */
	/*@__PURE__*/get raw(): sstp_info_t;
	/**
	 * 其他报文成员
	 * @type {String|undefined}
	 */
	[key: string]: String | undefined;
}

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
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare interface single_fmo_info_t extends info_object<string, string> {
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
}
/**
 * fmo报文类
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
	 * 自字符串构造fmo_info_t
	 * @param {String} fmo_text
	 * @returns {void}
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
	/**
	 * fmo成员
	 * @type {single_fmo_info_t|undefined}
	 */
	[uuid: string]: single_fmo_info_t | undefined;
}

/**
 * list报文对象
 * @example
 * let list = jsstp.GetNames();
 * for(let name of list)
 * 	console.log(name);
 * @alias jsstp.list_info_t
 */
declare class list_info_t extends base_sstp_info_t<number, string> {
	/**
	 * 自字符串构造list_info_t
	 * @param {String} list_text
	 */
	/*@__PURE__*/constructor(list_text: String)
	/**
	 * 获取值的字符串形式
	 * @returns {String} 值的字符串形式，类似于`${this.values}`
	 * @summary 这不是获取字符串报文的方法。如果需要获取字符串报文，请使用{@link list_info_t.text_content}
	 * @ignore
	 */
	/*@__PURE__*/toString(): String
	/**
	 * 获取用于`JSON.stringify`的对象
	 * @returns {Object} 用于`JSON.stringify`的对象
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object
	/**
	 * 获取迭代器
	 * @returns {Iterator<Array<String>>} 迭代器
	 */
	/*@__PURE__*/[Symbol.iterator](): Iterator<Array<String>>
	/**
	 * 数组成员
	 * @type {string|undefined}
	 */
	[key: number]: string | undefined;
}

/**
 * sstp方法调用器
 * @group callers
 */
interface method_caller<T = sstp_info_t, Rest extends any[] = [Object]> {
	(...args: Rest): Promise<T>;
	get_raw(...args: Rest): Promise<String>;
	with_type<nT>(result_type: new (str: string) => nT): method_caller<nT, Rest>;
	bind_args_processor<nRest extends any[]>(processor: (...args: Rest) => Object): method_caller<T, nRest>;
}

/**
 * 可以通过成员访问扩充指定key值的拓展调用器
 * @group callers
 */
interface base_keyed_method_caller<T = sstp_info_t, Rest extends any[] = [Object]> extends method_caller<T, Rest> {
	/**
	 * 扩展调用器
	 */
	[uuid: string]: base_keyed_method_caller<T, Rest>
}
/**
 * 对调用参数进行简易处理的可扩展调用器
 * @group callers
 */
interface simple_keyed_method_caller<result_T> extends base_keyed_method_caller<result_T, any[]> { }
/**
 * 简易事件调用器  
 * 直接调用以触发事件！
 * @example
 * let data=await jsstp.OnTest(123,"abc");
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Event": "OnTest",
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 * @group callers
 */
interface simple_event_caller extends simple_keyed_method_caller<sstp_info_t> { }
/**
 * 简易命令调用器
 * @example
 * let data=await jsstp.SetCookie("abc","def");
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Command": "SetCookie",
 * 	"Reference0": "abc",
 * 	"Reference1": "def"
 * });
 * @group callers
 */
interface simple_command_caller extends simple_keyed_method_caller<sstp_info_t> { }
/**
 * 对参数进行简易处理的列表返值命令执行器
 * @example
 * let data=await jsstp.GetNames();
 * //等价于
 * let data = await jsstp.SEND({
 * 	"Command": "GetNames"
 * });
 * @group callers
 */
interface simple_list_command_caller extends simple_keyed_method_caller<list_info_t> { }

/**
 * 比{@link jsstp_t}多了一个ghost_info属性  
 * 依赖{@link jsstp_t.default_info}中的`ReceiverGhostHWnd`定向给特定的ghost发送信息
 * @see {@link jsstp_with_ghost_info_t.ghost_info}
 */
interface jsstp_with_ghost_info_t extends jsstp_t {
	/**
	 * 该jsstp_t实例所指向的ghost的信息
	 */
	ghost_info: single_fmo_info_t
}
/**
 * jsstp对象
 * @see {@link jsstp}
 * @alias jsstp.type
 * @example
 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
 */
declare class jsstp_t {
	/**
	 * @group Types
	 */
	type: typeof jsstp_t;
	/**
	 * @group Types
	 */
	base_sstp_info_t: typeof base_sstp_info_t;
	/**
	 * @group Types
	 */
	sstp_info_t: typeof sstp_info_t;
	/**
	 * @group Types
	 */
	fmo_info_t: typeof fmo_info_t;
	/**
	 * @group Types
	 */
	list_info_t: typeof list_info_t;
	/**
	 * @group Types
	 */
	ghost_events_queryer_t: typeof ghost_events_queryer_t;

	/**
	 * @group SSTP Base Methods
	*/
	SEND: method_caller<sstp_info_t, [common_event_sstp_content_t]>;
	/**
	 * @group SSTP Base Methods
	*/
	NOTIFY: method_caller<sstp_info_t, [common_event_sstp_content_t]>;
	/**
	 * @group SSTP Base Methods
	*/
	COMMUNICATE: method_caller<sstp_info_t, [common_communicate_sstp_content_t]>;
	/**
	 * @group SSTP Base Methods
	*/
	EXECUTE: method_caller<sstp_info_t, [common_execute_sstp_content_t]>;
	/**
	 * @group SSTP Base Methods
	*/
	GIVE: method_caller<sstp_info_t, [common_give_sstp_content_t]>;

	/**
	 * 匹配事件名称以产生简易调用器
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.OnTest(123,"abc");
	 */
	[key: `On${string}`]: simple_event_caller;
	/**
	 * 匹配事件名称以产生简易调用器
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.GetNames();
	 */
	[key: `Get${string}`]: simple_list_command_caller;
	/**
	 * 匹配事件名称以产生简易调用器
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.SetCookie("abc","def");
	 */
	[key: `Set${string}`]: simple_command_caller;

	/**
	 * 在fecth时使用的header
	 */
	RequestHeader: {
		[key: string]: string,
	};
	/**
	 * 默认的报文内容
	 */
	default_info: base_sstp_content_t;

	/**
	 * SSTP协议版本号列表
	 */
	sstp_version_table: {
		[method: string]: Number
	};
	/**
	 * 查询默认的安全等级，在nodejs中为"local"，在浏览器中为"external"
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;

	/**
	 * 自身代理
	 */
	proxy: jsstp_t;

	/**
	 * 基础jsstp对象
	 * @param {String} sender_name 对象与服务器交互时的发送者名称
	 * @param {String} host 目标服务器地址
	 * @returns {jsstp_t}
	 */
	/*@__PURE__*/constructor(sender_name?: String, host?: String);
	/**
	 * 修改host
	 * @param {string} host
	 * @group Properties
	 */
	set host(host: string);
	/*@__PURE__*/get host(): string;
	/**
	 * 修改sendername
	 * @param {String} sender_name
	 * @group Properties
	 */
	set sendername(sender_name: String);
	/*@__PURE__*/get sendername(): String;

	/**
	 * 复制一个新的jsstp对象
	 * @group Clone Methods
	 */
	get clone(): jsstp_t;

	/**
	 * 复制一个新的jsstp对象对于给定的fmo_info
	 * @param fmo_info 目标ghost的fmo_info
	 * @returns {jsstp_t} 新的指向目标ghost的jsstp对象
	 * @group Clone Methods
	 */
	by_fmo_info(fmo_info: single_fmo_info_t): jsstp_with_ghost_info_t;

	/**
	 * 对于所有ghost的fmoinfo进行处理
	 * @param {Function|undefined} operation 操作函数
	 */
	for_all_ghost_infos<result_T>(operation: (fmo_info: single_fmo_info_t) => result_T): Promise<info_object<string, result_T>>;
	/**
	 * 对于所有ghost进行操作
	 * @param {Function|undefined} operation 操作函数
	 */
	for_all_ghosts<result_T>(operation: (jsstp: jsstp_with_ghost_info_t) => result_T): Promise<info_object<string, result_T>>;

	/**
	 * 以文本发送报文并以文本接收返信
	 * @param {any} info 报文体（文本）
	 * @returns {Promise<String>} 返回一个promise
	 * @group Basic Send Methods
	 */
	row_send(info: any): Promise<String>;
	/**
	 * 发送报文，但是不对返回结果进行处理
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @returns {Promise<String>} 返回一个promise
	 * @group Basic Send Methods
	 */
	costom_text_send(sstphead: String, info: Object): Promise<String>;
	/**
	 * 发送报文
	 * @param {String} sstphead 报文头
	 * @param {Object} info 报文体
	 * @param {new (info: String)=> result_type} result_type 返回结果的类型，默认为sstp_info_t
	 * @returns {Promise<sstp_info_t>} 返回一个promise
	 * @group Basic Send Methods
	 */
	costom_send<T>(sstphead: String, info: Object, result_type: new (str: string) => T): Promise<T>;

	/**
	 * 获取指定方法的调用器
	 * @param {String} method_name 方法名称
	 * @param {new (info: String) => result_type} [result_type=sstp_info_t] 返回结果的类型，默认为sstp_info_t
	 * @param {Function} [args_processor=info => info] 参数处理器，默认直接返回输入参数
	 * @returns {method_caller} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_method<T = sstp_info_t, Rest extends any[] = [Object], Res = Object>(
		method_name: String, result_type?: new (str: string) => T, args_processor?: (...args: Rest) => Res
	): method_caller<T, Rest>;
	/**
	 * 获取指定key的调用器
	 * @param {String} key_name 键名
	 * @param {String} value_name 键值
	 * @param {Function} method_caller 方法调用器
	 * @param {Function} args_processor 参数处理器
	 * @returns {Proxy<value>} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_key<T = sstp_info_t, Rest extends any[] = [Object], Res = Object>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T, [Res]>,
		args_processor?: (...args: Rest) => Res
	): base_keyed_method_caller<T, Rest>;

	/**
	 * 用于获取指定key的简单调用器
	 * @param {String} key_name 键名
	 * @param {String} value_name 键值
	 * @param {Function} method_caller 方法调用器
	 * @returns {Proxy<value>} 调用器
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_simple_caller_of_key<T = sstp_info_t>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T, [Object]>,
	): simple_keyed_method_caller<T>;
	/**
	 * 用于获取指定事件的简单调用器的代理
	 * @returns {Proxy}
	 * @example
	 * jsstp.event.OnTest("test");
	 * @group Indexer Members
	 */
	/*@__PURE__*/get event(): {
		[event_name: string]: simple_event_caller
	}
	/**
	 * 用于获取指定命令的执行器的代理
	 * @returns {Proxy}
	 * @example
	 * jsstp.command.GetFMO();
	 * @group Indexer Members
	 */
	/*@__PURE__*/get command(): {
		[command_name: string]: simple_command_caller
	}
	/**
	 * 判断是否存在某个事件  
	 * 若可能频繁调用，使用{@link ghost_events_queryer_t}（通过{@link jsstp_t.new_event_queryer}获取）来查询
	 * @param {String} event_name 事件名
	 * @param {security_level_t} security_level 安全等级
	 * @returns {Promise<Boolean>} 是否存在
	 * @example
	 * jsstp.has_event("OnTest").then(result => console.log(result));
	 * @example
	 * //示例代码(AYA):
	 * SHIORI_EV.On_Has_Event : void {
	 * 	_event_name=reference.raw[0]
	 * 	_SecurityLevel=reference.raw[1]
	 * 	if !_SecurityLevel
	 * 		_SecurityLevel=SHIORI_FW.SecurityLevel
	 * 	if SUBSTR(_event_name,0,2) != 'On'
	 * 		_event_name='On_'+_event_name
	 * 	_result=0
	 * 	if TOLOWER(_SecurityLevel) == 'external'
	 * 		_event_name='ExternalEvent.'+_event_name
	 * 	_result=ISFUNC(_event_name)
	 * 	if !_result
	 * 		_result=ISFUNC('SHIORI_EV.'+_event_name)
	 * 	SHIORI_FW.Make_X_SSTP_PassThru('Result',_result)
	 * }
	 * SHIORI_EV.ExternalEvent.On_Has_Event{
	 * 	SHIORI_EV.On_Has_Event
	 * }
	 */
	/*@__PURE__*/has_event(event_name: String, security_level?: security_level_t): Promise<Boolean>;
	/**
	 * 以约定好的结构获取支持的事件，需要ghost支持`Get_Supported_Events`事件  
	 * 若不确定ghost的支持情况，使用{@link ghost_events_queryer_t}（通过{@link jsstp_t.new_event_queryer}获取）来查询
	 * @returns {Promise<{local:string[],external:string[]}>} 包含local和external两个数组的Object
	 * @example
	 * jsstp.get_supported_events().then(result => console.log(result));
	 * @example
	 * //示例代码(AYA):
	 * SHIORI_EV.On_Get_Supported_Events: void {
	 * 	_L=GETFUNCLIST('On')
	 * 	_base_local_event_funcs=IARRAY
	 * 	foreach _L;_func{
	 * 		if SUBSTR(_func,2,1) == '_'
	 * 			_func=SUBSTR(_func,3,STRLEN(_func))
	 * 		_base_local_event_funcs,=_func
	 * 	}
	 * 	_L=GETFUNCLIST('SHIORI_EV.On')
	 * 	foreach _L;_func{
	 * 		if SUBSTR(_func,12,1) == '_'
	 * 			_func=SUBSTR(_func,13,STRLEN(_func))
	 * 		_base_local_event_funcs,=_func
	 * 	}
	 * 	SHIORI_FW.Make_X_SSTP_PassThru('local',ARRAYDEDUP(_base_local_event_funcs))
	 * 	_L=GETFUNCLIST('ExternalEvent.On')
	 * 	_base_external_event_funcs=IARRAY
	 * 	foreach _L;_func{
	 * 		if SUBSTR(_func,16,1) == '_'
	 * 			_func=SUBSTR(_func,17,STRLEN(_func))
	 * 		_base_external_event_funcs,=_func
	 * 	}
	 * 	_L=GETFUNCLIST('SHIORI_EV.ExternalEvent.On')
	 * 	foreach _L;_func{
	 * 		if SUBSTR(_func,26,1) == '_'
	 * 			_func=SUBSTR(_func,27,STRLEN(_func))
	 * 		_base_external_event_funcs,=_func
	 * 	}
	 * 	SHIORI_FW.Make_X_SSTP_PassThru('external',ARRAYDEDUP(_base_external_event_funcs))
	 * }
	 * SHIORI_EV.ExternalEvent.On_Get_Supported_Events{
	 * 	SHIORI_EV.On_Get_Supported_Events
	 * }
	 */
	/*@__PURE__*/get_supported_events(): Promise<{
		local: string[],
		external: string[]
	}>;
	/**
	 * 获取fmo信息
	 * @returns {Promise<fmo_info_t>} fmo信息
	 * @example
	 * let fmo=await jsstp.get_fmo_infos();
	 * if(fmo.available)
	 * 	console.log(fmo);
	 */
	/*@__PURE__*/get_fmo_infos(): Promise<fmo_info_t>;
	/**
	 * 获取当前ghost是否可用
	 * @returns {Promise<Boolean>} ghost是否可用
	 * @example
	 * if(await jsstp.available())
	 * 	//do something
	 * else
	 * 	console.error("ghost不可用,请检查ghost是否启动");
	 */
	/*@__PURE__*/available(): Promise<Boolean>;
	/**
	 * 获取当前ghost是否可用
	 * @param {(jsstp:jsstp_t)=>any} resolve ghost可用时执行的函数
	 * @returns {Promise<any>} ghost是否可用，若可用则以jsstp为参数执行resolve，否则执行reject
	 * @example
	 * jsstp.if_available(() => {
	 * 	//do something
	 * });
	 * @example
	 * xxx.then(v => jsstp.if_available()).then(() => {
	 * 	//do something
	 * });
	 * @group PromiseLike Methods
	 */
	/*@__PURE__*/if_available<result_T = undefined>(resolve: (value?: jsstp_t) => result_T): Promise<result_T>;
	/**
	 * 获取一个用于查询ghost所支持事件的queryer
	 * @returns {Promise<ghost_events_queryer_t>} 查询支持事件的queryer
	 * @example
	 * jsstp.new_event_queryer().then(queryer => 
	 * 	queryer.check_event("OnTest").then(result =>
	 * 		console.log(result)
	 * 	)
	 * );
	 */
	/*@__PURE__*/new_event_queryer(): Promise<ghost_events_queryer_t>;
}

/**
 * ghost事件查询器
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("当前ghost不支持事件查询");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
declare class ghost_events_queryer_t extends ExtensibleFunction<[string, security_level_t], Promise<Boolean>> {
	/**
	 * 构造一个事件查询器
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/constructor(base_jsstp: jsstp_t);
	/**
	 * 查询默认的安全等级，在nodejs中为"local"，在浏览器中为"external"
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;
	/**
	 * 检查事件是否存在，ghost至少需要`Has_Event`事件的支持，并可以通过提供`Get_Supported_Events`事件来提高效率
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer.check_event("On_connect");
	 * @see 基于 {@link jsstp_t.has_event} 和 {@link jsstp_t.get_supported_events}
	 */
	/*@__PURE__*/check_event(event_name: String, security_level?: security_level_t): Promise<Boolean>;
	/**
	 * 检查是否能够检查事件
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.available)
	 * 	console.error("无法检查事件");
	 */
	/*@__PURE__*/get available(): Boolean;
	/**
	 * 检查是否能够使用`Get_Supported_Events`快速获取支持的事件列表
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.fast_query_available)
	 * 	console.info("无法快速获取支持的事件列表");
	 * else
	 * 	console.info("好哦");
	 * @description 如果不支持也只是会变慢，`check_event`仍然可以使用
	 */
	/*@__PURE__*/get fast_query_available(): Boolean;
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	reset(): Promise<ghost_events_queryer_t>;
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	init(): Promise<ghost_events_queryer_t>;
	clear(): void;
}
/**
 * ghost事件查询器
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("当前ghost不支持事件查询");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
interface ghost_events_queryer_t {
	/**
	 * 构造一个事件查询器
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/new(base_jsstp: jsstp_t): ghost_events_queryer_t;
	/**
	 * 调用声明  
	 * 检查事件是否存在，ghost至少需要`Has_Event`事件的支持，并可以通过提供`Get_Supported_Events`事件来提高效率
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer("On_connect");
	 * @see 基于 {@link ghost_events_queryer_t.check_event}
	 */
	/*@__PURE__*/(event_name: String, security_level?: security_level_t): Promise<Boolean>;
}

/**
 * sstp包装器
 * @example
 * jsstp.SEND({
 * 	Event: "OnTest",
 * 	Script: "\\s[0]Hell Wold!\\e"
 * });
 * @var jsstp
 * @type {jsstp_t}
 * @global
 */
declare var jsstp: jsstp_t;

export { base_sstp_info_t, jsstp as default, fmo_info_t, ghost_events_queryer_t, jsstp, jsstp_t, list_info_t, sstp_info_t };
