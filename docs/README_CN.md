# jsstp  


[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/ukatech/jsstp-lib?color=green)](https://www.jsdelivr.com/package/gh/ukatech/jsstp-lib)
![npm downloads](https://img.shields.io/npm/dm/jsstp?label=npm%20downloads)
![install size](https://packagephobia.now.sh/badge?p=jsstp)  

用js在网页或node.js等环境中与伪春菜通信以实现信息交换。
详情参考[伪春菜](https://zh.moegirl.org.cn/zh-hans/%E4%BC%AA%E6%98%A5%E8%8F%9C)与[SSTP](http://ssp.shillest.net/ukadoc/manual/spec_sstp.html)。

## 用法

### 1. 引入js

如果你使用npm，你可以使用npm安装jsstp

```shell
npm i jsstp
```

之后在js中引入jsstp

```javascript
var jsstp=require("jsstp");
```

或者你是怀旧党，你可以通过cdn访问jsstp的源码

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.0.0/dist/jsstp.min.js"></script>
```

或者在js中动态载入jsstp

```javascript
var jsstp=await import("https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.0.0/dist/jsstp.mjs").then(m=>m.jsstp);
```

### 2. 使用

```javascript
//你可能需要先在jsstp相关操作前检查ghost是否可用
if (!await jsstp.available())
	console.log("ghost不可用,请检查ghost是否启动");

//jsstp2.0前曾经支持将回调函数作为参数传入，现在已经不再支持
//如果你需要的话，可以使用Promise或者async/await来获取返回值
//你可以使用jsstp.SEND来发送报文
jsstp.SEND(
	{//事件信息
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	}
).then((data) => {
	console.log("head: " + data.head);
	console.log(JSON.stringify(data));
	console.log(data["Script"]);
});
//jsstp支持所有的sstp基础操作，jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE]都可以被调用。
//如果你喜欢怀旧，只想获得报文本身，你可以使用jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE].get_row

//如果你只是想触发事件，而不需要自定义发送较为复杂的报文，可以这样写

let data = await jsstp.OnTest("from jsstp.js!", 123123);
/*
	这等价于：
	jsstp.SEND({
		"Event": "OnTest",
		"Reference0": "from jsstp.js!",
		"Reference1": 123123
	});
	对于所有事件你都可以这样写，不过如果事件不以`On`开头，你需要在事件名前加上`On_`来访问jsstp，这样它才能识别到你想要触发事件
	你也可以使用`jsstp.event.事件名(参数)`来触发事件，这样你就不需要在事件名前加上`On_`了
*/
console.log("status code: " + data.status_code);
//data的类型是jsstp.sstp_info_t，使用方法各种各样
//以下是自info_object继承的方法
data.keys; //获取所有键
data.values; //获取所有值
data.entries; //获取所有键值对
data.length; //获取键值对数量
data.forEach((value, key) => console.log(key + "=" + value)); //遍历所有键值对：如果遍历函数有返回值，该值会被更新到此键值对中
//以下是自jsstp.base_sstp_info_t继承的方法
data.Script; //获取报文中的Script键的值
data.head; //获取报文头
data.status_code; //获取报文头中的状态码
//以下是特有的方法
data.get_passthrough("Result"); //获取报文中X-SSTP-PassThru的某个键的值，和data["X-SSTP-PassThru-Result"]等价
//如果报文中没有Result键，你也可以直接使用data.Result或者data["Result"]来获取X-SSTP-PassThru-Result的值：这可能简洁一些

//如果你想获取ghost是否支持某个事件，可以这样写
let result = await jsstp.has_event("OnTest");//这和jsstp.event.Has_Event(event_name, security_level).then(({ Result }) => Result == "1")几乎一样！
console.log(result);
//如果你想大批量的查询事件（像ukadoc那样！），你可以使用jsstp.new_event_queryer()来获取一个queryer
let queryer = await jsstp.new_event_queryer();
//queryer的类型是jsstp.ghost_events_queryer_t，使用方法各种各样
queryer.check_event("OnTest").then(result => console.log(result));
//queryer和jsstp一样，检查事件时有可选的参数指定事件的安全等级，默认的安全等级随着jsstp的运行环境而变化：
//如果jsstp运行在nodejs中，安全等级为"local"，如果jsstp运行在浏览器中，安全等级为"external"（因为浏览器中的jsstp只能触发外部事件！）
//如果你想要固定查询local事件，你需要指定安全等级为"local"，像这样：
queryer.check_event("OnBoot", "local");
jsstp.has_event("OnBoot", "local");//使用jsstp的话这样
//queryer具有缓存机制，如果想清空缓存：
await queryer.reset();
//queryer与构造它的jsstp实例是绑定的，如果你想要让queryer指向特定的ghost，通过设置jsstp.default_info来修改默认的附加报文并使用reset清空缓存
//使用fmo中得到的hwnd，这可以避免重名导致的尴尬情况
jsstp.default_info.ReceiverGhostHWnd = 123456;//fmo的获取方法见下文，这里只是举个例子
//如果你确定你的ghost名称足够独特，你也可以直接使用ghost名称
jsstp.default_info.ReceiverGhostName = "橘花";
//queryer还支持一些快速检测
if (!queryer.available)
	console.info("无法获取支持的事件列表");//queryer不可用，你需要提醒用户更新ghost或者向其作者反馈：jsstp和ghost terminal一样使用`Has_Event`事件来检查事件的可用情况。
if (!queryer.fast_query_available)
	console.info("无法快速获取支持的事件列表");//这不会影响使用，只是会导致查询未缓存的事件时会发出一次查询请求：如果ghost支持`Get_Supported_Events`事件的话queryer会使用它来获取事件列表（这样会快不少！）
else
	console.info("好哦");

//如果你想获取fmo信息，可以这样写
let fmo = await jsstp.get_fmo_infos();
if (fmo.available)
	console.log(fmo);
//fmo的类型是jsstp.fmo_info_t，使用方法各种各样
//fmo_info_t是特化的base_sstp_info_t，所以你可以对其使用base_sstp_info_t的所有方法（也就是说，sstp_info_t的所有方法除了`get_passthrough`）
//它还有一些特殊的方法
fmo.uuids; //获取所有uuid，和`fmo.keys`等价
fmo.get_uuid_by("fullname", "Taromati2"); //获取指定属性值与指定值相等的uuid
fmo.get_list_of("fullname"); //获取指定属性的所有值
fmo.available; //获取fmo是否有内容
//fmo的每个键值对都是String:info_object，键是uuid，值是该uuid对应的fmo信息
//你仍然可以使用info_object的成员方法来操作fmo的中的fmo信息（参见上文中对于sstp_info_t的介绍）
//如果你还是不太理解，可以在控制台查看fmo的结构或者查看jsstp的源码
```
详细定义与功能请阅读源码。
