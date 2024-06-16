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
	* When multiple IfGhosts are needed, consider using {@link jsstp_t.raw_send} to send SSTP messages
	*/
	IfGhost: string | undefined
	/**
	* Sakura script  
	* If the Script header does not follow immediately after the IfGhost, it will be the default processing script when it does not correspond to the IfGhost.  
	* Due to language limitations in js, only one script can be specified here.  
	* When multiple Scripts are needed, consider using {@link jsstp_t.raw_send} to send SSTP messages
	*/
	Script: string | undefined
	/**
	 * Other SSTP contents
	 */
	[key: string]: string | undefined
};
/**
 * An enumeration of the documented SSTP commands.
 * @enum {string} documented_sstp_command_name_t
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

export {
	ExtensibleFunction, security_level_t, sstp_return_code_t,
	base_sstp_content_t,
	common_event_sstp_content_t,
	common_communicate_sstp_content_t,
	common_give_sstp_content_t,
	common_execute_sstp_content_t
};
