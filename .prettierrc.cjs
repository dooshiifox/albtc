/** @type { import("prettier").Config } */
module.exports = {
	useTabs: true,
	singleQuote: false,
	semi: true,
	trailingComma: "none",
	printWidth: 80,
	plugins: [
		"prettier-plugin-organize-imports",
	],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
				organizeImportsSkipDestructiveCodeActions: true
			}
		}
	]
};
