# jsstp  

Use js to communicate with ukagaka in a web page to exchange information.

## Usage

### 1. loading js

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsttp-lib@master/jsttp.js"></script>
```

### 2. Use

```javascript
jsttp.SEND(
	{//Event information
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	},
	function (data) {//Callback functions
		console.log("return_code: "+data.return_code());
		console.log(data);
		console.log(data["Script"]);
	}
);
```
Please read the source code for detailed definitions and functionality.
