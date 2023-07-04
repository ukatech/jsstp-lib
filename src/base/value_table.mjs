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

var Get_Supported_Events = "Get_Supported_Events";
var Has_Event = "Has_Event";
var get_supported_events = "get_supported_events";
var has_event = "has_event";
var get_simple_caller_of_event = "get_simple_caller_of_event";
var trivial_clone = "trivial_clone";
var default_info = "default_info";
var default_security_level="default_security_level";
var sstp_version_table = "sstp_version_table";
var substring = "substring";
var length = "length";
var entries = "entries";
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
	default_security_level,
	trivial_clone,
	default_info,
	length,
	entries,
	proxy,
	then,

	local,
	external,

	void_string
};
