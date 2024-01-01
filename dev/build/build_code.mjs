
import { rollup } from 'rollup';
import { minify as terser } from 'terser';
import { minify as uglifyjs } from 'uglify-js';

//rollup -c ./.github/rollup.config.mjs
var rollup_config=await import('./rollup.config.mjs').then(m=>m.default);
for(const config of rollup_config){
	const bundle = await rollup(config);
	for(const output of config.output)
		await bundle.write(output);
}


var name_caches={};
function terser_minify(code,is_module){
	var compress_options={
		unsafe:true,
		//inline:2,
		computed_props:false,
		unsafe_arrows:true,
		unsafe_comps:true,
		unsafe_Function:true,
		unsafe_math:true,
		unsafe_symbols:true,
		unsafe_methods:true,
		unsafe_proto:true,
		unsafe_regexp:true,
		unsafe_undefined:true
	};
	return terser(code,{
		compress:compress_options,
		mangle:{
			properties:{regex:/^_.*_$/},
			keep_classnames:/^(base_sstp_info_t|list_info_t|fmo_info_t|ghost_events_queryer_t|jsstp_t|sstp_info_t)$/,
		},
		nameCache: name_caches,
		module:is_module
	}).then(({code})=>code);
}
function uglifyjs_minify(code,is_module){
	var compress_options={
		unsafe:true,
		unsafe_comps:true,
		unsafe_Function:true,
		unsafe_math:true,
		unsafe_proto:true,
		unsafe_regexp:true,
		unsafe_undefined:true,
		properties:false
	};
	return new Promise((resolve,reject)=>{
		let result=uglifyjs(code,{
			compress:compress_options,
			mangle:false,
			module:is_module,
			//nameCache:name_caches
		});
		if(result.error)
			reject(result.error);
		else
			resolve(result.code);
	});
}

//file io
import { readFileSync, writeFileSync } from 'fs';
import { pack } from 'packer';
//minify
async function jsstp_minify(code_path,is_module){
	console.log(`minifing ${code_path}`);
	let code=readFileSync(code_path,'utf8');
	if(code.startsWith("Object.defineProperty(exports, '__esModule', { value: true });")){
		code=code.substring("Object.defineProperty(exports, '__esModule', { value: true });".length);
		code+="exports.__esModule=true;\n"
	}
	return terser_minify(code,is_module).then(code => uglifyjs_minify(code,is_module)).then(async code=>{
		if(is_module){
			let exports_str="";
			let exports_reg=/exports\.([a-zA-Z0-9_$]+)\s*=\s*([a-zA-Z0-9_$!]+)[,;]/;
			let match;
			while(match=exports_reg.exec(code)){
				exports_str+=`${match[1]}:${match[2]},`;
				code=code.replace(match[0],"");
			}
			if(exports_str){
				var assign=name_caches.vars.props["$assign"];
				if(assign){
					code=code.replace(/,$/,";");
					code+=assign+"(exports,{"+exports_str.replace(/,$/,"});");
					code=await uglifyjs_minify(code,is_module);
				}
				else
					console.error("assign not found")
			}
		}
		else{
			code=code.replace(/^var [a-zA-Z0-9_$]+=function\(\){/,`var jsstp=(()=>{`);
			code=code.replace(/}\(\);$/g,`})()\n`);
		}
		code = code.replace("document.currentScript&&document.currentScript.src","document.currentScript?.src");
		code = code.replace(
			"_=(s,r,n)=>{return new Proxy(s,e({get:(i=r,(e,s)=>{var r;if(!i.t?.(e,s))return(r=o(s,String)?i.i?.(e,s):i.h?.(e,s))!==t?r:i.o?i.o(e,s):o(r=e[s],Function)?r.bind(e):r}),set:u},n));var i}",
			"_=(i,n,r)=>new Proxy(i,e({get(i,r){var a;if(!n.t?.(i,r))return(a=o(r,String)?n.i?.(i,r):n.h?.(i,r))!==t?a:n.o?n.o(i,r):o(a=i[r],Function)?a.bind(i):a},set:u},r))"
		);
		code = code.replace("t=>{return(t=+t)==t}","t=>+t==t");
		return code.replace(/;$/g,`\n`);
	}).catch(e=>console.error(e));
}


//minify
var cjscode = await jsstp_minify("./dist/jsstp.cjs",true);
var jscode = await jsstp_minify("./dist/jsstp.min.js",false);
if(!jscode.startsWith("var jsstp=(()=>{") || !jscode.endsWith("})()\n"))
	throw new Error("minify failed!");
var jsstpdefcode = jscode.substring("var jsstp=(()=>{".length,jscode.length-"})()\n".length).replace(
	/return (\w+)\(jsstp_t.prototype/g,
	"$1(jsstp_t.prototype"
);
jsstpdefcode = jsstpdefcode.replace(/new jsstp_t$/g,"[new jsstp_t,jsstp_t,base_sstp_info_t,sstp_info_t,list_info_t,fmo_info_t,ghost_events_queryer_t]");
//pack
jscode=pack(jscode,true,true);
cjscode=pack(cjscode,true,true);
jsstpdefcode=pack(jsstpdefcode,true,true);
//build mjs code
var mjscode="var[a,b,c,d,e,f,g]="+jsstpdefcode+"\
\nexport{a as default,a as jsstp,b as jsstp_t,c as base_sstp_info_t,d as sstp_info_t,e as list_info_t,f as fmo_info_t,g as ghost_events_queryer_t}"
//re minify
name_caches={}
function reminify(code,is_module){
	return terser_minify(code,is_module).then(code => uglifyjs_minify(code,is_module)).then(code=>code.replace(/;$/g,`\n`)).catch(e=>console.error(e));
}
jscode=await reminify(jscode,false);
cjscode=await reminify(cjscode,false);//作为普通的js而非模块
mjscode=await reminify(mjscode,true);
//write
writeFileSync("./dist/jsstp.min.js",jscode);
writeFileSync("./dist/jsstp.cjs",cjscode);
writeFileSync("./dist/jsstp.mjs",mjscode);
//*/
