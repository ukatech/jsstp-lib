import jsstp from "../src/jsstp.mjs";
//
console.log((await jsstp.OnTest()).to_string());
console.log(await jsstp.has_event("OnTest","local"));
