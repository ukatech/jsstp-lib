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
 * @enum {number}
 */
type sstp_return_code_t = number & documented_sstp_return_code_t;
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
	 * 这可以和[version.json](https://ssp.shillest.net/archive/version.json)的`ssp.full.version`等简单比较，就可以检查是否是最新版
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
	 * 将合成好的表面图片输出到指定的目录。参数和`\![execute,dumpsurface]`相同  
	 * 响应会在处理结束后才返回，注意  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	DumpSurface = "DumpSurface",
	/**
	 * 不通过Sakura Script执行和`\![moveasync]`相同的事情。参数指定方法和Sakura Script版相同  
	 * 因为不能在SSTP的超时时间内返回响应，而且会导致死锁，所以不能执行没有async的move  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	MoveAsync = "MoveAsync",
	/**
	 * 不通过Sakura Script执行和`\![set,tasktrayicon]`相同的事情。参数指定方法和Sakura Script版相同  
	 * 没有附加数据（状态码200系列表示成功）
	 */
	SetTrayIcon = "SetTrayIcon",
	/**
	 * 不通过Sakura Script执行和`\![set,trayballoon]`相同的事情。参数指定方法和Sakura Script版相同  
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
type sstp_command_name_t = string & documented_sstp_command_name_t;
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

export {
	ExtensibleFunction, security_level_t, sstp_return_code_t,
	base_sstp_content_t,
	common_event_sstp_content_t,
	common_communicate_sstp_content_t,
	common_give_sstp_content_t,
	common_execute_sstp_content_t
};
