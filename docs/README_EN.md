# jsstp  

[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/ukatech/jsstp-lib?color=green)](https://www.jsdelivr.com/package/gh/ukatech/jsstp-lib)
![npm downloads](https://img.shields.io/npm/dm/jsstp?label=npm%20downloads)
![install size](https://packagephobia.now.sh/badge?p=jsstp)  

Use js to communicate with ukagaka in environments such as web pages or node.js in order to exchange information.
See [ukagaka](https://en.wikipedia.org/wiki/Ukagaka) & [SSTP](http://ssp.shillest.net/ukadoc/manual/spec_sstp.html) for details.

## Usage

### 1. loading js

If you use npm, you can use npm to install jsstp.

```shell
npm i jsstp
```

Or if you're a nostalgist, you can access jsstp's source code via cdn.

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.0.1/dist/jsstp.min.js"></script>
```

Or load jsstp dynamically in js.

```javascript
var jsstp=await import("https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.0.1/dist/jsstp.mjs").then(m=>m.jsstp);
```

### 2. Use

You may need to check if the ghost is available before jsstp related operations

```javascript
if (!await jsstp.available())
	console.log("Ghost is not available, please check if ghost is started");
```

jsstp used to support passing callback functions as arguments before 2.0, but this is no longer supported
You can use `Promise` or `async`/`await` to get the return value if you need to
You can use `jsstp.SEND` to send a message

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
If you like nostalgia and just want to get the message itself, you can use `jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE].get_row`  

If you just want to trigger the event and don't need to customize it to send more complex messages, you can write it like this

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

You can write this for all events, but if the event doesn't start with `On`, you need to prefix the event name with `On_` when accessing jsstp so that it recognizes that you want to trigger the event  
You can also use `jsstp.event.eventName(parameter)` to trigger the event, so you don't need to prefix the event name with `On_`  

After getting the return content, which is of type `jsstp.sstp_info_t`, there are various ways to use it  

- Here are the methods inherited from `info_object`

```javascript
data.keys; //get all keys
data.values; //Get all values
data.entries; //Get all key-value pairs
data.length; //Get the number of key-value pairs
data.forEach((value, key) => console.log(key + "=" + value)); // iterate through all key-value pairs: if the iteration function returns a value, that value will be updated to this key-value pair
//Omit the key argument to iterate over just the values
data.map((value, key) => value + "1"); // iterate over all key-value pairs and return an array of the values returned by the iterator function
//Omitting the key argument allows you to iterate over just the values
```

- The following methods are inherited from `jsstp.base_sstp_info_t`

```javascript
data.status_code; //Get the status code
data.head; //Get the message header
data.Script; //Get the value of the Script key in the message (other keys can also be obtained this way)
data.status_code_text; //get the text of the status code in the message header
```

- Here are the methods owned by `jsstp.sstp_info_t`

```javascript
data.get_passthrough("Result");
//Get the value of a key of `X-SSTP-PassThru` in the message, equivalent to `data["X-SSTP-PassThru-Result"]`
// If there is no `Result` key in the message, you can also just use `data.Result` or `data["Result"]` to get the value of `X-SSTP-PassThru-Result`: this might be cleaner
data.passthroughs; // get all `X-SSTP-PassThru` key-value pairs
```

If you want to get whether ghost supports a certain event or not, you can write it like this

```javascript
let result = await jsstp.has_event("OnTest");// this is almost the same as jsstp.event.Has_Event(event_name, security_level).then(({ Result }) => Result == "1")!
console.log(result);
```

If you want to query events in bulk (like ukadoc does!) , you can use `jsstp.new_event_queryer()` to get a queryer

```javascript
let queryer = await jsstp.new_event_queryer();
//queryer is of type jsstp.ghost_events_queryer_t and is used in various ways
queryer.check_event("OnTest").then(result => console.log(result));
```

The queryer, like `jsstp`, checks the event with an optional argument that specifies the event's security level, the default security level varies with the environment in which `jsstp` is running:  
If jsstp is running in nodejs, the security level is `local`, if jsstp is running in a browser, the security level is `external` (because jsstp in a browser can only trigger external events!)  
If you want to modify the query local event, you need to specify the security level as `local`, like this:  

```javascript
queryer.check_event("OnBoot", "local");
jsstp.has_event("OnBoot", "local");// use jsstp like this
```

The queryer also supports some quick detection  
The queryer is bound to the jsstp instance that constructed it, if you want the queryer to point to a specific ghost, modify the default additional messages by setting `jsstp.default_info` and use `reset` to clear the cache  

```javascript
// use the hwnd obtained in fmo, this avoids awkward situations caused by renaming
jsstp.default_info.ReceiverGhostHWnd = fmo[uuid].hwnd;////See below for how to get fmo, this is just an example
await queryer.reset();
```

If you're sure your ghost name is unique enough, you can also just use the ghost name, and only one of these two methods will work

```javascript
jsstp.default_info.ReceiverGhostName = "橘花";
await queryer.reset();
```

The queryer also supports some quick tests for checking the availability of the queryer

```javascript
if (!queryer.available)
	console.info("Could not get a list of supported events");//queryer is not available, you need to alert the user to update the ghost or give feedback to its author: jsstp uses the `Has_Event` event to check the availability of events, as does the ghost terminal.
if (!queryer.fast_query_available)
	console.info("Can't get a list of supported events quickly");// This won't affect usage, it will just cause a query request to be made for uncached events: if ghost supports `Get_Supported_Events` events the queryer will use it to get a list of events (which will be much faster!)
else
	console.info("Hell yeah!");
```

If you want to get fmo information, you can write it like this

```javascript
let fmo = await jsstp.get_fmo_infos();
if (fmo.available)
	console.log(fmo);
```

The type of fmo is `jsstp.fmo_info_t` and is used in various ways  
`fmo_info_t` is a specialised `base_sstp_info_t`, so you can use all the methods of `base_sstp_info_t` on it (that is, all the methods of `sstp_info_t` except `get_passthrough`)  
It also has some special methods  

```javascript
fmo.uuids; //get all uuids, equivalent to `fmo.keys`
fmo.get_uuid_by("fullname", "Taromati2"); //Get the uuid of the specified attribute value equal to the specified value
fmo.get_list_of("fullname"); //get all values of the specified attribute
fmo.available; //get whether fmo has content
```

Each key-value pair of fmo is `String:info_object`, the key is the uuid and the value is the fmo information corresponding to that uuid  
You can still use the member methods of `info_object` to manipulate the fmo information in fmo (see the introduction to `sstp_info_t` above)  
If you still don't understand it, you can check the structure of fmo in the console or look at the source code of jsstp  
