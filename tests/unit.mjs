import jsstp from "../src/jsstp.mjs";
//
jsstp.then(async ()=>{
	console.log("jsstp test");
	console.log((await jsstp.get_fmo_infos()).to_string());

	console.log((await jsstp.OnTest()).to_string());
	console.log(await jsstp.has_event("OnTest"));

	jsstp.On_ShioriEcho.GetName.then(caller=>
		caller().then(({GhostName})=>
			GhostName=="Taromati2"?
				console.log("cool Taromati2!"):
				console.log(GhostName)
		)
	).catch("ghost not support GhostTerminal");
}).catch("none ghost was found");
