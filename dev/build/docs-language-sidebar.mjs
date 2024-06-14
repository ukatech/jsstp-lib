// @ts-check
import td from "typedoc"
import path from "path"

const template = `
<select onchange="location.href = event.target.selectedOptions[0].dataset.url + location.hash;">
	<option data-url="{ROOT}/JP/{PAGE}" lang="ja">日本語</option>
	<option data-url="{ROOT}/EN/{PAGE}" lang="en">English</option>
	<option data-url="{ROOT}/CN/{PAGE}" lang="zh-CN">中文 (简体)</option>
</select>
`

/** @param {td.Application} app */
export function load(app) {
	app.renderer.hooks.on("pageSidebar.begin", (context) => {
		const language = app.options.getValue("htmlLang")

		const root = path.posix.join(context.relativeURL("./"), "..")
		const html = template
			.trim()
			.replace(/\{ROOT\}/g, root)
			.replace(/\{PAGE\}/g, context.page.url)
			.replace(`lang="${language}"`, `lang="${language}" selected`)

		return td.JSX.createElement(td.JSX.Raw, { html })
	})
}
