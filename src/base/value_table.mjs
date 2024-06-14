//一些会反复用到的常量或函数，提前定义以便在压缩时能够以短名称存在

var assign = Object.assign
var endline = "\r\n"
var undefined// =undefined

var void_string = ""
var _false_ = !1

var x_sstp_passthru_head = "X-SSTP-PassThru-"
var SEND = "SEND"

export {
	assign,
	endline,
	undefined,

	x_sstp_passthru_head,

	void_string,
	_false_,
	SEND,
}
