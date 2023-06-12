# jsstp  

[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/ukatech/jsstp-lib?color=green)](https://www.jsdelivr.com/package/gh/ukatech/jsstp-lib)  

Webページでゴーストと通信し、情報をやりとりするためにjsを使用します。
詳細は[伺か](https://ja.wikipedia.org/wiki/%E4%BC%BA%E3%81%8B)と[SSTP](http://ssp.shillest.net/ukadoc/manual/spec_sstp.html)を参照してください。

## 使用方法

### 1. jsの読み込み

```html
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.0.0/jsstp.min.js"></script>
<!-- または --->
<script src="https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.0.0/jsstp.js"></script>
```

jsstpはjsで動的に読み込むことも可能です。

```javascript
var jsstp=await import("https://cdn.jsdelivr.net/gh/ukatech/jsstp-lib@v2.0.0.0/jsstp.mjs").then(m=>m.jsstp);
```

### 2.使用する

```javascript
// jsstp関連の操作の前に、ghostが利用可能かどうかを確認する必要があるかもしれません。
if (!await jsstp.available())
	console.log("ghost is not available, please check if ghost is up");

//jsstp は2.0以前はコールバック関数を引数として渡すことをサポートしていましたが、現在はサポートされていません。
// 必要であれば Promise や async/await を使って戻り値を取得することができます。
// jsstp.SENDを使ってメッセージを送信することができます。
jsstp.SEND(
	{/// イベントメッセージ
		"Event": "OnTest",
		"Script": " \\0Hello, World!\\e"
	}
).then((data) => {
	console.log("head: " + data.head);
	console.log(JSON.stringify(data));
	console.log(data["Script"]);
});
//jsstp は sstp の基本操作をすべてサポートしているので、jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE] が呼び出せます。
// ノスタルジーが好きで、メッセージそのものを取得したいだけなら、 jsstp.[SEND|NOTIFY|COMMUNICATE|EXECUTE|GIVE].get_row を使用することができます。

// イベントをトリガーするだけで、より複雑なメッセージを送信するためのカスタマイズが必要ない場合は、次のように記述します。

let data = await jsstp.OnTest("from jsstp.js!", 123123);
/*
	これと同等です：
	jsstp.SEND({
		"イベント": "OnTest",
		"Reference0": "from jsstp.js!",
		"Reference1": 123123
	});
	これはすべてのイベントに対して書くことができますが、イベントが `On` で始まらない場合は、イベント名の前に `On_` を付けて jsstp にアクセスし、イベントをトリガーしたいことを認識させる必要があります。
	また、`jsstp.event.eventName(parameter)`を使用してイベントをトリガーすることもできますので、イベント名の前に`On_`を付ける必要はありません。
*/
console.log("status code: " + data.status_code);
//data は jsstp.sstp_info_t 型であり、様々な方法で使用される。
//以下のメソッドはinfo_objectから継承されます。
data.keys; //すべてのキーを取得する
data.values;//すべての値を取得する
data.entries; //すべてのキーと値のペアを取得する
data.length; //キー・バリュー・ペアの数を取得する。
data.forEach((value, key) => console.log(key + "=" + value)); // すべてのキーと値のペアを反復する：反復関数が値を返す場合、その値はこのキーと値のペアに更新されます。
//以下のメソッドはユニークです。
data.get_passthrough("Rseult"); //メッセージ内のX-SSTP-PassThruのキーの値を取得。data["X-SSTP-PassThru-Rseult"]と同等。
data.Script; //メッセージ中のScriptのキーの値を取得する
data.head; //メッセージのヘッダーを取得する。
data.status_code; //メッセージヘッダのステータスコードを取得する。
// メッセージにRseultキーがない場合、data.Rseultまたはdata["Rseult"]を使用してX-SSTP-PassThru-Rseultの 値を取得することもできる。

// ゴーストが特定のイベントをサポートしているかどうかを取得したい場合、次のように記述することができます。
let result = await jsstp.has_event("OnTest");//(await jsstp.event.Has_Event(event_name, security_level)).Result!="1";とほぼ同じである！
console.log(result);
// イベントを一括して問い合わせたい場合（ukadocがそうであるように!） )、jsstp.new_event_queryer()を使ってクエリを取得することができます。
let queryer = await jsstp.new_event_queryer();
//queryer は jsstp.ghost_events_queryer_t 型であり、様々な方法で使用されます。
queryer.check_event("OnTest").then(result => console.log(result));
//queryerは、jsstpと同様に、イベントのセキュリティレベルを指定するオプションのパラメータでイベントをチェックします。デフォルトは「external」です（これは、ghostにイベントを送信するWebページの一般的なセキュリティレベルであるため）。
// ローカルイベントを照会したい場合は、次のようにセキュリティレベルを「local」と指定する必要があります：
queryer.check_event("OnBoot", "local");
jsstp.has_event("OnBoot", "local");//jsstp をこのように使用します。
//queryer にはキャッシュの仕組みがあるので、キャッシュをクリアしたい場合：
await queryer.reset();
//queryerを構築したjsstpインスタンスにバインドされます。queryerが特定のゴーストを指すようにしたい場合は、jsstp.default_infoを設定してデフォルトの追加メッセージを変更し、リセットでキャッシュをクリアしてください。
// fmoで取得したhwndを使用することで、リネームによる厄介な状況を回避することができます。
jsstp.default_info.ReceiverGhostHWnd = 123456;// fmoの取得方法については以下を参照してください（ここではほんの一例です）。
//ゴーストの名前が十分にユニークであることが確認された場合、ゴーストの名前だけを使用することも可能です。
jsstp.default_info.ReceiverGhostName = "橘花";
//queryerは、いくつかの迅速な検出をサポートしています。
if (!queryer.available)
	console.info("対応イベント一覧の取得ができない");//queryer が利用できない場合は、ゴーストを更新するか、その作者にフィードバックするようにユーザーに警告する必要があります。jsstp はゴースト端末と同様に `Has_Event` イベントを使ってイベントの利用可能性を確認します。
if (!queryer.fast_query_available)
	console.info("対応イベント一覧の高速取得ができない");// これは使用には影響しません。キャッシュされていないイベントに対してクエリ要求が行われるだけです。ghostが`Get_Supported_Events`イベントをサポートしていれば、クエリはそれを使用してイベントのリストを取得します（これはずっと速くなります！）。
else
	console.info("オーケーオーケー");

//fmo の情報を取得したい場合は、次のように記述します。
let fmo = await jsstp.get_fmo_infos();
if (fmo.available)
	console.log(fmo);
//fmo は jsstp.fmo_info_t 型で、様々な用途に使われます。
//fmo_info_t は特殊化された sstp_info_t なので、sstp_info_t のメソッドをすべて使うことができる。
// また、いくつかの特殊なメソッドも持っている
fmo.uuids; //全てのuuidを取得する、`fmo.keys`に相当する。
fmo.get_uuid_by("fullname", "Taromati2"); //指定した属性値に等しいuuidを取得する。
fmo.get_list_of("fullname"); //指定された属性の全ての値を取得する。
fmo.available; //コンテンツがあるかどうかを取得します。
//fmo の各キーと値のペアは String:info_object であり、キーは uuid、値はその uuid に対応する fmo 情報である。
// info_objectのメンバーメソッドを使用しても、fmoのfmo情報を操作することができます（上記のsstp_info_tの紹介を参照）。
// それでも理解できない場合は、コンソールでfmoの構造を確認するか、jsstpのソースコードを見てみてください
```
詳細な定義や機能については、ソースコードをお読みください。
