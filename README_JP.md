# jsstp  

Webページでゴーストと通信し、情報をやりとりするためにjsを使用します。

## 使用方法

### 1. jsの導入

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsttp-lib@master/jsttp.js"></script>
```

### 2.使用する

```javascript
jsttp.SEND(
	{//イベント情報
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	},
	function (data) {//コールバック関数
		console.log("return_code: "+data.return_code());
		console.log(data);
		console.log(data["Script"]);
	}
);
```
詳細な定義や機能については、ソースコードをお読みください。
