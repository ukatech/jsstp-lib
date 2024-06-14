
import { rollup } from 'rollup'
import { readdirSync, writeFileSync } from 'fs'

import dts from "rollup-plugin-dts"

async function build_dts_file(lang) {
	console.log(`正在编译${lang}语言的.d.ts文件`)
	const path = `./src/.decls/${lang}`
	const rollup_config = {
		input: path + '/jsstp.d.ts',
		output: [
			{
				format: 'esm'
			}
		],
		plugins: [dts()]
	}
	var bundle = await rollup(rollup_config)
	var dts_code = (await bundle.generate(rollup_config.output[0])).output[0].code

	//修补d.ts
	//`info_object$1`=>`info_object`
	dts_code = dts_code.replace(/info_object\$1/g, 'info_object')
	// `some ${string}` => string
	dts_code = dts_code.replace(/`some \${string}`/g, 'string')

	{
		var dts_code_array = dts_code.split("\n")
		//remove all single line comments
		dts_code_array = dts_code_array.filter(line => !/^[ \t]*\/\//.test(line))
		//remove all multi line comments
		var in_comment = false
		dts_code_array = dts_code_array.filter(line => {
			if (/[ \t]*\/\*(?![\*@])/.test(line))
				in_comment = true
			if (in_comment && /\*\/$/.test(line)) {
				in_comment = false
				return false
			}
			if (!in_comment)
				return true
			return false
		})
		//remove all multi empty lines to single empty line
		var last_line_is_empty = false
		dts_code_array = dts_code_array.filter(line => {
			if (line.length == 0) 
				if (last_line_is_empty)
					return false
				else
					last_line_is_empty = true
			 else
				last_line_is_empty = false
			return true
		})
		dts_code = dts_code_array.join("\n")
	}

	writeFileSync(`dist/${lang}/jsstp.d.ts`, dts_code)
}
//对于每个在src/.decls/中的文件夹，我们都需要调用一次build_dts_file
for (const lang of readdirSync("./src/.decls"))
	build_dts_file(lang)
