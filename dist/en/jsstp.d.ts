/**
 * An extensible function type that can be initialised with a function for a more readable derived class function type
 */
declare class ExtensibleFunction<args_T extends Array<any>, return_T> extends Function {
	/**
	 * Initializing from a function instance
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	constructor(func: (...args: args_T) => return_T);
	/**
	 * Calls a function and replaces the function's this value with the specified object and the function's arguments with the specified array.  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
	 * @param thisArg The object that will be used as the this object.
	 * @param argArray A set of arguments to be passed to the function.
	 */
	apply(thisArg: (...args: args_T) => return_T, argArray?: args_T): return_T;

	/**
	 * Calls a method on an object that replaces the current object with another object.  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
	 * @param thisArg The object that will be used as the current object.
	 * @param argArray The list of arguments to be passed to the method.
	 */
	call(thisArg: (...args: args_T) => return_T, ...argArray: args_T): return_T;

	/**
	 * For a given function, creates a bound function with the same body as the original function.  
	 * The this object of the bound function is associated with the specified object and has the specified initial argument.  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
	 * @param thisArg An object that the this keyword can refer to in the new function.
	 * @param argArray A list of arguments to be passed to the new function.
	 */
	bind(thisArg: (...args: args_T) => return_T, ...argArray: any): (...args: args_T) => return_T;

	/**
	 * Function's name.  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
	 */
	readonly name: string;

	/**
	 * The number of arguments expected by the function.  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
	 */
	readonly length: number;
}
interface ExtensibleFunction<args_T extends Array<any>, return_T> {
	/**
	 * Initializing from a function instance
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	new(func: (...args: args_T) => return_T): ExtensibleFunction<args_T, return_T>;
	/**
	 * The function's signature
	 */
	(...args: args_T): return_T;
}
/**
 * Security levels in ghost interactions
 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
 */
type security_level_t = "local" | "external";
/**
 * SSTP return codes  
 * Same as HTTP, 200s are OK, others are errors.
 * @enum {number}
 */
declare enum documented_sstp_return_code_t {
	/** OK (with return value) */
	OK = 200,
	/** OK (without return value) */
	NO_CONTENT = 204,
	/**
	 * Executed but broke during script execution  
	 * ※Only for very limited situations such as SEND/1.x with Entry, normally it will return 200 or 204 immediately.
	 */
	BREAK = 210,
	/** Something in the request can't be processed */
	BAD_REQUEST = 400,
	/** Ghost specified in SSTP is not installed or started ※SSP only */
	NOT_FOUND = 404,
	/** Timeout: cannot communicate with ghost/SHIORI side (rarely happens) */
	REQUEST_TIMEOUT = 408,
	/** \t tag or other state that prohibits interruption, or processing another request */
	CONFLICT = 409,
	/** SSTP request is too long and was rejected ※SSP only */
	PAYLOAD_TOO_LARGE = 413,
	/** Rejected by ghost side settings */
	REFUSE = 420,
	/** Some problem was detected inside the system that cannot be handled ※SSP only */
	INTERNAL_SERVER_ERROR = 500,
	/** Contains unimplemented commands, etc., that cannot be processed */
	NOT_IMPLEMENTED = 501,
	/** Cannot accept SSTP due to internal system reasons */
	SERVICE_UNAVAILABLE = 503,
	/** SSTP version is strange (lower than 1.0, higher than 3.0, etc.) ※SSP only */
	VERSION_NOT_SUPPORTED = 505,
	/** Ghost not displayed due to minimization, etc., and nothing can be processed */
	INVISIBLE = 512,
	/** Content Parse Error */
	PARSE_ERROR = NaN
}
/**
 * SSTP return codes  
 * Same as HTTP, 200s are OK, others are errors.
 * @enum {number}
 */
type sstp_return_code_t = number & documented_sstp_return_code_t;
/**
 * Basic SSTP packet
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#req_res}
 */
type base_sstp_content_t = {
	/**
	 * The character encoding of the request. It's best if it appears on the first line.  
	 * If there is no special reason, UTF-8 is recommended.
	 */
	CharSet: string | undefined,

	/**
	 * A string that indicates the sender. Something like "SSTP sending tool". In the case of the COMMUNICATE method, it's the name of the ghost's \0 that sent it.
	 */
	Sender: string | undefined,

	/**
	 * The security level specification for processing with SHIORI and SakuraScript. Either local/external.  
	 * Only valid for DirectSSTP, or requests that clearly come from local (like 127.0.0.1).
	 */
	SecurityLevel: security_level_t | undefined,

	/**
	 * An option that specifies how the SakuraScript executed by SSTP is handled.  
	 * Multiple can be specified with commas. The strings to specify are as follows.  
	 * nodescript - Disable the SSTP display of the balloon (invalid for remote SSTP)  
	 * notranslate - Do not perform translation processing with OnTranslate or MAKOTO  
	 * nobreak - Do not interrupt the script that is currently running, wait until it ends
	 */
	Option: string | undefined,

	/**
	 * The so-called "Owned SSTP". If it is specified by the ID sent by SHIORI uniqueid or the FMO ID (SSP only), it is treated as the same priority as the internal processing of the ghost, and will ignore various security checks and locks.  
	 * The SecurityLevel specification becomes local, and even in the case of states that prohibit interruption such as \t, it forcibly interrupts and plays.
	 */
	ID: string | undefined,

	/**
	 * A header that is passed directly to SHIORI during communication with the ghost, such as NOTIFY.  
	 * Only the minimum processing such as character code conversion is performed, and the contents of the (arbitrary string) are relayed as they are.
	 */
	[key: `X-SSTP-PassThru-${string}`]: string | undefined,

	/**
	 * DirectSSTP only, indicates the window handle to which the response should be returned.  
	 * The data of the window handle (equivalent to a pointer) is treated as an unsigned decimal integer and then stringized.  
	 * If omitted, it is wParam of WM_COMMUNICATE.
	 */
	HWnd: string | undefined,

	/**
	 * (Socket)SSTP only, indicates the window handle of the ghost's \0 to which the request should be sent.  
	 * If you specify this, the ghost to be processed is fixed, and the same processing as DirectSSTP is possible via Socket.  
	 * If not found, it will end immediately with an error of 404 Not Found.
	 */
	ReceiverGhostHWnd: string | undefined,

	/**
	 * (Socket)SSTP only, indicates the name of the ghost's \0 to which the request should be sent.  
	 * If you specify this, the ghost to be processed is fixed, and the same processing as DirectSSTP is possible via Socket. The name version of HWnd.  
	 * If not found, it will end immediately with an error of 404 Not Found.
	 */
	ReceiverGhostName: string | undefined,

	/**
	 * Other SSTP contents
	 */
	[key: string]: string | undefined
};
/**
 * Common Event SSTP packet
 * @see {@link https://ukagakadreamteam.github.io/ukadoc/manual/spec_sstp.html#method_notify}
 */
type common_event_sstp_content_t = {
	/**
	 * The name of the event
	 */
	Event: string
	/**
	 * Arguments
	 */
	[key: `Reference${number}`]: any
	/**
	* If the name of the ghost is specified in the format of \0 side name and \1 side name, the {@link common_event_sstp_content_t.Script} header that follows it will be considered as specific to that ghost.  
	* If the content is omitted, the same Script header will be played for any ghost.  
	* If the SSTP ghost activation option is enabled, the ghost specified here will be temporarily booted.  
	* Due to language limitations in js, only one ghost can be specified here.  
	* When multiple IfGhosts are needed, consider using {@link jsstp_t.row_send} to send SSTP messages
	*/
	IfGhost: string | undefined
	/**
	* Sakura script  
	* If the Script header does not follow immediately after the IfGhost, it will be the default processing script when it does not correspond to the IfGhost.  
	* Due to language limitations in js, only one script can be specified here.  
	* When multiple Scripts are needed, consider using {@link jsstp_t.row_send} to send SSTP messages
	*/
	Script: string | undefined
	/**
	 * Other SSTP contents
	 */
	[key: string]: string | undefined
};
/**
 * @enum {string} documented_sstp_command_name_t
 * @description An enumeration of the documented SSTP commands.
 */
declare enum documented_sstp_command_name_t {
	/**
	 * Returns the names of the active ghosts in the format of (\0 name),(\1 name) separated by commas.
	 */
	GetName = "GetName",
	/**
	 * Returns the list of the installed ghosts in the format of one \0 name per line, terminated by an empty line.
	 */
	GetNames = "GetNames",
	/**
	 * Returns the information equivalent to the contents of FMO, which is a file that stores the state of the active ghosts.  
	 * However, this command only returns the information for the application that communicates via SSTP, not the shared FMO for all concurrently running applications.  
	 * This command is mainly used for console applications that do not have a window and cannot send Direct SSTP, to achieve the functionality equivalent to Direct SSTP using Socket SSTP and the ReceiverGhostHWnd header.  
	 * The format is one line per ghost, terminated by an empty line.  
	 * If the request is from a remote client, the path information is omitted and the header and hwnd are replaced by dummy values.
	 */
	GetFMO = "GetFMO",
	/**
	 * Returns the name of the active ghost body (the name field in descript.txt).
	 */
	GetGhostName = "GetGhostName",
	/**
	 * Returns the name of the current shell used by the active ghost.
	 */
	GetShellName = "GetShellName",
	/**
	 * Returns the name of the current balloon used by the active ghost.
	 */
	GetBalloonName = "GetBalloonName",
	/**
	 * Returns the version of the baseware (the software that runs the ghost).
	 */
	GetVersion = "GetVersion",
	/**
	 * Returns the list of the names of all ghosts recognized by SSP (the name field in descript.txt) in the format of one line per name, terminated by an empty line.
	 */
	GetGhostNameList = "GetGhostNameList",
	/**
	 * Returns the list of the names of all shells recognized by the active ghost (the name field in descript.txt) in the format of one line per name, terminated by an empty line.
	 */
	GetShellNameList = "GetShellNameList",
	/**
	 * Returns the list of the names of all balloons recognized by SSP (the name field in descript.txt) in the format of one line per name, terminated by an empty line.
	 */
	GetBalloonNameList = "GetBalloonNameList",
	/**
	 * Returns the list of the names of all headlines recognized by SSP (the name field in descript.txt) in the format of one line per name, terminated by an empty line.
	 */
	GetHeadlineNameList = "GetHeadlineNameList",
	/**
	 * Returns the list of the names of all plugins recognized by SSP (the name field in descript.txt) in the format of one line per name, terminated by an empty line.
	 */
	GetPluginNameList = "GetPluginNameList",
	/**
	 * Returns the version of the baseware (the software that runs the ghost) in the format of just the version number separated by periods.  
	 * This can be used to check if the baseware is the latest version by simply comparing it with `ssp.full.version` in [version.json](https://ssp.shillest.net/archive/version.json) or similar.
	 */
	GetShortVersion = "GetShortVersion",
	/**
	 * Makes the ghost quiet until Restore is executed or 16 seconds have elapsed. No additional data (success with status code 200 series).
	 */
	Quiet = "Quiet",
	/**
	 * Cancels Quiet. No additional data (success with status code 200 series).
	 */
	Restore = "Restore",
	/**
	 * Compresses the files in the specified folder into a compressed file.  
	 * The response is not returned until the process is finished, so be careful.  
	 * Parameter 0: Compressed file name  
	 * Parameter 1: Full path of the folder to be compressed  
	 * No additional data (success with status code 200 series).
	 */
	CompressArchive = "CompressArchive",
	/**
	 * Decompresses the specified compressed file.  
	 * The response is not returned until the process is finished, so be careful.  
	 * Parameter 0: Compressed file name  
	 * Parameter 1: Full path of the folder to be decompressed  
	 * No additional data (success with status code 200 series).
	 */
	ExtractArchive = "ExtractArchive",
	/**
	 * Outputs the synthesized surface image to the specified directory. The parameters are the same as `\![execute,dumpsurface]`.  
	 * The response is not returned until the process is finished, so be careful.  
	 * No additional data (success with status code 200 series).
	 */
	DumpSurface = "DumpSurface",
	/**
	 * Executes the same thing as `\![moveasync]` without using Sakura Script. The parameter specification method is the same as the Sakura Script version.  
	 * Move without async cannot be executed because it cannot return a response before the SSTP timeout and causes a deadlock.  
	 * No additional data (success with status code 200 series).
	 */
	MoveAsync = "MoveAsync",
	/**
	 * Executes the same thing as `\![set,tasktrayicon]` without using Sakura Script. The parameter specification method is the same as the Sakura Script version.  
	 * No additional data (success with status code 200 series).
	 */
	SetTrayIcon = "SetTrayIcon",
	/**
	 * Executes the same thing as `\![set,trayballoon]` without using Sakura Script. The parameter specification method is the same as the Sakura Script version.  
	 * No additional data (success with status code 200 series).
	 */
	SetTrayBalloon = "SetTrayBalloon",
	/**
	 * Writes a value to the property system.  
	 * Parameter 0: Property name  
	 * Parameter 1: Value to be set  
	 * No additional data (success with status code 200 series).
	 */
	SetProperty = "SetProperty",
	/**
	 * Reads a value from the property system.  
	 * Parameter 0: Property name  
	 * The additional data is the value of the property obtained.
	 */
	GetProperty = "GetProperty",
	/**
	 * Writes to the generic data storage area that is saved for each client name specified by Sender.  
	 * It is intended to be used in the same way as the browser's \"cookie\".  
	 * Parameter 0: Cookie name  
	 * Parameter 1: Value to be set  
	 * No additional data (success with status code 200 series).
	 */
	SetCookie = "SetCookie",
	/**
	 * Reads from the generic data storage area that is saved for each client name specified by Sender.  
	 * Parameter 0: Cookie name  
	 * The additional data is the value of the cookie obtained.
	 */
	GetCookie = "GetCookie"
}
/**
 * SSTP command name
 * @enum {string}
 */
type sstp_command_name_t = string & documented_sstp_command_name_t;
/**
 * Common SSTP execute packet content
 * @see {@link https://ukagakadreamteam.github.io/ukadoc/manual/spec_sstp.html#method_execute}
 */
type common_execute_sstp_content_t = {
	/**
	 * The command to execute.
	 */
	Command: sstp_command_name_t | `${sstp_command_name_t}[${string}]`
	/**
	 * The parameter information for the execution.
	 */
	[key: `Reference${number}`]: any
	/**
	 * Other SSTP content
	 */
	[key: string]: string | undefined
};
/**
 * Common SSTP communicate packet content
 * @see {@link https://ukagakadreamteam.github.io/ukadoc/manual/spec_sstp.html#method_communicate}
 */
type common_communicate_sstp_content_t = {
	/**
	 * The Sakura Script to transmit
	 */
	Sentence: string
	/**
	 * The extended information for the communication.  
	 * Stored in Reference2 and later in SHIORI/3.0. SSTP Reference0 = SHIORI Reference2.
	 */
	[key: `Reference${number}`]: any
	/**
	 * The surface numbers of \0 and \1 at the communication sending point (≒ script execution end point) of the source ghost.  
	 * Passed as Surface header in OnCommunicate event.
	 * @example `5,11` //means \0 is 5, \1 is 11
	 */
	Surface: string
	/**
	 * Other SSTP content
	 */
	[key: string]: string | undefined
};
/**
 * Common SSTP give packet content
 * @see {@link https://ukagakadreamteam.github.io/ukadoc/manual/spec_sstp.html#method_give}
 */
type common_give_sstp_content_t = {
	/**
	 * The text to give  
	 * In SHIORI/3.0, this is the same as user communication and generates the OnCommunicate event.
	 */
	Document: string
	/**
	 * The name of the song to give.  
	 * In SHIORI/3.0, OnMusicPlay event occurs and Reference0 becomes the specified string.
	 */
	Song: string
	/**
	 * Other SSTP content
	 */
	[key: string]: string | undefined
};

/**
 * Extend object to provide some simple and iterative operations.
 */
declare class info_object<key_T = PropertyKey, value_T = any> {
	/**
	 * @description Get an array of all keys
	 */
	/*@__PURE__*/get keys(): key_T[];
	/**
	 * @description Get an array of all values
	 */
	/*@__PURE__*/get values(): value_T[];
	/**
	 * @description Get an array of all key-value pairs.
	 */
	/*@__PURE__*/get entries(): [key_T, value_T][];
	/**
	 * @description Get the number of members
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * @description Execute a function for each key-value pair.
	 * @param {(value,key?)} func A function to be executed that replaces value if the return value is not undefined.
	 */
	/*@__PURE__*/forEach(func: (value: value_T, key?: key_T) => value_T | undefined): void;
	/**
	 * @description Copy a new object
	 * @returns {info_object} Copied object
	 */
	/*@__PURE__*/get trivial_clone(): info_object<key_T, value_T>;
	/**
	 * @description Traverses itself and its children and returns a one-dimensional array of traversal results.
	 * @param {(dimensions[...] ,value):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...key_T[], value_T]) => T): T[];
	/**
	 * @description Traverses itself and returns a one-dimensional array of traversal results.
	 * @param {(value,key?):any} func Function to execute, the return value will be added to the array.
	 */
	/*@__PURE__*/map<T>(func: (value: value_T, key?: key_T) => T): T[];
	/**
	 * @description Append elements to itself as an array.
	 * @param {[undefined|[key_T,value_T]]} array Array to append to.
	 */
	/*@__PURE__*/push(array: [undefined | [key_T, value_T]]): void;
}

/**
 * Base sstp message class
 * @example
 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTP Client\r\nScript: \\h\\s0Testing!\\u\\s[10]It's a test.\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.base_sstp_info_t
 */
declare class base_sstp_info_t<key_T = PropertyKey, value_T = any> extends info_object<key_T, value_T> {
	/**
	 * Constructing sstp_info_t from split string or object messages, is not recommended.
	 * @param {String} info_head The header of the message.
	 * @param {Object} info_body The body of the message in object format.
	 * @param {Array<String>|undefined} unknown_lines Array of unknown lines.
	 * @see {@link sstp_info_t.constructor}
	 * @ignore
	 */
	/*@__PURE__*/constructor(info_head: String, info_body: Object, unknown_lines?: String[]);
	/**
	 * Get array of unknown rows
	 * @returns {Array<String>} array of unknown rows
	 */
	/*@__PURE__*/get unknown_lines(): Array<String>;
	/**
	 * Get the header of the message
	 * @returns {String} message header
	 */
	/*@__PURE__*/get head(): String;
	/**
	 * Getting a String Message
	 * @returns {String} String message.
	 */
	/*@__PURE__*/get text_content(): String;
	/**
	 * Get the object to use for `JSON.stringify`.
	 * @returns {Object} The object to use for `JSON.stringify`.
	 * @example console.log(JSON.stringify(info));
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;
	/**
	 * Get header return code (`NaN` if unexpected)
	 * @returns {sstp_return_code_t} header return code (`NaN` if unexpected)
	 */
	/*@__PURE__*/get status_code(): sstp_return_code_t;
	/**
	 * Other message members
	 * @type {any|undefined}
	 */
	[key: string]: any | undefined;
}

/**
 * sstp message class
 * @example
 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTP Client\r\nScript: \\h\\s0Testing!\\u\\s[10]It's a test.\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.sstp_info_t
 */
declare class sstp_info_t extends base_sstp_info_t<string, string> {
	/**
	 * Constructing sstp_info_t from a string
	 * @param {String} str string message
	 * @returns {sstp_info_t} Constructed sstp_info_t
	 * @example
	 * let info = new sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTP Client\r\nScript: \\h\\s0Testing!\\u\\s[10]It's a test.\r\nOption: notranslate\r\n\r\n");
	 */
	/*@__PURE__*/constructor(str: String);
	/**
	 * Get the value of PassThru
	 * @param {String} key The name of the PassThru to get.
	 * @returns {String|undefined} the value of PassThru
	 */
	/*@__PURE__*/get_passthrough(key: String): String | undefined;
	/**
	 * Get all PassThru
	 * @returns {info_object} all PassThru
	 */
	/*@__PURE__*/get passthroughs(): info_object;
	/**
	 * Get the original object
	 * @returns {sstp_info_t} raw object
	 */
	/*@__PURE__*/get raw(): sstp_info_t;

	/**
	 * Other message members
	 * @type {String|undefined}
	 */
	[key: string]: String | undefined;
}

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
	/**
	 * fmo members
	 * @type {single_fmo_info_t|undefined}
	 */
	[uuid: string]: single_fmo_info_t | undefined;
}

/**
 * List message object
 * @example
 * let list = jsstp.GetNames();
 * for(let name of list)
 * 	console.log(name);
 * @alias jsstp.list_info_t
 */
declare class list_info_t extends base_sstp_info_t<number, string> {
	/**
	 * Constructs list_info_t from a string
	 * @param {String} list_text
	 */
	/*@__PURE__*/constructor(list_text: String)
	/**
	 * Get the string representation of the value
	 * @returns {String} The string representation of the value, similar to `${this.values}`
	 * @summary This is not a method to get the string message. If you need to get the string message, please use {@link list_info_t.text_content}
	 * @ignore
	 */
	/*@__PURE__*/toString(): String
	/**
	 * Gets the iterator
	 * @returns {Iterator<Array<String>>} Iterator
	 */
	/*@__PURE__*/[Symbol.iterator](): Iterator<Array<String>>
	/**
	 * Array member
	 * @type {string|undefined}
	 */
	[key: number]: string | undefined;
}

/**
 * sstp method caller
 * @group callers
 */
interface method_caller<T = sstp_info_t, Rest extends any[] = [Object]> {
	(...args: Rest): Promise<T>;
	get_raw(...args: Rest): Promise<String>;
	with_type<nT>(result_type: new (str: string) => nT): method_caller<nT, Rest>;
	bind_args_processor<nRest extends any[]>(processor: (...args: Rest) => Object): method_caller<T, nRest>;
}

/**
 * An extensible caller that can be accessed by members to extend a specific key value
 * @group callers
 */
interface base_keyed_method_caller<T = sstp_info_t, Rest extends any[] = [Object]> extends method_caller<T, Rest> {
	/**
	 * Extensible caller
	 */
	[uuid: string]: base_keyed_method_caller<T, Rest>
}
/**
 * An extensible caller that performs simple processing on call parameters
 * @group callers
 */
interface simple_keyed_method_caller<result_T> extends base_keyed_method_caller<result_T, any[]> {
	/**
	 * Extensible caller
	 */
	[uuid: string]: simple_keyed_method_caller<result_T>
}
/**
 * Simple Event Caller  
 * Directly call to trigger an event!
 * @example
 * let data=await jsstp.OnTest(123,"abc");
 * //equivalent to
 * let data = await jsstp.SEND({
 * 	"Event": "OnTest",
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 * @group callers
 */
interface simple_event_caller extends simple_keyed_method_caller<sstp_info_t> {
	/**
	 * Extensible caller
	 */
	[uuid: string]: simple_event_caller
}
/**
 * Simple Command Caller
 * @example
 * let data=await jsstp.SetCookie("abc","def");
 * //equivalent to
 * let data = await jsstp.SEND({
 * 	"Command": "SetCookie",
 * 	"Reference0": "abc",
 * 	"Reference1": "def"
 * });
 * @group callers
 */
interface simple_command_caller extends simple_keyed_method_caller<sstp_info_t> {
	/**
	 * Extensible caller
	 */
	[uuid: string]: simple_command_caller
}
/**
 * List Return Command Executor with Simple Parameter Processing
 * @example
 * let data=await jsstp.GetNames();
 * //equivalent to
 * let data = await jsstp.SEND({
 * 	"Command": "GetNames"
 * });
 * @group callers
 */
interface simple_list_command_caller extends simple_keyed_method_caller<list_info_t> {
	/**
	 * Extensible caller
	 */
	[uuid: string]: simple_list_command_caller
}

/**
 * One more ghost_info attribute than {@link jsstp_t}  
 * Relies on `ReceiverGhostHWnd` in {@link jsstp_t.default_info} to direct messages to a specific ghost.
 * @see {@link jsstp_with_ghost_info_t.ghost_info}
 */
interface jsstp_with_ghost_info_t extends jsstp_t {
	/**
	 * Information about the ghost pointed to by this instance of jsstp_t
	 */
	ghost_info: single_fmo_info_t
}
/**
 * jsstp object
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
	 * Matches event names to generate a simple invoker
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.OnTest(123,"abc");
	 */
	[key: `On${string}`]: simple_event_caller;
	/**
	 * Matches event names to generate a simple invoker
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.GetNames();
	 */
	[key: `Get${string}`]: simple_list_command_caller;
	/**
	 * Matches event names to generate a simple invoker
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.SetCookie("abc","def");
	 */
	[key: `Set${string}`]: simple_command_caller;

	/**
	 * The header used in fecth.
	 */
	RequestHeader: {
		[key: string]: string,
	};
	/**
	 * Default Message Content
	 */
	default_info: base_sstp_content_t;

	/**
	 * SSTP protocol version number list
	 */
	sstp_version_table: {
		[method: string]: Number
	};
	/**
	 * Queries the default security level, which is "local" in nodejs and "external" in browsers.
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;

	/**
	 * Self Proxy
	 */
	proxy: jsstp_t;

	/**
	 * Basic jsstp object
	 * @param {String} sender_name The name of the sender when the object interacts with the server
	 * @param {String} host Target server address
	 * @returns {jsstp_t}
	 */
	/*@__PURE__*/constructor(sender_name?: String, host?: String);
	/**
	 * Modify host
	 * @param {string} host
	 * @group Properties
	 */
	set host(host: string);
	/*@__PURE__*/get host(): string;
	/**
	 * Modify sendername
	 * @param {String} sender_name
	 * @group Properties
	 */
	set sendername(sender_name: String);
	/*@__PURE__*/get sendername(): String;

	/**
	 * Copy a new jsstp object
	 * @group Clone Methods
	 */
	get clone(): jsstp_t;

	/**
	 * Copy a new jsstp object for the given fmo_info
	 * @param fmo_info fmo_info of target ghost
	 * @returns {jsstp_t} New jsstp object pointing to target ghost
	 * @group Clone Methods
	 */
	by_fmo_info(fmo_info: single_fmo_info_t): jsstp_with_ghost_info_t;

	/**
	 * Processing of fmoinfo for all ghosts
	 * @param {Function|undefined} operation Operator function
	 */
	for_all_ghost_infos<result_T>(operation: (fmo_info: single_fmo_info_t) => result_T): Promise<info_object<string, result_T>>;
	/**
	 * Operate on all ghosts
	 * @param {Function|undefined} operation Operator function
	 */
	for_all_ghosts<result_T>(operation: (jsstp: jsstp_with_ghost_info_t) => result_T): Promise<info_object<string, result_T>>;

	/**
	 * Sends a message in text and receives it back in text
	 * @param {any} info Message body (text)
	 * @returns {Promise<String>} Returns a promise.
	 * @group Basic Send Methods
	 */
	row_send(info: any): Promise<String>;
	/**
	 * Sends the message, but does not process the returned results
	 * @param {String} sstphead The header of the message.
	 * @param {Object} info The body of the message.
	 * @returns {Promise<String>} Returns a promise.
	 * @group Basic Send Methods
	 */
	costom_text_send(sstphead: String, info: Object): Promise<String>;
	/**
	 * Send a custom message
	 * @param {String} sstphead Message header
	 * @param {Object} info The body of the message.
	 * @param {new (info: String)=> result_type} result_type The type of the result, defaults to sstp_info_t
	 * @returns {Promise<sstp_info_t>} Returns a promise
	 * @group Basic Send Methods
	 */
	custom_send<T>(sstphead: String, info: Object, result_type: new (str: string) => T): Promise<T>;

	/**
	 * Get the invoker of a specific method
	 * @param {String} method_name The name of the method
	 * @param {new (info: String) => result_type} [result_type=sstp_info_t] The type of the result, defaults to sstp_info_t
	 * @param {Function} [args_processor=info => info] Argument processor, defaults to returning the input argument directly
	 * @returns {method_caller} The invoker
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_method<T = sstp_info_t, Rest extends any[] = [Object], Res = Object>(
		method_name: String, result_type?: new (str: string) => T, args_processor?: (...args: Rest) => Res
	): method_caller<T, Rest>;
	/**
	 * Get the invoker of a specific key
	 * @param {String} key_name Key name
	 * @param {String} value_name Key value
	 * @param {Function} method_caller Method invoker
	 * @param {Function} args_processor Argument processor
	 * @returns {Proxy<value>} The invoker
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_key<T = sstp_info_t, Rest extends any[] = [Object], Res = Object>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T, [Res]>,
		args_processor?: (...args: Rest) => Res
	): base_keyed_method_caller<T, Rest>;

	/**
	 * Get a simple invoker for a specific key
	 * @param {String} key_name Key name
	 * @param {String} value_name Key value
	 * @param {Function} method_caller Method invoker
	 * @returns {Proxy<value>} The invoker
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_simple_caller_of_key<T = sstp_info_t>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T, [Object]>,
	): simple_keyed_method_caller<T>;
	/**
	 * Proxy for a simple caller to get a specified event
	 * @returns {Proxy}
	 * @example
	 * jsstp.event.OnTest("test");
	 * @group Indexer Members
	 */
	/*@__PURE__*/get event(): {
		[event_name: string]: simple_event_caller
	}
	/**
	 * Proxy to get the executor of a specific command
	 * @returns {Proxy}
	 * @example
	 * jsstp.command.GetFMO();
	 * @group Indexer Members
	 */
	/*@__PURE__*/get command(): {
		[command_name: string]: simple_command_caller
	}
	/**
	 * Determine if an event exists  
	 * Use {@link ghost_events_queryer_t} (obtained via {@link jsstp_t.new_event_queryer}) to query if it is likely to be called frequently
	 * @param {String} event_name event_name
	 * @param {security_level_t} security_level security_level
	 * @returns {Promise<Boolean>} whether or not it exists
	 * @example
	 * jsstp.has_event("OnTest").then(result => console.log(result));
	 * @example
	 * //sample code (AYA):
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
	 * Getting supported events in an agreed structure requires ghost to support `Get_Supported_Events` events  
	 * If unsure of ghost support, use {@link ghost_events_queryer_t} (obtained via {@link jsstp_t.new_event_queryer}) to query
	 * @returns {Promise<{local:string[],external:string[]}>} Object containing both local and external arrays
	 * @example
	 * jsstp.get_supported_events().then(result => console.log(result));
	 * @example
	 * //sample code (AYA):
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
	 * Getting fmo information
	 * @returns {Promise<fmo_info_t>} fmo information
	 * @example
	 * let fmo=await jsstp.get_fmo_infos();
	 * if(fmo.available)
	 * 	console.log(fmo);
	 */
	/*@__PURE__*/get_fmo_infos(): Promise<fmo_info_t>;
	/**
	 * Get whether ghost is currently available
	 * @returns {Promise<Boolean>} whether ghost is available or not
	 * @example
	 * if(await jsstp.available())
	 * 	//do something
	 * else
	 * 	console.error("Ghost is not available, please check if ghost is running.");
	 */
	/*@__PURE__*/available(): Promise<Boolean>;
	/**
	 * Get whether ghost is currently available
	 * @param {(jsstp:jsstp_t)=>any} resolve Functions executed when ghost is available
	 * @returns {Promise<any>} whether ghost is available, if so, resolve with jsstp, otherwise reject.
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
	 * Get a queryer for querying events supported by ghost
	 * @returns {Promise<ghost_events_queryer_t>} Query the queryer for supported events.
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
 * ghost event finder
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("Current ghost does not support event queries");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
declare class ghost_events_queryer_t extends ExtensibleFunction<[string, security_level_t], Promise<Boolean>> {
	/**
	 * Constructing an Event Querier
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/constructor(base_jsstp: jsstp_t);
	/**
	 * Queries the default security level, which is "local" in nodejs and "external" in browsers.
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;
	/**
	 * To check for the existence of events, ghost requires at least `Has_Event` event support and can be made more efficient by providing `Get_Supported_Events` events
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer.check_event("On_connect");
	 * @see base on {@link jsstp_t.has_event} and {@link jsstp_t.get_supported_events}
	 */
	/*@__PURE__*/check_event(event_name: String, security_level?: security_level_t): Promise<Boolean>;
	/**
	 * Check if the event can be checked
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.available)
	 * 	console.error("Unable to check events");
	 */
	/*@__PURE__*/get available(): Boolean;
	/**
	 * Check if you can use `Get_Supported_Events` to quickly get a list of supported events
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.fast_query_available)
	 * 	console.info("Unable to quickly fetch list of supported events");
	 * else
	 * 	console.info("Hell yeah");
	 * @description If it's not supported it will just be slower, `check_event` will still work
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
 * ghost event finder
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("Current ghost does not support event queries");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
interface ghost_events_queryer_t {
	/**
	 * Constructing an Event Querier
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/new(base_jsstp: jsstp_t): ghost_events_queryer_t;
	/**
	 * Call declarations
	 * Check for the existence of events, ghost requires at least `Has_Event` event support and can be made more efficient by providing `Get_Supported_Events` events
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer("On_connect");
	 * @see based on {@link ghost_events_queryer_t.check_event}
	 */
	/*@__PURE__*/(event_name: String, security_level?: security_level_t): Promise<Boolean>;
}

/**
 * sstp wrapper
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
