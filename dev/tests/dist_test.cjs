/// <reference types="jsstp" />
async function main(){
	var {base_jsstp_test} = await import("./base_jsstp_test.mjs");
	/** @type {typeof import("jsstp").jsstp} */
	var {jsstp}=require("../../dist/jsstp.cjs");

	base_jsstp_test(jsstp);
}
main();
