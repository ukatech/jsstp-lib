# jsstp  

![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/ukatech/jsstp-lib?color=green)  

Use js to communicate with ukagaka in a web page to exchange information.
See [ukagaka](https://en.wikipedia.org/wiki/Ukagaka)&[SSTP](http://ssp.shillest.net/ukadoc/manual/spec_sstp.html) for details.

## Usage

### 1. loading js

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v1.1.0.0/jsstp.min.js"></script>
<!-- or --->
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v1.1.0.0/jsstp.js"></script>
```

### 2. Use

```javascript
jsstp.SEND(
	{//Event information
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	},
	function (data) {//callback function, can be omitted
		console.log("return_code: "+data.return_code);
		console.log(data);
		console.log(data.Script);
	}
);
//You can also use promise
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
Please read the source code for detailed definitions and functionality.
