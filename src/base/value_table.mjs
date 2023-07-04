//一些会反复用到的常量或函数，提前定义以便在压缩时能够以短名称存在

/**
 * @typename the_object
 * @type {ObjectConstructor}
 * @ignore
 */
var the_object = Object;
/**
 * @typename the_proxy
 * @type {ProxyConstructor}
 * @ignore
 */
var the_proxy = Proxy;
var assign = the_object.assign;
var endline = "\r\n";
var undefined;// =undefined

/**
 * 将字符串转换为小写
 * @param {String} str 要转换的字符串
 * @returns {String} 转换后的字符串
 */
var to_lower_case = str => str.toLowerCase();

var Get_Supported_Events = "Get_Supported_Events";
var Has_Event = "Has_Event";
var get_supported_events = to_lower_case(Get_Supported_Events);
var has_event = to_lower_case(Has_Event);
var get_simple_caller_of_event = "get_simple_caller_of_event";
var trivial_clone = "trivial_clone";
var default_info = "default_info";
var default_security_level="default_security_level";
var sstp_version_table = "sstp_version_table";
var substring = "substring";
var length = "length";
var available = "available";
var split = "split";
var entries = "entries";
var costom_text_send = "costom_text_send";
var forEach = "forEach";
var get_caller_of_method = "get_caller_of_method";
var unknown_lines = "unknown_lines";
var get_caller_of_event = "get_caller_of_event";
var sendername = "sendername";
var proxy = "proxy";
var constructor = "constructor";
var then = "then";

var local = "local";
var external = "external";

var void_string = "";

/**
 * @typename the_string
 * @type {StringConstructor}
 * @ignore
 */
var the_string = void_string[constructor];

import{is_not_nan}from "./tools.mjs"
/**
 * @typename the_function
 * @type {FunctionConstructor}
 * @ignore
 */
var the_function = is_not_nan[constructor];
export {
	the_object,
	the_proxy,
	the_function,
	the_string,
	assign,
	endline,
	undefined,

	Get_Supported_Events,
	Has_Event,
	get_supported_events,
	has_event,
	get_simple_caller_of_event,
	sstp_version_table,
	substring,
	available,
	split,
	default_security_level,
	trivial_clone,
	default_info,
	costom_text_send,
	forEach,
	length,
	get_caller_of_method,
	get_caller_of_event,
	unknown_lines,
	sendername,
	entries,
	proxy,
	then,

	local,
	external,

	void_string
};
