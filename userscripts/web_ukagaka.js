// ==UserScript==
// @name			Web Ukagaka
// @namespace		https://github.com/ukatech/jsstp-lib
// @version			0.0.0.0
// @description		try to take over the world!
// @author			steve02081504
// @match			*
// @icon			https://www.google.com/s2/favicons?sz=64&domain=shillest.net
// @require			https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.3.2/dist/jsstp.min.js
// @grant			window.onurlchange
// ==/UserScript==

async function main() {
	const url = location.href;
	const title = document.title;
	jsstp.OnBrowserPageLoad(url, title);

	if (window.onurlchange === null) {
		// feature is supported
		window.addEventListener('urlchange', (info) =>
			void jsstp.OnBrowserPageLoad(info.url, info.title)
		)
	}

	if(await jsstp.has_event('OnBrowserActionRequest')) {
		// 设置一个定时器，每隔一段时间就向ghost发送一次请求
		setInterval(async() => {
			let info=await jsstp.OnBrowserActionRequest(location.href, document.title);
			switch(info.action) {
				case 'get_element':{
					let element=document.querySelector(info.selector);
					if(element){
						let html=element.innerHTML;
						html=html.replace(/\r\n[ \t]*/g, '');
						await jsstp.OnBrowserActionResponse(info.action, element.innerHTML);
					}
					break;
				}
				case 'get_elements':{
					let elements=document.querySelectorAll(info.selector);
					if(elements){
						let htmls=[];
						for(let element of elements){
							let html=element.innerHTML;
							html=html.replace(/\r\n[ \t]*/g, '');
							htmls.push(html);
						}
						await jsstp.OnBrowserActionResponse(info.action, ...htmls);
					}
					break;
				}
				case 'set_element':{
					let element=document.querySelector(info.selector);
					if(element){
						element.innerHTML=info.html;
						await jsstp.OnBrowserActionResponse(info.action, true);
					}
					break;
				}
				case 'exec':{
					let result=Function(info.code)();
					await jsstp.OnBrowserActionResponse(info.action, result);
					break;
				}
				case 'set_url':{
					location.href=info.url;
					await jsstp.OnBrowserActionResponse(info.action, true);
					break;
				}
			}
		}
		, 1000);
	}
}

main();
