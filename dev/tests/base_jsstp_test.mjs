/// <reference types="jsstp" />

var base_jsstp_test = (
	/** @type {typeof import("jsstp").jsstp} */
	jsstp
)=>{
	jsstp.if_available(async ()=>{
		console.log("jsstp test");
		console.log((await jsstp.get_fmo_infos()).TextContent());

		console.log((await jsstp.OnTest()).TextContent());
		console.log(await jsstp.has_event("OnTest"));
		console.log(jsstp.clone);

		jsstp.On_ShioriEcho.GetName().then(({GhostName})=>
			GhostName=="Taromati2"?
				console.log("cool Taromati2!"):
				console.log(GhostName||"ghost not support On_ShioriEcho.GetName")
		);

		jsstp.for_all_ghosts(jsstp => jsstp.OnTest().then(console.log));

		console.log(JSON.stringify(await jsstp.On_ShioriEcho('1000-7'),null,'\t'));
	}).catch((e)=>
		e?
			console.error(e):
			console.log("none ghost was found")
	);

	if(jsstp.default_security_level!="local")
		console.error("jsstp.default_security_level!=local !!!!!!!");
};

export{
	base_jsstp_test as default,
	base_jsstp_test,
};
