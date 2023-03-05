- [JP](./README_JP.md)  
- [EN](./README_EN.md)  
- [CN](./README_CN.md)  

# jsstp  

用js在网页中与伪春菜通信以实现信息交换。

## 用法

### 1. 引入js

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsttp-lib@master/jsttp.js"></script>
```

### 2. 使用

```javascript
jsttp.SEND(
	{//事件信息
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	},
	function (data) {//回调函数
		console.log("return_code: "+data.return_code());
		console.log(data);
		console.log(data["Script"]);
	}
);
```
详细定义与功能请阅读源码。
