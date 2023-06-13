// rollup.config.js
export default {
	input: 'src/jsstp.mjs',
	output: [
		{
			file: 'dist/jsstp.mjs',
			format: 'esm'
		},
		{
			file: 'dist/jsstp.min.js',
			name: 'jsstp',
			format: 'iife'
		}
	]
};
