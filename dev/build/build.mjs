
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
			mangle:{
				properties:false
			},
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
			writeFileSync(code_path,code);
		}).catch(e=>console.error(e));
	}).catch(e=>console.error(e));
}

//minify
jsstp_minify("./dist/jsstp.min.js",false);
jsstp_minify("./dist/jsstp.mjs",true);
