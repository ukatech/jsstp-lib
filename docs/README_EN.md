# jsstp  

[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/ukatech/jsstp-lib)](https://www.jsdelivr.com/package/gh/ukatech/jsstp-lib)
[![npm downloads](https://img.shields.io/npm/dm/jsstp?label=npm%20downloads)](https://www.npmjs.com/package/jsstp)
[![npm bundle size](https://img.shields.io/bundlephobia/min/jsstp?label=npm%20bundle%20size)](../dist/jsstp.min.js)  

Use js to communicate with ukagaka in environments such as web pages or node.js in order to exchange information.
See [ukagaka](https://en.wikipedia.org/wiki/Ukagaka) & [SSTP](https://ssp.shillest.net/ukadoc/manual/spec_sstp.html) for details.

## Usage

### 1. loading js

#### npm

If you use npm, you can use npm to install jsstp.

```shell
npm i jsstp
```

After that, use `import` to bring in jsstp in js.

```javascript
import jsstp from "jsstp";
//or
var {jsstp}=await import("jsstp");
```

In CommonJS, you can also use `require` to introduce jsstp.  

```javascript
var jsstp=require('jsstp');
```

#### CDN

If you're a nostalgist, you can access jsstp's source code via CDN.

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v3.1.0.1/dist/jsstp.min.js"></script>
```

Or load jsstp dynamically in js.

```javascript
var {jsstp}=await import("https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v3.1.0.1/dist/jsstp.mjs");
```

##### type definition

Even if you use CDN and write js code by hand, you can use jsstp's type definition file in your IDE to get code hints.

First make sure your IDE has access to jsstp. You can probably install it globally to use it without disturbing the workspace file.

```shell
npm i -g jsstp
```

Afterwards, add a type import to the head of the file using jsstp. According to the types convention, this declaration must precede any formal code.

```javascript
/// <reference types="jsstp" />
```

Finally, declare the type of jsstp before its declaration with a JSDoc comment.

```javascript
/** @type {typeof import("jsstp").jsstp} */
var jsstp;
```

###### Type Definition: i18n

The type definition of jsstp provides support for Chinese, Japanese and English. Normally you can specify the loaded language like this

```javascript
/// <reference types="jsstp/cn" />
// or
/// <reference types="jsstp/jp" />
// or
/// <reference types="jsstp/en" />
```

However, if your IDE bugs when used this way (or you don't want to specify the language every time), you might consider manually modifying the `types` field in `package.json` to specify the default language

```json
{
	"types": "dist/en/jsstp.d.ts"
}
```

### 2. Use

jsstp now has a dedicated documentation page!  
You can visit <https://ukatech.github.io/jsstp-lib/doc> for more specialized information.  
While looking the documentation, you can try out the various features of jsstp in the [jsstp playground](https://ukatech.github.io/jsstp-lib/playground)  

____

You may need to check if the ghost is available before jsstp related operations.

```javascript
if (!await jsstp.available())
	console.log("Ghost is not available, please check if ghost is running");
```

jsstp used to support passing callback functions as arguments before 2.0, but this is no longer supported.  
You can use `Promise` or `async`/`await` to get the return value if you need to.  
You can use `jsstp.SEND` to send a message.

```javascript
jsstp.SEND(
	{//event message
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	}
).then((data) => {
	console.log("head: " + data.head);
	console.log(JSON.stringify(data));
	console.log(data["Script"]);
});
```

jsstp supports all the sstp base operations: `jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE]` can be called.  
If you like nostalgia and just want to get the message itself, you can use `jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE].get_raw`  

If you just want to trigger the event and don't need to customize it to send more complex messages, you can write it like this:

```javascript
let data = await jsstp.OnTest("from jsstp.js!", 123123);
```

This is equivalent to:

```javascript
let data = await jsstp.SEND({
	"Event": "OnTest",
	"Reference0": "from jsstp.js!",
	"Reference1": 123123
});
```

You can write this for all events, but if the event doesn't start with `On`, you need to prefix the event name with `On_` when accessing jsstp so that it recognizes that you want to trigger the event.  
You can also use `jsstp.event.eventName(parameter)` to trigger the event, so you don't need to prefix the event name with `On_`  

After getting the return content, which is of type `jsstp.sstp_info_t`, there are various ways to use it.  

- Here are the methods inherited from `info_object`:

```javascript
data.keys; //Get all keys
data.values; //Get all values
data.entries; //Get all key-value pairs
data.length; //Get the number of key-value pairs
data.forEach((value, key) => console.log(key + "=" + value)); //Iterate through all key-value pairs: if the iteration function returns a value, that value will be updated to this key-value pair
//Omit the key argument to iterate over just the values
data.map((value, key) => value + "1"); //Iterate over all key-value pairs and return an array of the values returned by the iterator function
//Omitting the key argument allows you to iterate over just the values
```

- The following methods are inherited from `jsstp.base_sstp_info_t`:

```javascript
data.status_code; //Get the status code
data.head; //Get the message header
data.Script; //Get the value of the Script key in the message (other keys can also be obtained this way)
data.status_code_text; //Get the text of the status code in the message header
```

- Here are the methods owned by `jsstp.sstp_info_t`:

```javascript
data.get_passthrough("Result");
//Get the value of a key of `X-SSTP-PassThru` in the message, equivalent to `data["X-SSTP-PassThru-Result"]`
//You can also just use `data.Result` or `data["Result"]` to get the value of `X-SSTP-PassThru-Result`: this might be cleaner
data.passthroughs; //Get all `X-SSTP-PassThru` key-value pairs
data.raw; //Remove the proxy and access the original object
```

`sstp_info_t` is wrapped in a proxy since its construction, and given that in most cases developers don't need to access non-`X-SSTP-PassThru` key-value pairs, this proxy will preferentially return the `X-SSTP-PassThru-{key}` value when you access a key for which an `X-SSTP-PassThru` version exists.  
In other words, if the returned message has a `Script` key and an `X-SSTP-PassThru-Script` key, then `data.Script` or `data["Script"]` will return the value of `X-SSTP-PassThru-Script`, while `data.raw.Script` and `data.raw["Script"]` will return the value of `Script`.  
In most cases, this proxy will reduce the amount of code you have to work with, but always remember to use `data.raw` to access the original object when you need to access non-`X-SSTP-PassThru` key-value pairs.  

If you want to get whether ghost supports a certain event or not, you can write it like this:

```javascript
let result = await jsstp.has_event("OnTest"); //This is almost the same as jsstp.event.Has_Event(event_name, security_level).then(({ Result }) => Result == "1")!
console.log(result);
```

If you want to query events in bulk (like Ukadoc does!) , you can use `jsstp.new_event_queryer()` to get a queryer.

```javascript
let queryer = await jsstp.new_event_queryer();
```

queryer is of type `jsstp.ghost_events_queryer_t` and is used in various ways.

```javascript
queryer.check_event("OnTest").then(result => console.log(result));
```

The queryer, like `jsstp`, checks the event with an optional argument that specifies the event's security level. The default security level varies with the environment in which `jsstp` is running:  
If jsstp is running in node.js, the security level is `local`. If jsstp is running in a browser, the security level is `external` (because jsstp in a browser can only trigger external events!)  
If you want to modify the query local event, you need to specify the security level as `local`, like this:  

```javascript
queryer.check_event("OnBoot", "local");
jsstp.has_event("OnBoot", "local"); //Use jsstp like this
```

The queryer also supports some quick detection.  
The queryer is bound to the jsstp instance that constructed it; if you want the queryer to point to a specific ghost, modify the default additional messages by setting `jsstp.default_info` and use `reset` to clear the cache.  

```javascript
//Use the hwnd obtained in fmo; this avoids awkward situations caused by renaming
jsstp.default_info.ReceiverGhostHWnd = fmo[uuid].hwnd; //See below for how to get fmo, this is just an example
await queryer.reset();
```

If you're sure your ghost name is unique enough, you can also just use the ghost name. Only one of these two methods will work.

```javascript
jsstp.default_info.ReceiverGhostName = "橘花";
await queryer.reset();
```

The queryer also supports some quick tests to check the availability of the queryer.

```javascript
if (!queryer.available)
	console.info("Could not get a list of supported events"); //queryer is not available, you need to alert the user to update the ghost or give feedback to its author: jsstp uses the `Has_Event` event to check the availability of events, as does the ghost terminal.
if (!queryer.fast_query_available)
	console.info("Can't get a list of supported events quickly"); //This won't affect usage, it will just cause a query request to be made for uncached events: if ghost supports `Get_Supported_Events` events the queryer will use it to get a list of events (which will be much faster!)
else
	console.info("Hell yeah!");
```

If you want to get fmo information, you can write it like this:

```javascript
let fmo = await jsstp.get_fmo_infos();
if (fmo.available)
	console.log(fmo);
```

The type of fmo is `jsstp.fmo_info_t` and is used in various ways.  
`fmo_info_t` is a specialised `base_sstp_info_t`, so you can use all the methods of `base_sstp_info_t` on it (that is, all the methods of `sstp_info_t` except `get_passthrough`).  
It also has some special methods:  

```javascript
fmo.uuids; //Get all uuids, equivalent to `fmo.keys`
fmo.get_uuid_by("fullname", "Taromati2"); //Get the uuid of the specified attribute value equal to the specified value
fmo.get_list_of("fullname"); //Get all values of the specified attribute
fmo.available; //Get whether fmo has content
```

Each key-value pair of fmo is `String:info_object`, the key is the uuid and the value is the fmo information corresponding to that uuid.  
You can still use the member methods of `info_object` to manipulate the fmo information in fmo (see the introduction to `sstp_info_t` above).  
If you still don't understand it, you can check the structure of fmo in the console or look at the source code of jsstp.  
