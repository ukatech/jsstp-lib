# jsstp  

[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/ukatech/jsstp-lib?color=green)](https://www.jsdelivr.com/package/gh/ukatech/jsstp-lib)
![npm downloads](https://img.shields.io/npm/dm/jsstp?label=npm%20downloads)
![install size](https://packagephobia.now.sh/badge?p=jsstp)  

Webページやnode.jsなどの環境で、ゴーストと通信して情報をやりとりするためにjsを使用します。  
詳細は[伺か](https://ja.wikipedia.org/wiki/%E4%BC%BA%E3%81%8B)と[SSTP](http://ssp.shillest.net/ukadoc/manual/spec_sstp.html)を参照してください。

## 使用方法

### 1. jsの読み込み

npmを使用している場合は、npmを使用してjsstpをインストールすることができます。

```shell
npm i jsstp
```

その後、jsstpをjsにインポートします。

```javascript
var jsstp=require("jsstp");
//または
import jsstp from "jsstp";
```

あるいは、古式ゆかしい方法で、cdn経由でjsstpのソースコードにアクセスすることができます。

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.1.0/dist/jsstp.min.js"></script>
```

jsstpをjsで動的に読み込むこともできます。

```javascript
var jsstp=await import("https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.1.0/dist/jsstp.mjs").then(m=>m.jsstp);
```

### 2.使用する

jsstp関連の操作の前に、ghostが利用可能かどうかを確認する必要があるかもしれません。

```javascript
if (!await jsstp.available())
	console.log("ghostは利用できません。ghostが起動しているかどうか確認してください。");
```

jsstpは2.0以前はコールバック関数を引数として渡すことができましたが、現在はサポートされていません。
必要であれば `Promise` や `async`/`await` を使用して戻り値を取得することができます。
メッセージを送信するには、`jsstp.SEND`を使用することができます。

```javascript
jsstp.SEND(
	{//イベント情報
		"Event": "OnTest",
		"Script": "\\0Hello, World!\\e"
	}
).then((data) => {
	console.log("head: " + data.head);
	console.log(JSON.stringify(data));
	console.log(data["Script"]);
});
```

jsstpはsstpの基本操作をすべてサポートしており、`jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE]`が呼び出せます。 
古式ゆかしい方法が好きで、メッセージそのものを取得したいだけなら、 `jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE].get_raw` を使用することができます。 

イベントをトリガーするだけで、より複雑なメッセージを送信するためにカスタマイズする必要がない場合は、次のように書くことができます。

```javascript
let data = await jsstp.OnTest("from jsstp.js!", 123123);
```

これは以下と等価です： 

```javascript
let data = await jsstp.SEND({
	"Event": "OnTest",
	"Reference0": "from jsstp.js!",
	"Reference1": 123123
});
```

これはすべてのイベントに対して書くことができますが、イベントが `On` で始まらない場合は、イベント名の前に `On_` を付けて、jsstp にアクセスして、イベントをトリガーしたいことを認識させる必要があります。 
また、`jsstp.event.eventName(parameter)`を使用してイベントをトリガーすることができ、その際はイベント名の前に`On_`を付ける必要はありません。  

返される内容は、`jsstp.sstp_info_t`型で取得され、様々な方法で利用されます。  

- 以下のメソッドは `info_object` から継承されます。

```javascript
data.keys; //全てのキーを取得する
data.values; //全ての値を取得する
data.entries; //すべてのキーと値のペアを取得する
data.length; //キー・バリュー・ペアの数を得る
data.forEach((value, key) => console.log(key + "=" + value)); // すべてのキーと値のペアを反復処理する：反復処理関数が値を返す場合、その値はこのキーと値のペアに更新されます。
//key引数を省略すると、値のみを反復処理する。
data.map((value, key) => value + "1"); // すべてのキーと値のペアを繰り返し、イテレータ関数が返す値の配列を返す。
//キー引数を省略すると、値のみを反復処理することができます。
```

- 以下のメソッドは `jsstp.base_sstp_info_t` から継承されます。

```javascript
data.status_code; //ステータスコードを取得する。
data.head; //メッセージのヘッダを取得します。
data.Script; //メッセージのScriptキーの値を取得する（他のキーもこの方法で取得することができる）
data.status_code_text; //メッセージヘッダのステータスコードのテキストを取得する
```

- 以下は `jsstp.sstp_info_t` が持つメソッドです。

```javascript
data.get_passthrough("Result");
//メッセージ内の `X-SSTP-PassThru` のキーの値を取得する（`data["X-SSTP-PassThru-Result"]`と同等）。
//`X-SSTP-PassThru-Result` の値を取得するために `data.Result` または `data["Result"]` を使用することもできる: この方がすっきりするかもしれない
data.passthroughs; // すべての `X-SSTP-PassThru` のキーバリューペアを取得する。
data.raw; // プロキシを削除して、元のオブジェクトにアクセスする。
```

ほとんどの場合、開発者は `X-SSTP-PassThru` 以外のキーバリューペアにアクセスする必要はないので、 `X-SSTP-PassThru-{key}` バージョンが存在するキーにアクセスすると、このプロキシは優先的に `X-SSTP-PassThru-{key}` の値を返します。  
つまり、返されたメッセージに `Script` キーと `X-SSTP-PassThru-Script` キーがある場合、 `data.Script` または `data["Script"]` は `X-SSTP-PassThru-Script` の値を返し、 `data.raw.Script` および `data.raw["Script"]` は `Script` の値を返します。  
ほとんどの場合、このプロキシを使用すると、必要なコードの量を減らすことができます。また、`X-SSTP-PassThru` 以外のキーと値のペアにアクセスする必要がある場合は、常に `data.raw` を使用して raw オブジェクトにアクセスすることを忘れないでください。  

ゴーストがあるイベントをサポートしているかどうかを取得したい場合は、次のように記述します：

```javascript
let result = await jsstp.has_event("OnTest");// これは jsstp.event.Has_Event(event_name, security_level).then(({ Result }) => Result == "1") とほとんど同じです．
console.log(result);
```

イベントを一括して問い合わせたい場合（ukadocがそうであるように!）、`jsstp.new_event_queryer()`を使ってクエリを取得することができます。

```javascript
let queryer = await jsstp.new_event_queryer();
```

queryer は `jsstp.ghost_events_queryer_t` 型であり、様々な方法で使用されます。

```javascript
queryer.check_event("OnTest").then(result => console.log(result));
```

queryer は `jsstp` と同様に、オプションの引数でイベントのセキュリティレベルを指定してイベントをチェックします。デフォルトのセキュリティレベルは `jsstp` が動作している環境によって異なります：  
jsstpがnodejsで動作している場合、セキュリティレベルは `local` で、jsstpがブラウザで動作している場合、セキュリティレベルは `external` です（ブラウザのjsstpは外部イベントのみをトリガーできるため！）。  
クエリのローカルイベントを修正したい場合は、次のようにセキュリティレベルを `local` に指定する必要があります：  

```javascript
queryer.check_event("OnBoot", "local");
jsstp.has_event("OnBoot", "local");// このようにjsstpを使用します。
```

queryer は、いくつかのクイック検出もサポートしています。  
もしクエリアが特定のゴーストを指すようにしたい場合は、`jsstp.default_info`を設定してデフォルトの追加メッセージを変更し、`reset`を使用してキャッシュをクリアしてください。  

```javascript
// fmoで取得したhwndを使用することで、名前の変更によって生じる厄介な状況を回避することができます。
jsstp.default_info.ReceiverGhostHWnd = fmo[uuid].hwnd;// fmoの取得方法については以下を参照してください。
await queryer.reset();
```

ゴーストの名前が十分にユニークであると確信がある場合は、ゴーストの名前だけを使うこともできます。この2つの方法のうち1つだけが機能します。

```javascript
jsstp.default_info.ReceiverGhostName = "橘花";
await queryer.reset();
```

クエリの可用性を確認するためのクイックテストもサポートしています。

```javascript
if (!queryer.available)
	console.info("対応イベント一覧を取得できませんでした");//queryer が利用できない場合、ghost を更新するようにユーザーに警告するか、その作者にフィードバックする必要があります。jsstp は ghost 端末と同様に、`Has_Event` イベントを使ってイベントの利用状況を確認しています。
if (!queryer.fast_query_available)
	console.info("対応イベント一覧の高速取得ができない");// これは使用には影響しません。キャッシュされていないイベントに対してクエリ要求が行われるだけです。ghostが `Get_Supported_Events` イベントをサポートしていれば、クエリはそれを使用してイベントのリストを取得します（これはずっと速くなります！）。
else
	console.info("然り");
```

fmoの情報を取得したい場合は、以下のように記述します。

```javascript
let fmo = await jsstp.get_fmo_infos();
if (fmo.available)
	console.log(fmo);
```

fmoの型は `jsstp.fmo_info_t` で、様々な方法で使用されます。  
`fmo_info_t` は特殊な `base_sstp_info_t` であり、`base_sstp_info_t` のすべてのメソッドを使用できます（つまり `get_passthrough` を除く `sstp_info_t` のすべてのメソッド）。  
また、いくつかの特殊なメソッドも持っています。  

```javascript
fmo.uuids; //全てのuuidを取得する、`fmo.keys`と同じ。
fmo.get_uuid_by("fullname", "Taromati2"); //指定した属性値に等しいuuidを取得する。
fmo.get_list_of("fullname"); //指定された属性のすべての値を取得する
fmo.available; //fmoがコンテンツを持っているかどうかを取得します。
```

fmoの各キーと値のペアは `String:info_object` で、キーはuuid、値はそのuuidに対応するfmo情報です。  
fmoのfmo情報を操作するために、`info_object`のメンバーメソッドを使用することができます（上記の`sstp_info_t`の紹介を参照）。  
それでも理解できない場合は、コンソールでfmoの構造を確認したり、jsstpのソースコードを見たりしてください  
