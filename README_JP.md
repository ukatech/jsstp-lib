# jsstp  

Webページでゴーストと通信し、情報をやりとりするためにjsを使用します。
詳細は[ゴースト](https://ja.wikipedia.org/wiki/%E4%BC%BA%E3%81%8B)と[SSTP](http://ssp.shillest.net/ukadoc/manual/spec_sstp.html)を参照してください。

## 使用方法

### 1. jsの導入

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsttp-lib@master/jsttp.min.js"></script>
<!-- 或 --->
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsttp-lib@master/jsttp.js"></script>
```

### 2.使用する

```javascript
jsttp.SEND(
	{//イベント情報
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	},
	function (data) {//コールバック関数、省略可能
		console.log("return_code: "+data.return_code());
		console.log(data);
		console.log(data["Script"]);
	}
);
//あなたはpromiseを使用することもできます
jsttp.SEND(
	{
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	}
).then(function (data) {
	console.log("return_code: "+data.return_code());
	console.log(data);
	console.log(data["Script"]);
});
```
詳細な定義や機能については、ソースコードをお読みください。
