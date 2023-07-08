// rollup.config.js
import dts from "rollup-plugin-dts";

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
			},
			{
				file: 'dist/jsstp.cjs',
				format: 'cjs',
				exports: 'named',
				strict: false//jsstp在不在严格模式下都可以正常工作，去除以节省体积
			}
		]
	},
	{
		input: 'src/jsstp.d.ts',
		output: [
			{
				file: 'dist/jsstp.d.ts',
				format: 'esm'
			}
		],
		plugins: [dts()]
	}
];
