/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"prettier"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		project: "./tsconfig.eslint.json"
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		quotes: [
			"error",
			"double",
			{
				avoidEscape: true
			}
		],
		// Managed by Prettier
		indent: ["off"],
		"comma-dangle": ["error", "never"],
		"linebreak-style": ["error", "unix"],
		semi: ["error", "always"],
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
		],
		// enforce boolean conditions
		"@typescript-eslint/strict-boolean-expressions": [
			"error",
			{
				allowString: false,
				allowNumber: false,
				allowNullableObject: false,
				allowNullableBoolean: false,
				allowNullableString: false,
				allowNullableNumber: false,
				allowNullableEnum: false,
				allowAny: false
			}
		],
		"@typescript-eslint/member-delimiter-style": "warn",
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/array-type": [
			"warn",
			{
				default: "generic"
			}
		],
		"@typescript-eslint/ban-ts-comment": "warn",
		// Handled by TS
		"no-undef": "off",
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": "error",
		"no-use-before-define": "off",
		"@typescript-eslint/no-use-before-define": [
			"error",
			{
				functions: false,
				classes: true,
				variables: true,
				allowNamedExports: false,
				enums: false,
				typedefs: false,
				ignoreTypeReferences: true
			}
		],
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		// The ability to do `{ [name: T]: U }` is useful for self-documenting.
		"@typescript-eslint/consistent-indexed-object-style": ["off"],
		"@typescript-eslint/dot-notation": [
			"error",
			{
				allowIndexSignaturePropertyAccess: true
			}
		]
	}
};
