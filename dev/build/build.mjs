
//npm install rollup terser uglify-js -g
import { rollup } from 'rollup';
import { minify as terser } from 'terser';
import { minify as uglifyjs } from 'uglify-js';

import { renameSync } from 'fs';
import { join } from 'path';
import { readdirSync } from 'fs';

import dts from "rollup-plugin-dts";
async function build_dts_file(lang){
	console.log(`正在编译${lang}语言的.d.ts文件`);
	const path=`./src/.decls/${lang}`;
	//在调用rollup前，我们需要先做一件事：
	//将path+/types/中的所有.s.ts文件重命名为.d.ts文件
	const base_path=path+"/types";
	for(const file_name of readdirSync(base_path)){
		if(file_name.endsWith(".s.ts")){
			//先将原有的同名.d.ts文件重命名到.d.ts.tmp
			renameSync(join(base_path,file_name.replace(/\.s\.ts$/,".d.ts")),join(base_path,file_name.replace(/\.s\.ts$/,".d.ts.tmp")));
			//再将.s.ts文件重命名为.d.ts文件
			renameSync(join(base_path,file_name),join(base_path,file_name.replace(/\.s\.ts$/,".d.ts")));
		}
	}
	const rollup_config={
		input: path+'/jsstp.d.ts',
		output: [
			{
				format: 'esm'
			}
		],
		plugins: [dts()]
	}
	var bundle=await rollup(rollup_config)
	//回复.s.ts文件
	for(const file_name of readdirSync(base_path)){
		if(file_name.endsWith(".d.ts.tmp")){
			//先将原有的同名.d.ts文件重命名到.s.ts
			renameSync(join(base_path,file_name.replace(/\.d\.ts\.tmp$/,".d.ts")),join(base_path,file_name.replace(/\.d\.ts\.tmp$/,".s.ts")));
			//再将.d.ts.tmp文件重命名为.d.ts文件
			renameSync(join(base_path,file_name),join(base_path,file_name.replace(/\.d\.ts\.tmp$/,".d.ts")));
		}
	}

	var dts_code= (await bundle.generate(rollup_config.output[0])).output[0].code;

	//修补d.ts
	//`info_object$1`=>`info_object`
	dts_code=dts_code.replace(/info_object\$1/g,'info_object');
	//remove all `//**remove from dist**//`
	dts_code=dts_code.replace(/\/\/\*\*remove from dist\*\*\/\/\n/g,'');

	{
		var dts_code_array=dts_code.split("\n");
		//remove all single line comments
		dts_code_array=dts_code_array.filter(line=>!/^[ \t]*\/\//.test(line));
		//remove all multi line comments
		var in_comment=false;
		dts_code_array=dts_code_array.filter(line=>{
			if(/[ \t]*\/\*(?![\*@])/.test(line))
				in_comment=true;
			if(in_comment && /\*\/$/.test(line)){
				in_comment=false;
				return false;
			}
			if(!in_comment)
				return true;
			return false;
		});
		//remove all multi empty lines to single empty line
		var last_line_is_empty=false;
		dts_code_array=dts_code_array.filter(line=>{
			if(line.length==0){
				if(last_line_is_empty)
					return false;
				else
					last_line_is_empty=true;
			}else
				last_line_is_empty=false;
			return true;
		});
		dts_code=dts_code_array.join("\n");
	}

	writeFileSync(`dist/${lang}/jsstp.d.ts`,dts_code);
}
//对于每个在src/.decls/中的文件夹，我们都需要调用一次build_dts_file
for(const lang of readdirSync("./src/.decls"))
	build_dts_file(lang);

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
	let code=readFileSync(code_path,'utf8');
	if(code.startsWith("Object.defineProperty(exports, '__esModule', { value: true });")){
		code=code.substring("Object.defineProperty(exports, '__esModule', { value: true });".length);
		code+="exports.__esModule=true;\n"
	}
	terser_minify(code,is_module).then(code=>{
		uglifyjs_minify(code,is_module).then(async code=>{
			if(is_module){
				{
					let exports_str="";
					let exports_reg=/exports\.([a-zA-Z0-9_$]+)\s*=\s*([a-zA-Z0-9_$!]+)[,;]/;
					let match;
					while(match=exports_reg.exec(code)){
						exports_str+=`${match[1]}:${match[2]},`;
						code=code.replace(match[0],"");
					}
					if(exports_str){
						var assign=name_caches.vars.props["$assign"];
						code=code.replace(/,$/,";");
						code+=assign+"(exports,{"+exports_str.replace(/,$/,"});");
						code=await uglifyjs_minify(code,is_module);
					}
				}
				code=code.replace(/;$/g,`\n`);
			}
			else{
				code=code.replace(/^var jsstp=function\(\){/,`var jsstp=(()=>{`);
				code=code.replace(/}\(\);$/g,`})()\n`);
			}
			code = code.replace("document.currentScript&&document.currentScript.src","document.currentScript?.src");
			{
				//一些小问题的修复
				var key_fix = (old_key) => {
					var key=name_caches.vars.props["$"+old_key];
					code=code.replace(new RegExp(`${old_key}\:`,"g"),`[${key}]:`);
				}
				key_fix("unknown_lines");
				key_fix("SEND");
				key_fix("local");
				key_fix("external");
				key_fix("RequestHeader");
				key_fix("default_info");
				key_fix("default_security_level");
				key_fix("sstp_version_table");
			}
			writeFileSync(code_path,code);
		}).catch(e=>console.error(e));
	}).catch(e=>console.error(e));
}

//minify
jsstp_minify("./dist/jsstp.min.js",false);
jsstp_minify("./dist/jsstp.mjs",true);
jsstp_minify("./dist/jsstp.cjs",true);
