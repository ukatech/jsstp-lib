# jsstp  

![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/ukatech/jsstp-lib?color=green)  

Webページでゴーストと通信し、情報をやりとりするためにjsを使用します。
詳細は[伺か](https://ja.wikipedia.org/wiki/%E4%BC%BA%E3%81%8B)と[SSTP](http://ssp.shillest.net/ukadoc/manual/spec_sstp.html)を参照してください。

## 使用方法

### 1. jsの読み込み

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v1.1.0.0/jsstp.min.js"></script>
<!-- または --->
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v1.1.0.0/jsstp.js"></script>
```

### 2.使用する

```javascript
jsstp.SEND(
	{//イベント情報
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	},
	function (data) {//コールバック関数、省略可能
		console.log("return_code: "+data.return_code);
		console.log(data);
		console.log(data.Script);
	}
);
//promiseを使用することもできます
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
詳細な定義や機能については、ソースコードをお読みください。
