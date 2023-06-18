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
				name: 'jsstp',
				strict: false//jsstp在不在严格模式下都可以正常工作，去除以节省体积
			}
		]
	}
];