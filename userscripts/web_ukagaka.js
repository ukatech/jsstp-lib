// ==UserScript==
// @name			Web Ukagaka
// @namespace		https://github.com/ukatech/jsstp-lib
// @version			0.0.0.0
// @description		try to take over the world!
// @author			steve02081504
// @match			*://*/*
// @icon			https://www.google.com/s2/favicons?sz=64&domain=shillest.net
// @require			https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.3.2/dist/jsstp.min.js
// @grant			window.onurlchange
// @grant			GM.setValue
// @grant			GM.getValue
// ==/UserScript==

/// <reference types="jsstp" />

/** @type {typeof import("jsstp").jsstp} */
var jsstp;

jsstp.sendername = 'web_ukagaka';


var IntervalNumber=NaN;
var TrustGhosts={};
var DiscardedGhosts=[];

function get_prompt_text(ghostname){
	// 获取浏览器的语言
	let language = navigator.language || navigator.userLanguage;
	switch(language){
		case 'zh-CN':
		case 'zh':
		case 'zh-TW':
		case 'zh-HK':
			return `是否信任${ghostname}？\n
			输入y或者yes表示信任\n
			输入n或者no表示不信任\n
			输入discard表示不信任并今后不再询问\n
			输入*表示该ghost对所有网站都有权限\n
			允许后该ghost将可以在本网站上执行任意代码并获取数据\n
			请勿在涉及支付 / 银行 / 个人隐私等重要信息的网站上信任不明来源的ghost\n
			`
		case 'ja':
			return `あなたは${ghostname}を信頼しますか？\n
			入力yまたはyesは信頼を意味します\n
			入力nまたはnoは信頼しないことを意味します\n
			入力discardは信頼せず、今後尋ねないことを意味します\n
			入力*は、このghostがすべてのWebサイトにアクセスできることを意味します\n
			許可すると、このghostは任意のコードを実行し、データを取得できます\n
			重要な情報（支払い/銀行/個人情報など）が含まれているWebサイトで、信頼できないソースのghostを信頼しないでください\n
			`
		default:
			return `Do you trust ${ghostname}?\n
			Input y or yes means trust\n
			Input n or no means not trust\n
			Input discard means not trust and don't ask again\n
			Input * means this ghost has access to all websites\n
			Allowing this ghost will be able to execute arbitrary code and get data\n
			Do not trust ghosts from untrusted sources on websites involving important information such as payment / bank / personal privacy\n
			`
	}
}

async function AddTrustGhost(ghostname){
	// 弹出一个对话框，询问用户是否信任该ghost
	let result=prompt(get_prompt_text(ghostname));
	switch(result){
		case 'y':
		case 'yes':{
			let domin = location.hostname;
			TrustGhosts[ghostname]??=[];
			TrustGhosts[ghostname].push(domin);
			await GM.setValue('TrustGhosts', TrustGhosts);
			break;
		}
		case 'n':
		case 'no':
			break;
		case 'discard':
			DiscardedGhosts.push(ghostname);
			await GM.setValue('DiscardedGhosts', DiscardedGhosts);
			break;
		case '*':{
			TrustGhosts[ghostname]='*';
			await GM.setValue('TrustGhosts', TrustGhosts);
			break;
		}
		default:
			alert('输入错误');
			await AddTrustGhost(ghostname);
			return;
	}
}
function IsTrustGhost(ghostname){
	if(TrustGhosts[ghostname]=='*')
		return true;
	let domin = location.hostname;
	return TrustGhosts[ghostname].includes(domin);
}

async function InitValue(){
	TrustGhosts=await GM.getValue('TrustGhosts', {});
	DiscardedGhosts=await GM.getValue('DiscardedGhosts', []);
}

async function OnBrowserPageLoad(ghostname,hwnd){
	jsstp.default_info.ReceiverGhostHWnd = hwnd;
	const url = location.href;
	const title = document.title;
	let info=await jsstp.OnBrowserPageLoad(url, title);

	if(IntervalNumber!=NaN)
		clearInterval(IntervalNumber);
	if(info.EnableActionRequest==1) {
		if(!IsTrustGhost(ghostname)){
			if(!DiscardedGhosts.includes(ghostname)){
				await AddTrustGhost(ghostname);
				if(!IsTrustGhost(ghostname))
					return;
			}
		}
		// 设置一个定时器，每隔一段时间就向ghost发送一次请求
		IntervalNumber=setInterval(()=>OnBrowserActionRequest(hwnd), 1000);
	}
}

function RunOnBrowserPageLoad(){
	jsstp.get_fmo_infos().then(fmo_infos=>{
		fmo_infos.forEach((info)=>{
			OnBrowserPageLoad(info.name,info.hwnd);
		});
	});
}

async function OnBrowserActionRequest(hwnd){
	jsstp.default_info.ReceiverGhostHWnd = hwnd;
	let info=await jsstp.OnBrowserActionRequest(location.href, document.title);
	let base_ActionResponse=[info.id, info.action];
	switch(info.action) {
		case 'get_element':{
			let element=document.querySelector(info.selector);
			if(element){
				let html=element.innerHTML;
				html=html.replace(/\r\n[ \t]*/g, '');
				await jsstp.OnBrowserActionResponse(...base_ActionResponse, element.innerHTML);
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
				await jsstp.OnBrowserActionResponse(...base_ActionResponse, ...htmls);
			}
			break;
		}
		case 'set_element':{
			let element=document.querySelector(info.selector);
			if(element){
				element.innerHTML=info.html;
				await jsstp.OnBrowserActionResponse(...base_ActionResponse, true);
			}
			break;
		}
		case 'exec':{
			let result=Function('jsstp',info.code)(jsstp);
			await jsstp.OnBrowserActionResponse(...base_ActionResponse, result);
			break;
		}
		case 'set_url':{
			location.href=info.url;
			await jsstp.OnBrowserActionResponse(...base_ActionResponse, true);
			break;
		}
	}
}

async function main() {
	await InitValue();
	RunOnBrowserPageLoad();
	if (window.onurlchange === null) {
		// feature is supported
		window.addEventListener('urlchange', RunOnBrowserPageLoad);
	}
}

main();
