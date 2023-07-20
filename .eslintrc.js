module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: "eslint:recommended",
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				ecmaVersion: 6,
				sourceType: "script",
			},
		},
	],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {},
};
