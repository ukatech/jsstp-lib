- [JP](./README_JP.md)  
- [EN](./README_EN.md)  
- [CN](./README_CN.md)  

# jsstp  

![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/ukatech/jsstp-lib?color=green)  

用js在网页中与伪春菜通信以实现信息交换。
详情参考[伪春菜](https://zh.moegirl.org.cn/zh-hans/%E4%BC%AA%E6%98%A5%E8%8F%9C)与[SSTP](http://ssp.shillest.net/ukadoc/manual/spec_sstp.html)。

## 用法

### 1. 引入js

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v1.1.0.0/jsstp.min.js"></script>
<!-- 或 --->
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v1.1.0.0/jsstp.js"></script>
```

你也可以在js中动态载入jsstp

```javascript
var jsstp=await import("https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v1.1.0.0/jsstp.mjs").then(m=>m.jsstp);
```

### 2. 使用

```javascript
jsstp.SEND(
	{//事件信息
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	},
	function (data) {//回调函数，可省略
		console.log("return_code: "+data.return_code);
		console.log(data);
		console.log(data.Script);
	}
);
//你也可以使用promise
jsstp.SEND(
	{
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	}
).then(function (data) {
	console.log("head: "+data.head);
	console.log(JSON.stringify(data));
	console.log(data["Script"]);
});
```
详细定义与功能请阅读源码。
