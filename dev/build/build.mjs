
//npm install rollup terser uglify-js -g
import { rollup } from 'rollup';
import { minify as terser } from 'terser';
import { minify as uglifyjs } from 'uglify-js';

//rollup -c ./.github/rollup.config.mjs
var rollup_config=await import('./rollup.config.mjs').then(m=>m.default);
for(var i=0;i<rollup_config.length;i++){
	var bundle=await rollup(rollup_config[i]);
	await bundle.write(rollup_config[i].output[0]);
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
			properties:{regex:/^_.*_$/}
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
			module:is_module
		});
		if(result.error)
			reject(result.error);
		else
			resolve(result.code);
	});
}

//file io
import { readFileSync, writeFileSync } from 'fs';
//minify
function jsstp_minify(code_path,is_module){
	terser_minify(readFileSync(code_path,'utf8'),is_module).then(code=>{
		uglifyjs_minify(code,is_module).then(code=>{
			if(is_module)
				code=code.replace(/};$/g,`}\n`);
			else{
				code=code.replace(/^var jsstp=function\(\){/,`var jsstp=(()=>{`);
				code=code.replace(/}\(\);$/g,`})()\n`);
			}
			{
				//一些小问题的修复
				var unknown_lines_key=name_caches.vars.props["$unknown_lines"];
				//`unknown_lines:`->`[unknown_lines_key]:`
				code=code.replace(/unknown_lines\:/g,`[${unknown_lines_key}]:`);
				var SEND_key=name_caches.vars.props["$SEND"];
				//`SEND:`->`[SEND_key]:`
				code=code.replace(/SEND\:/g,`[${SEND_key}]:`);
			}
			writeFileSync(code_path,code);
		}).catch(e=>console.error(e));
	}).catch(e=>console.error(e));
}

//minify
jsstp_minify("./dist/jsstp.min.js",false);
jsstp_minify("./dist/jsstp.mjs",true);

//修补d.ts
var dts_code=readFileSync("./dist/jsstp.d.ts",'utf8');
//`info_object$1`=>`info_object`
dts_code=dts_code.replace(/info_object\$1/g,'info_object');

writeFileSync("./dist/jsstp.d.ts",dts_code);
