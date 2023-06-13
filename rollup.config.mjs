// rollup.config.js
export default [
	{
		input: 'src/jsstp.mjs',
		output: [
			{
				file: 'dist/jsstp.mjs',
				format: 'esm'
			}
		]
	},
	{
		input: 'src/jsstp.single.mjs',
		output: [
			{
				file: 'dist/jsstp.min.js',
				format: 'iife',
				name: 'jsstp'
			}
		]
	}
];
