/**
 * より読みやすい派生クラスの関数型で初期化できる拡張可能な関数型。
 */
declare class ExtensibleFunction<args_T extends Array<any>, return_T> extends Function {
	/**
	 * 自己関数のインスタンス初期化
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	constructor(func: (...args: args_T) => return_T);
	/**
	 * 関数を呼び出し、関数の this 値を指定されたオブジェクトに、関数の引数を指定された配列に置き換えます。  
	 * [MDNドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
	 * @param thisArg thisオブジェクトとして使用されるオブジェクト。
	 * @param argArray 関数に渡される引数のセット。
	 */
	apply(thisArg: (...args: args_T) => return_T, argArray?: args_T): return_T;

	/**
	 * 現在のオブジェクトを別のオブジェクトに置き換えるオブジェクトのメソッドを呼び出します。  
	 * [MDNドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
	 * @param thisArg 現在のオブジェクトとして使用されるオブジェクト。
	 * @param argArray メソッドに渡される引数のリスト。
	 */
	call(thisArg: (...args: args_T) => return_T, ...argArray: args_T): return_T;

	/**
	 * 与えられた関数に対して、元の関数と同じボディを持つ束縛関数を作成します。  
	 * バインドされた関数の this オブジェクトは、指定されたオブジェクトに関連付けられ、指定された初期引数を持ちます。  
	 * [MDNドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
	 * @param thisArg 新しい関数内で this キーワードが参照できるオブジェクト。
	 * @param argArray 新しい関数に渡される引数のリスト。
	 */
	bind(thisArg: (...args: args_T) => return_T, ...argArray: any): (...args: args_T) => return_T;

	/**
	 * 関数の名前  
	 * [MDNドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
	 */
	readonly name: string;

	/**
	 * 関数の引数の数  
	 * [MDNドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
	 */
	readonly length: number;
}
interface ExtensibleFunction<args_T extends Array<any>, return_T> {
	/**
	 * 自己関数のインスタンス初期化
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	new(func: (...args: args_T) => return_T): ExtensibleFunction<args_T, return_T>;
	/**
	 * 関数を呼び出し
	 */
	(...args: args_T): return_T;
}
/**
 * ghostとの通信におけるセキュリティレベル
 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
 */
type security_level_t = "local" | "external";
/**
 * SSTP return codes  
 * HTTPと同じく、200番台は正常受理、その他はエラー。
 * @enum {number}
 */
declare enum documented_sstp_return_code_t {
	/** 正常終了（返り値つき） */
	OK = 200,
	/** 正常終了（返り値なし） */
	NO_CONTENT = 204,
	/**
	 * 実行はされたがスクリプト実行中にブレークされた  
	 * ※EntryつきのSEND/1.xなど極めて限られた状況に限り、通常は即時200か204リターン。
	 */
	BREAK = 210,
	/** リクエストに何かしらカバーしきれない不備がある */
	BAD_REQUEST = 400,
	/** ゴースト指定のSSTPで該当ゴーストがインストールや起動がされていない ※SSPのみ */
	NOT_FOUND = 404,
	/** タイムアウト：ゴースト/SHIORI側と通信できない時など（普段はほぼ起こらない） */
	REQUEST_TIMEOUT = 408,
	/** \tタグなどの割り込み禁止状態か、他のリクエストの処理中 */
	CONFLICT = 409,
	/** SSTPリクエストが長すぎて処理を拒否した ※SSPのみ */
	PAYLOAD_TOO_LARGE = 413,
	/** ゴースト側の設定の都合で受信拒否された */
	REFUSE = 420,
	/** 処理系内部で検出されたなにかしらの問題で処理しきれなかった ※SSPのみ */
	INTERNAL_SERVER_ERROR = 500,
	/** 未実装のコマンドなどが含まれて処理できなかった */
	NOT_IMPLEMENTED = 501,
	/** 処理系内部の都合でSSTPを受け付けられない状態 */
	SERVICE_UNAVAILABLE = 503,
	/** SSTPのバージョンがおかしい（1.0未満、3.0以上など） ※SSPのみ */
	VERSION_NOT_SUPPORTED = 505,
	/** 最小化などでゴーストが表示されておらず、何も処理できない状態 */
	INVISIBLE = 512,
	/** 不明なエラーが発生した */
	PARSE_ERROR = NaN
}
/**
 * SSTP return codes  
 * HTTPと同じく、200番台は正常受理、その他はエラー。
 * @enum {number}
 */
type sstp_return_code_t = number & documented_sstp_return_code_t;
/**
 * 基本的な SSTP パケット
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#req_res}
 */
type base_sstp_content_t = {
	/**
	 * リクエストの文字コード。一番最初の行に現れるのが望ましい。  
	 * 特に理由がなければUTF-8を推奨する。
	 */
	CharSet: string | undefined,

	/**
	 * 送信者を示す文字列。「SSTP送信ツール」など。COMMUNICATEメソッドの場合は、送信元のゴースト\0名。
	 */
	Sender: string | undefined,

	/**
	 * SHIORIやSakuraScriptで処理する際のセキュリティレベルの指定。local/externalのいずれか。  
	 * DirectSSTP、または127.0.0.1等明らかにローカルから来たリクエストのみ有効。
	 */
	SecurityLevel: security_level_t | undefined,

	/**
	 * SSTPで実行されるSakuraScriptがどのように扱われるかのオプションを指定する。  
	 * カンマ区切りで複数指定可能。指定する文字列は以下の通り。  
	 * nodescript : バルーンのSSTP表示を無効にする(リモートからのSSTPは無効)  
	 * notranslate : OnTranslateやMAKOTOでのトランスレート処理を行わない  
	 * nobreak : 現在実行中のスクリプトを中断せず、終わるまで待つ
	 */
	Option: string | undefined,

	/**
	 * "Owned SSTP"と呼ばれるもの。SHIORI uniqueidで送られてきたIDか、FMOの識別ID(SSPのみ)を指定すると、各種セキュリティチェックやロック等を無視して、本SSTPをゴースト内部での処理と同じ優先度で扱う。  
	 * SecurityLevel指定がlocalになり、さらに\tなどの割り込み禁止状態でも強制的に割り込み再生を可能とする。
	 */
	ID: string | undefined,

	/**
	 * NOTIFYなどゴースト側との通信の際に、SHIORIに直接渡されるヘッダ。  
	 * 文字コード変換等最低限の処理が行われるだけで、(任意の文字列)の部分や中身はそのまま中継される。
	 */
	[key: `X-SSTP-PassThru-${string}`]: string | undefined,

	/**
	 * DirectSSTP限定で、responseを返信すべきウインドウハンドルを示す。  
	 * ウインドウハンドル(ポインタ相当)のデータを符号なし10進整数として扱い、それを文字列化したもの。  
	 * 省略時はWM_COMMUNICATEのwParam。
	 */
	HWnd: string | undefined,

	/**
	 * (Socket)SSTP限定で、requestを送るべきゴーストの\0のウインドウハンドルを示す。  
	 * これを指定すると、処理すべきゴーストが固定され、Socket経由でもDirectSSTPと同じ処理が可能になる。  
	 * 見つからなかった場合は、404 Not Foundで即時エラー終了する。
	 */
	ReceiverGhostHWnd: string | undefined,

	/**
	 * (Socket)SSTP限定で、requestを送るべきゴーストの\0名を示す。  
	 * これを指定すると、処理すべきゴーストが固定され、Socket経由でもDirectSSTPと同じ処理が可能になる。HWndの名前版。  
	 * 見つからなかった場合は、404 Not Foundで即時エラー終了する。
	 */
	ReceiverGhostName: string | undefined,

	/**
	 * その他のSSTPコンテンツ
	 */
	[key: string]: string | undefined
};
/**
 * イベント用の一般的な SSTP コンテンツ
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_notify}
 */
type common_event_sstp_content_t = {
	/**
	 * イベント名
	 */
	Event: string
	/**
	 * 引数
	 */
	[key: `Reference${number}`]: any
	/**
	 * ゴーストの名前を\0側の名前と\1側の名前の形式で指定すると、その後に続く{@link common_event_sstp_content_t.Script}ヘッダーは、そのゴーストに特有のものとみなされます。  
	 * 内容を省略すると、同じScriptヘッダーが任意のゴーストに対して再生されます。  
	 * SSTPゴースト有効化オプションが有効になっている場合、ここで指定したゴーストは一時的に有効化されます。  
	 * jsの言語制限のため、ここでは一つのゴーストしか指定できません。  
	 * 複数のIfGhostが必要な場合は、{@link jsstp_t.row_send}を使ってSSTPメッセージを送信することを検討してください。
	 */
	IfGhost: string | undefined
	/**
	 * サクラスクリプト  
	 * ScriptヘッダーがIfGhostの直後に続かない場合、IfGhostに対応しない場合は、デフォルトの処理スクリプトになります。  
	 * jsの言語制限のため、ここでは一つのスクリプトしか指定できません。  
	 * 複数のScriptが必要な場合は、{@link jsstp_t.row_send}を使ってSSTPメッセージを送信することを検討してください。
	 */
	Script: string | undefined
	/**
	 * その他のSSTPコンテンツ
	 */
	[key: string]: string | undefined
};
/**
 * @enum {string} documented_sstp_command_name_t
 * @description SSTPの文書化されたコマンドの列挙型
 */
declare enum documented_sstp_command_name_t {
	/**
	 * 起動中のゴーストの名前を(\0名),(\1名)の形式でカンマ区切りで返す
	 */
	GetName = "GetName",
	/**
	 * インストールされているゴーストの名前のリストを、一行に一つの\0名の形式で、空行で終わる形で返す
	 */
	GetNames = "GetNames",
	/**
	 * FMOという、起動中のゴーストの状態を保存するファイルと同等の情報を返す  
	 * ただし、このコマンドはSSTPで通信したアプリケーション内部での管理分に限り、同時実行中のアプリケーション群共用である本来のFMOとは異なる  
	 * 主にウインドウを持たずDirect SSTPを送信できないコンソールアプリなどで、Socket SSTPのみでReceiverGhostHWndヘッダを活用しDirect SSTP相当の機能を実現するために用いられる  
	 * 一行に一つのゴーストの情報を返し、空行で終わる  
	 * リモートからの要求の場合は、各パス情報が抜け、ヘッダとhwndがダミーに置き換わる
	 */
	GetFMO = "GetFMO",
	/**
	 * 起動中のゴースト本体の名前（descript.txtのname）を返す
	 */
	GetGhostName = "GetGhostName",
	/**
	 * 起動中のゴーストの現在使用中のシェルの名前を返す
	 */
	GetShellName = "GetShellName",
	/**
	 * 起動中のゴーストの現在使用中のバルーンの名前を返す
	 */
	GetBalloonName = "GetBalloonName",
	/**
	 * ベースウェア（ゴーストを実行するソフト）のバージョンを返す
	 */
	GetVersion = "GetVersion",
	/**
	 * SSPで認識している全ゴーストの名前（descript.txtのname）のリストを、一行に一つの名前の形式で、空行で終わる形で返す
	 */
	GetGhostNameList = "GetGhostNameList",
	/**
	 * 起動中のゴーストで認識している全シェルの名前（descript.txtのname）のリストを、一行に一つの名前の形式で、空行で終わる形で返す
	 */
	GetShellNameList = "GetShellNameList",
	/**
	 * SSPで認識している全バルーンの名前（descript.txtのname）のリストを、一行に一つの名前の形式で、空行で終わる形で返す
	 */
	GetBalloonNameList = "GetBalloonNameList",
	/**
	 * SSPで認識している全ヘッドラインの名前（descript.txtのname）のリストを、一行に一つの名前の形式で、空行で終わる形で返す
	 */
	GetHeadlineNameList = "GetHeadlineNameList",
	/**
	 * SSPで認識している全プラグインの名前（descript.txtのname）のリストを、一行に一つの名前の形式で、空行で終わる形で返す
	 */
	GetPluginNameList = "GetPluginNameList",
	/**
	 * ベースウェア（ゴーストを実行するソフト）のバージョンを、ピリオド区切りのバージョン番号のみの形式で返す  
	 * これを[version.json](https://ssp.shillest.net/archive/version.json)の`ssp.full.version`などと単純比較すると最新版かどうかチェックできる
	 */
	GetShortVersion = "GetShortVersion",
	/**
	 * Restoreを実行するか、16秒間が経過するまでゴーストが黙る。追加データなし（ステータスコード200番台で成功）
	 */
	Quiet = "Quiet",
	/**
	 * Quietを解除する。追加データなし（ステータスコード200番台で成功）
	 */
	Restore = "Restore",
	/**
	 * 指定したフォルダ内のファイル群を圧縮ファイルに圧縮する  
	 * 処理が終わるまでレスポンスが返らないので注意  
	 * パラメータ0：圧縮ファイル名  
	 * パラメータ1：圧縮すべきフォルダのフルパス  
	 * 追加データなし（ステータスコード200番台で成功）
	 */
	CompressArchive = "CompressArchive",
	/**
	 * 指定した圧縮ファイルを解凍する  
	 * 処理が終わるまでレスポンスが返らないので注意  
	 * パラメータ0：圧縮ファイル名  
	 * パラメータ1：解凍先のフォルダのフルパス  
	 * 追加データなし（ステータスコード200番台で成功）
	 */
	ExtractArchive = "ExtractArchive",
	/**
	 * 合成済みのサーフェス画像を指定したディレクトリに出力する。パラメータは`\![execute,dumpsurface]`と同じ  
	 * 処理が終わるまでレスポンスが返らないので注意  
	 * 追加データなし（ステータスコード200番台で成功）
	 */
	DumpSurface = "DumpSurface",
	/**
	 * `\![moveasync]`と同じことをSakura Scriptを介さずに実行する。パラメータ指定方法はSakura Script版と同じ  
	 * SSTPのタイムアウトまでにresponseを返せないのとデッドロックの原因になるため、asyncなしのmoveは実行できない  
	 * 追加データなし（ステータスコード200番台で成功）
	 */
	MoveAsync = "MoveAsync",
	/**
	 * `\![set,tasktrayicon]`と同じことをSakura Scriptを介さずに実行する。パラメータ指定方法はSakura Script版と同じ  
	 * 追加データなし（ステータスコード200番台で成功）
	 */
	SetTrayIcon = "SetTrayIcon",
	/**
	 * `\![set,trayballoon]`と同じことをSakura Scriptを介さずに実行する。パラメータ指定方法はSakura Script版と同じ  
	 * 追加データなし（ステータスコード200番台で成功）
	 */
	SetTrayBalloon = "SetTrayBalloon",
	/**
	 * プロパティシステムに値を書き込む  
	 * パラメータ0：プロパティの名前  
	 * パラメータ1：設定すべき値  
	 * 追加データなし（ステータスコード200番台で成功）
	 */
	SetProperty = "SetProperty",
	/**
	 * プロパティシステムから値を読み出す  
	 * パラメータ0：プロパティの名前  
	 * 追加データは取得したプロパティの値
	 */
	GetProperty = "GetProperty",
	/**
	 * Senderで指定したクライアント名ごとに保存される、汎用データ保存領域に書き込む  
	 * ブラウザの「クッキー」と同様の使い方を想定している  
	 * パラメータ0：クッキーの名前  
	 * パラメータ1：設定すべき値  
	 * 追加データなし（ステータスコード200番台で成功）
	 */
	SetCookie = "SetCookie",
	/**
	 * Senderで指定したクライアント名ごとに保存される、汎用データ保存領域から読み出す  
	 * パラメータ0：クッキーの名前  
	 * 追加データは取得したクッキーの値
	 */
	GetCookie = "GetCookie"
}
/**
 * SSTPコマンド名
 * @enum {string}
 */
type sstp_command_name_t = string & documented_sstp_command_name_t;
/**
 * 一般的なSSTP実行パケットの内容
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_execute}
 */
type common_execute_sstp_content_t = {
	/**
	 * 実行するコマンド。
	 */
	Command: sstp_command_name_t | `${sstp_command_name_t}[${string}]`
	/**
	 * 実行のパラメータ情報。
	 */
	[key: `Reference${number}`]: any
	/**
	 * その他のSSTPの内容
	 */
	[key: string]: string | undefined
};
/**
 * 一般的なSSTP通信パケットの内容
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_communicate}
 */
type common_communicate_sstp_content_t = {
	/**
	 * 送信するサクラスクリプト
	 */
	Sentence: string
	/**
	 * 通信の拡張情報。  
	 * SHIORI/3.0ではReference2以降に格納される。SSTP Reference0 = SHIORI Reference2。
	 */
	[key: `Reference${number}`]: any
	/**
	 * 送信元ゴーストの通信送信時点（≒スクリプト実行終了時点）の\0と\1の表情番号。  
	 * OnCommunicateイベントでSurfaceヘッダとして渡される。
	 * @example `5,11` //\0が5、\1が11という意味
	 */
	Surface: string
	/**
	 * その他のSSTPの内容
	 */
	[key: string]: string | undefined
};
/**
 * 一般的なSSTP与えるパケットの内容
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_sstp.html#method_give}
 */
type common_give_sstp_content_t = {
	/**
	 * 与えるテキスト  
	 * SHIORI/3.0では、ユーザー通信と同じで、OnCommunicateイベントが発生する。
	 */
	Document: string
	/**
	 * 与える歌の名前。  
	 * SHIORI/3.0では、OnMusicPlayイベントが発生し、Reference0が指定された文字列になる。
	 */
	Song: string
	/**
	 * その他のSSTPの内容
	 */
	[key: string]: string | undefined
};

/**
 * オブジェクトを拡張して、いくつかの簡単な反復操作を提供する。
 */
declare class info_object<key_T = PropertyKey, value_T = any> {
	/**
	 * @description すべてのキーの配列を取得する
	 */
	/*@__PURE__*/get keys(): key_T[];
	/**
	 * @description すべての値の配列を取得する
	 */
	/*@__PURE__*/get values(): value_T[];
	/**
	 * @description すべてのキーと値のペアの配列を取得します。
	 */
	/*@__PURE__*/get entries(): [key_T, value_T][];
	/**
	 * @description 会員数の取得
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * @description キーと値のペアごとに関数を実行する。
	 * @param {(value,key?)} func 戻り値が未定義でない場合に、元の値を置き換えるために実行される関数。
	 */
	/*@__PURE__*/forEach(func: (value: value_T, key?: key_T) => value_T | undefined): void;
	/**
	 * @description 新しいオブジェクトをコピーします。
	 * @returns {info_object} コピーされたオブジェクト
	 */
	/*@__PURE__*/get trivial_clone(): info_object<key_T, value_T>;
	/**
	 * @description 自分自身とその子をトラバースし、トラバース結果の1次元配列を返す。
	 * @param {(dimensions[...] ,value):any} func 関数を実行し、戻り値を配列に追加します。
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...key_T[], value_T]) => T): T[];
	/**
	 * @description 自分自身をトラバースし、トラバース結果の1次元配列を返す。
	 * @param {(value,key?):any} func 関数を実行し、戻り値を配列に追加します。
	 */
	/*@__PURE__*/map<T>(func: (value: value_T, key?: key_T) => T): T[];
	/**
	 * @description 要素を配列として自分自身に追加する。
	 * @param {[undefined|[key_T,value_T]]} array 追加する配列。
	 */
	/*@__PURE__*/push(array: [undefined | [key_T, value_T]]): void;
}

/**
 * ベースsstpメッセージクラス
 * @example
 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.base_sstp_info_t
 */
declare class base_sstp_info_t<key_T = PropertyKey, value_T = any> extends info_object<key_T, value_T> {
	/**
	 * 分割された文字列やオブジェクト・メッセージから sstp_info_t を構築することは推奨されない。
	 * @param {String} info_head メッセージのヘッダー。
	 * @param {Object} info_body オブジェクト形式のメッセージ本文。
	 * @param {Array<String>|undefined} unknown_lines 未知の行の配列。
	 * @see {@link sstp_info_t.constructor}
	 * @ignore
	 */
	/*@__PURE__*/constructor(info_head: String, info_body: Object, unknown_lines?: String[]);
	/**
	 * 未知の行の配列を取得する
	 * @returns {Array<String>} 未知の行の配列
	 */
	/*@__PURE__*/get unknown_lines(): Array<String>;
	/**
	 * メッセージのヘッダを取得する
	 * @returns {String}メッセージヘッダ
	 */
	/*@__PURE__*/get head(): String;
	/**
	 * 文字列メッセージの取得
	 * @returns {String} 文字列メッセージ。
	 */
	/*@__PURE__*/get text_content(): String;
	/**
	 * `JSON.stringify` で使用するオブジェクトを取得する。
	 * @returns {Object} `JSON.stringify` で使用するオブジェクト。
	 * @example console.log(JSON.stringify(info));
	 * @ignore
	 */
	/*@__PURE__*/toJSON(): Object;
	/**
	 * ヘッダーのリターンコード (予期しない場合は `NaN`) を取得します。
	 * @returns {sstp_return_code_t} ヘッダのリターンコード (予期しない場合は `NaN`)
	 */
	/*@__PURE__*/get status_code(): sstp_return_code_t;
	/**
	 * その他のメッセージメンバー
	 * @type {any|undefined}
	 */
	[key: string]: any | undefined;
}

/**
 * SSTPメッセージクラス
 * @example
 * let info = new jsstp.sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
 * console.log(info.head);//SSTP/1.4 200 OK
 * console.log(info.Option);//notranslate
 * @alias jsstp.sstp_info_t
 */
declare class sstp_info_t extends base_sstp_info_t<string, string> {
	/**
	 * 文字列から sstp_info_t を構築する
	 * @param {String} str メッセージ文字列
	 * @returns {sstp_info_t} 構築された sstp_info_t
	 * @example
	 * let info = new sstp_info_t("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 */
	/*@__PURE__*/constructor(str: String);
	/**
	 * PassThruの値を取得する
	 * @param {String} key 取得するPassThruの名前。
	 * @returns {String|undefined} PassThruの値。
	 */
	/*@__PURE__*/get_passthrough(key: String): String | undefined;
	/**
	 * すべてのPassThruを取得する
	 * @returns {info_object} すべてのパススルー
	 */
	/*@__PURE__*/get passthroughs(): info_object;
	/**
	 * 元のオブジェクトの取得
	 * @returns {sstp_info_t} 原物
	 */
	/*@__PURE__*/get raw(): sstp_info_t;

	/**
	 * その他のメッセージメンバー
	 * @type {String|undefined}
	 */
	[key: string]: String | undefined;
}

/**
 * fmoメッセージクラス：単一のfmo情報クラス  
 * 単一のゴーストの全てのfmo情報を記録します。
 * @example
 * info_object {
 * 	path: 'E:\\ssp\\',
 * 	hwnd: '918820',
 * 	name: '橘花',
 * 	keroname: '斗和',
 * 	'sakura.surface': '-1',
 * 	'kero.surface': '-1',
 * 	kerohwnd: '67008',
 * 	hwndlist: '918820,67008',
 * 	ghostpath: 'E:\\ssp\\ghost\\Taromati2\\',
 * 	fullname: 'Taromati2',
 * 	modulestate: 'shiori:running'
 * }
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare interface single_fmo_info_t extends info_object<string, string> {
	/**
	 * @description 実行中のベースウェアのルートフォルダへのフルパス
	 * @example E:\ssp\
	 */
	path: string;
	/**
	 * @description \0側のウィンドウハンドル
	 * @example 918820
	 */
	hwnd: string;
	/**
	 * @description descript.txtのsakura.name
	 * @example 橘花
	 */
	name: string;
	/**
	 * @description descript.txtのkero.name
	 * @example 斗和
	 */
	keroname: string;
	/**
	 * @description \0側に表示されているサーフェスID
	 * @example 0
	 */
	"sakura.surface": string;
	/**
	 * @description \1側に表示されているサーフェスID
	 * @example 10
	 */
	"kero.surface": string;
	/**
	 * @description \1側のウィンドウのハンドル
	 * @example 67008
	 */
	kerohwnd: string;
	/**
	 * @description 現在使用されているウィンドウハンドルのカンマ区切りリスト
	 * @example 918820,67008
	 */
	hwndlist: string;
	/**
	 * @description 実行中のゴーストへのフルパス
	 * @example E:\ssp\ghost\Taromati2\
	 */
	ghostpath: string;
	/**
	 * @description 実行中のゴーストのdescript.txtの名前
	 * @example Taromati2
	 */
	fullname: string;
	/**
	 * @description 実行中のゴーストのモジュール状態
	 * @example shiori:running,makoto-ghost:running
	 */
	modulestate: string;
}
/**
 * FMOメッセージクラス
 * @example
 * let fmo = jsstp.get_fmo_infos();
 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
 * if(kikka_uuid)
 * 	console.log(fmo[kikka_uuid].ghostpath);
 * @alias jsstp.fmo_info_t
 * @see {@link jsstp_t.get_fmo_infos}
 * @see {@link https://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
 */
declare class fmo_info_t extends base_sstp_info_t<string, single_fmo_info_t> {
	/**
	 * 分割された文字列メッセージまたはオブジェクト・メッセージから fmo_info_t を構築する
	 * @param {String} fmo_text
	 * @returns {void}
	 */
	/*@__PURE__*/constructor(fmo_text: String);
	/**
	 * @param {String} name チェックするプロパティの名前
	 * @param {String} value 望ましい属性値
	 * @returns {String|undefined} 対応するuuid（もしあれば）
	 * @description 指定された属性を持ち、その属性の値が指定された値であるfmoのuuidを取得する。
	 * @example
	 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
	 * @description `this.uuids.find(uuid => this[uuid][name] == value)`に相当する。
	 */
	/*@__PURE__*/get_uuid_by(name: String, value: String): String | undefined;
	/**
	 * @param {String} name
	 * @returns {Array<String>}
	 * @description 指定されたすべてのプロパティの値を取得する
	 * @example
	 * let ghost_list = fmo_info.get_list_of("name");
	 * @description `this.uuids.map(uuid=>this[uuid][name])`に相当する。
	 */
	/*@__PURE__*/get_list_of(name: String): Array<String>;
	/**
	 * @description すべてのuuidsを取得する
	 */
	/*@__PURE__*/get uuids(): Array<String>;
	/**
	 * @description fmoが有効かどうかの判断
	 */
	/*@__PURE__*/get available(): Boolean;
	/**
	 * fmoメンバー
	 * @type {single_fmo_info_t|undefined}
	 */
	[uuid: string]: single_fmo_info_t | undefined;
}

/**
 * listメッセージオブジェクト
 * @example
 * let list = jsstp.GetNames();
 * for(let name of list)
 * 	console.log(name);
 * @alias jsstp.list_info_t
 */
declare class list_info_t extends base_sstp_info_t<number, string> {
	/**
	 * 自己文字列構造 list_info_t
	 * @param {String} list_text
	 */
	/*@__PURE__*/constructor(list_text: String)
	/**
	 * 値の文字列形式を取得します
	 * @returns {String} 値の文字列形式、`${this.values}`と同様
	 * @summary これは文字列メッセージを取得するメソッドではありません。文字列メッセージを取得するには、{@link list_info_t.text_content}を使用してください
	 * @ignore
	 */
	/*@__PURE__*/toString(): String
	/**
	 * イテレータ取得
	 * @returns {Iterator<Array<String>>} イテレータ
	 */
	/*@__PURE__*/[Symbol.iterator](): Iterator<Array<String>>
	/**
	 * 配列メンバ
	 * @type {string|undefined}
	 */
	[key: number]: string | undefined;
}

/**
 * sstp メソッド呼び出し元
 * @group callers
 */
interface method_caller<T = sstp_info_t, Rest extends any[] = [Object]> {
	(...args: Rest): Promise<T>;
	get_raw(...args: Rest): Promise<String>;
	with_type<nT>(result_type: new (str: string) => nT): method_caller<nT, Rest>;
	bind_args_processor<nRest extends any[]>(processor: (...args: Rest) => Object): method_caller<T, nRest>;
}

/**
 * 指定されたキー値へのメンバーアクセスによって拡張できる拡張呼び出し元
 * @group callers
 */
interface base_keyed_method_caller<T = sstp_info_t, Rest extends any[] = [Object]> extends method_caller<T, Rest> {
	/**
	 * 拡張呼び出し元
	 */
	[uuid: string]: base_keyed_method_caller<T, Rest>
}
/**
 * 呼び出しパラメータを簡単に扱うための拡張可能な呼び出し元
 * @group callers
 */
interface simple_keyed_method_caller<result_T> extends base_keyed_method_caller<result_T, any[]> {
	/**
	 * 拡張呼び出し元
	 */
	[uuid: string]: simple_keyed_method_caller<result_T>
}
/**
 * 単純なイベント呼び出し元  
 * イベントをトリガーするために直接呼び出される！
 * @example
 * let data=await jsstp.OnTest(123,"abc");
 * //以下に相当する。
 * let data = await jsstp.SEND({
 * 	"Event": "OnTest",
 * 	"Reference0": 123,
 * 	"Reference1": "abc"
 * });
 * @group callers
 */
interface simple_event_caller extends simple_keyed_method_caller<sstp_info_t> {
	/**
	 * 拡張呼び出し元
	 */
	[uuid: string]: simple_event_caller
}
/**
 * シンプルなコマンド呼び出し元
 * @example
 * let data=await jsstp.SetCookie("abc","def");
 * //以下に相当する。
 * let data = await jsstp.SEND({
 * 	"Command": "SetCookie",
 * 	"Reference0": "abc",
 * 	"Reference1": "def"
 * });
 * @group callers
 */
interface simple_command_caller extends simple_keyed_method_caller<sstp_info_t> {
	/**
	 * 拡張呼び出し元
	 */
	[uuid: string]: simple_command_caller
}
/**
 * パラメータを簡単に処理できるリスト戻り値コマンド実行
 * @example
 * let data=await jsstp.GetNames();
 * //以下に相当する。
 * let data = await jsstp.SEND({
 * 	"Command": "GetNames"
 * });
 * @group callers
 */
interface simple_list_command_caller extends simple_keyed_method_caller<list_info_t> {
	/**
	 * 拡張呼び出し元
	 */
	[uuid: string]: simple_list_command_caller
}

/**
 * link jsstp_t} よりも ghost_info 属性が1つ多い。  
 * 特定のゴーストにメッセージを送るには {@link jsstp_t.default_info} の `ReceiverGhostHWnd` に依存する。
 * @see {@link jsstp_with_ghost_info_t.ghost_info}
 */
interface jsstp_with_ghost_info_t extends jsstp_t {
	/**
	 * このjsstp_tのインスタンスが指すゴーストに関する情報
	 */
	ghost_info: single_fmo_info_t
}
/**
 * jsstpオブジェクト
 * @see {@link jsstp}
 * @alias jsstp.type
 * @example
 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
 */
declare class jsstp_t {
	/**
	 * @group Types
	 */
	type: typeof jsstp_t;
	/**
	 * @group Types
	 */
	base_sstp_info_t: typeof base_sstp_info_t;
	/**
	 * @group Types
	 */
	sstp_info_t: typeof sstp_info_t;
	/**
	 * @group Types
	 */
	fmo_info_t: typeof fmo_info_t;
	/**
	 * @group Types
	 */
	list_info_t: typeof list_info_t;
	/**
	 * @group Types
	 */
	ghost_events_queryer_t: typeof ghost_events_queryer_t;

	/**
	 * @group SSTP Base Methods
	*/
	SEND: method_caller<sstp_info_t, [common_event_sstp_content_t]>;
	/**
	 * @group SSTP Base Methods
	*/
	NOTIFY: method_caller<sstp_info_t, [common_event_sstp_content_t]>;
	/**
	 * @group SSTP Base Methods
	*/
	COMMUNICATE: method_caller<sstp_info_t, [common_communicate_sstp_content_t]>;
	/**
	 * @group SSTP Base Methods
	*/
	EXECUTE: method_caller<sstp_info_t, [common_execute_sstp_content_t]>;
	/**
	 * @group SSTP Base Methods
	*/
	GIVE: method_caller<sstp_info_t, [common_give_sstp_content_t]>;

	/**
	 * イベント名をマッチさせて単純な呼び出し元を生成する
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.OnTest(123,"abc");
	 */
	[key: `On${string}`]: simple_event_caller;
	/**
	 * イベント名をマッチさせて単純な呼び出し元を生成する
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.GetNames();
	 */
	[key: `Get${string}`]: simple_list_command_caller;
	/**
	 * イベント名をマッチさせて単純な呼び出し元を生成する
	 * @group Index reflections
	 * @example
	 * let data=await jsstp.SetCookie("abc","def");
	 */
	[key: `Set${string}`]: simple_command_caller;

	/**
	 * fecth のヘッダ
	 */
	RequestHeader: {
		[key: string]: string,
	};
	/**
	 * デフォルトのメッセージ内容
	 */
	default_info: base_sstp_content_t;

	/**
	 * SSTP プロトコルバージョン番号リスト
	 */
	sstp_version_table: {
		[method: string]: Number
	};
	/**
	 * デフォルトのセキュリティレベルを問い合わせます。nodejsでは "local"、ブラウザでは "external "です。
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;

	/**
	 * セルププロキシ
	 */
	proxy: jsstp_t;

	/**
	 * 基本的なjsstpオブジェクト
	 * @param {String} sender_name オブジェクトがサーバーとやりとりする際の送信者名
	 * @param {String} host 宛先サーバーアドレス
	 * @returns {jsstp_t}
	 */
	/*@__PURE__*/constructor(sender_name?: String, host?: String);
	/**
	 * ホストの変更
	 * @param {string} host
	 * @group Properties
	 */
	set host(host: string);
	/*@__PURE__*/get host(): string;
	/**
	 * 送信者名を変更する
	 * @param {String} sender_name
	 * @group Properties
	 */
	set sendername(sender_name: String);
	/*@__PURE__*/get sendername(): String;

	/**
	 * 新しいjsstpオブジェクトをコピーする
	 * @group Clone Methods
	 */
	get clone(): jsstp_t;

	/**
	 * 与えられたfmo_infoに対して新しいjsstpオブジェクトをコピーする。
	 * @param fmo_info ターゲットゴーストのfm_info
	 * @returns {jsstp_t} ターゲットゴーストを指す新しいjsstpオブジェクト
	 * @group Clone Methods
	 */
	by_fmo_info(fmo_info: single_fmo_info_t): jsstp_with_ghost_info_t;

	/**
	 * すべてのゴーストのfmoinfoを処理する
	 * @param {Function|undefined} operation 操作関数
	 */
	for_all_ghost_infos<result_T>(operation: (fmo_info: single_fmo_info_t) => result_T): Promise<info_object<string, result_T>>;
	/**
	 * すべてのゴースト・オペレーション
	 * @param {Function|undefined} operation 操作関数
	 */
	for_all_ghosts<result_T>(operation: (jsstp: jsstp_with_ghost_info_t) => result_T): Promise<info_object<string, result_T>>;

	/**
	 * テキストでメッセージを送信し、テキストでそれを受信する
	 * @param {any} info メッセージ本文 (テキスト)
	 * @returns {Promise<String>} プロミスを返します。
	 * @group Basic Send Methods
	 */
	row_send(info: any): Promise<String>;
	/**
	 * メッセージを送信するが、返された結果は処理しない。  
	 * メッセージのヘッダー。
	 * @param {Object} info メッセージのボディ。
	 * @returns {Promise<String>} プロミスを返します。
	 * @group Basic Send Methods
	 */
	costom_text_send(sstphead: String, info: Object): Promise<String>;
	/**
	 * @returns {Promise<sstp_info_t>} プロミスを返します。  
	 * メッセージの送信
	 * @param {String} sstphead メッセージヘッダ
	 * @param {Object} info メッセージボディ
	 * @param {new (info: String)=> result_type} result_type 返される結果の型、デフォルトは sstp_info_t
	 * @group Basic Send Methods
	 */
	costom_send<T>(sstphead: String, info: Object, result_type: new (str: string) => T): Promise<T>;

	/**
	 * 指定したメソッドの呼び出し元を取得する
	 * @param {String} method_name メソッド名
	 * @param {new (info: String) => result_type} [result_type=sstp_info_t] 返される結果の型、デフォルトは sstp_info_t
	 * @param {Function} [args_processor=info => info] パラメータプロセッサ、デフォルトは入力パラメータを直接返す
	 * @returns {method_caller} 呼び出し元
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_method<T = sstp_info_t, Rest extends any[] = [Object], Res = Object>(
		method_name: String, result_type?: new (str: string) => T, args_processor?: (...args: Rest) => Res
	): method_caller<T, Rest>;
	/**
	 * 指定したキーの呼び出し元を取得
	 * @param {String} key_name key名
	 * @param {String} value_name value名
	 * @param {Function} method_caller メソッド呼び出し元
	 * @param {Function} args_processor パラメータプロセッサ
	 * @returns {Proxy<value>} 呼び出し元
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_caller_of_key<T = sstp_info_t, Rest extends any[] = [Object], Res = Object>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T, [Res]>,
		args_processor?: (...args: Rest) => Res
	): base_keyed_method_caller<T, Rest>;

	/**
	 * 指定されたキーを取得するシンプルな呼び出し元
	 * @param {String} key_name key名
	 * @param {String} value_name value名
	 * @param {Function} method_caller メソッド呼び出し元
	 * @returns {Proxy<value>} 呼び出し元
	 * @group Caller Methods
	 */
	/*@__PURE__*/get_simple_caller_of_key<T = sstp_info_t>(
		key_name: String, value_name: String,
		method_caller?: method_caller<T, [Object]>,
	): simple_keyed_method_caller<T>;
	/**
	 * 単純な呼び出し元が指定されたイベントを取得するためのプロキシ
	 * @returns {Proxy}
	 * @example
	 * jsstp.event.OnTest("test");
	 * @group Indexer Members
	 */
	/*@__PURE__*/get event(): {
		[event_name: string]: simple_event_caller
	}
	/**
	 * 指定されたコマンドの実行者を取得するエージェント
	 * @returns {Proxy}
	 * @example
	 * jsstp.command.GetFMO();
	 * @group Indexer Members
	 */
	/*@__PURE__*/get command(): {
		[command_name: string]: simple_command_caller
	}
	/**
	 * イベントが存在するかどうかを判断する  
	 * {@link ghost_events_queryer_t}（{@link jsstp_t.new_event_queryer}で取得）を使って、頻繁に呼び出されそうかどうかを問い合わせる。
	 * @param {String} event_name イベント名
	 * @param {security_level_t} security_level セキュリティレベル
	 * @returns {Promise<Boolean>} 存在するかどうかを返します。
	 * @example
	 * jsstp.has_event("OnTest").then(result => console.log(result));
	 * @example
	 * //サンプルコード(AYA):
	 * SHIORI_EV.On_Has_Event : void {
	 * 	_event_name=reference.raw[0]
	 * 	_SecurityLevel=reference.raw[1]
	 * 	if !_SecurityLevel
	 * 		_SecurityLevel=SHIORI_FW.SecurityLevel
	 * 	if SUBSTR(_event_name,0,2) != 'On'
	 * 		_event_name='On_'+_event_name
	 * 	_result=0
	 * 	if TOLOWER(_SecurityLevel) == 'external'
	 * 		_event_name='ExternalEvent.'+_event_name
	 * 	_result=ISFUNC(_event_name)
	 * 	if !_result
	 * 		_result=ISFUNC('SHIORI_EV.'+_event_name)
	 * 	SHIORI_FW.Make_X_SSTP_PassThru('Result',_result)
	 * }
	 * SHIORI_EV.ExternalEvent.On_Has_Event{
	 * 	SHIORI_EV.On_Has_Event
	 * }
	 */
	/*@__PURE__*/has_event(event_name: String, security_level?: security_level_t): Promise<Boolean>;
	/**
	 * サポートされているイベントを合意された構造で取得するには、ゴーストが `Get_Supported_Events` イベントをサポートしている必要があります。  
	 * ゴーストのサポートが不明な場合は、{@link ghost_events_queryer_t}（{@link jsstp_t.new_event_queryer}で取得）を使用してクエリを実行する。
	 * @returns {Promise<{local:string[],external:string[]}>}ローカル配列と外部配列を含むオブジェクト。
	 * @example
	 * jsstp.get_supported_events().then(result => console.log(result));
	 * @example
	 * //サンプルコード(AYA):
	 * SHIORI_EV.On_Get_Supported_Events: void {
	 * 	_L=GETFUNCLIST('On')
	 * 	_base_local_event_funcs=IARRAY
	 * 	foreach _L;_func{
	 * 		if SUBSTR(_func,2,1) == '_'
	 * 			_func=SUBSTR(_func,3,STRLEN(_func))
	 * 		_base_local_event_funcs,=_func
	 * 	}
	 * 	_L=GETFUNCLIST('SHIORI_EV.On')
	 * 	foreach _L;_func{
	 * 		if SUBSTR(_func,12,1) == '_'
	 * 			_func=SUBSTR(_func,13,STRLEN(_func))
	 * 		_base_local_event_funcs,=_func
	 * 	}
	 * 	SHIORI_FW.Make_X_SSTP_PassThru('local',ARRAYDEDUP(_base_local_event_funcs))
	 * 	_L=GETFUNCLIST('ExternalEvent.On')
	 * 	_base_external_event_funcs=IARRAY
	 * 	foreach _L;_func{
	 * 		if SUBSTR(_func,16,1) == '_'
	 * 			_func=SUBSTR(_func,17,STRLEN(_func))
	 * 		_base_external_event_funcs,=_func
	 * 	}
	 * 	_L=GETFUNCLIST('SHIORI_EV.ExternalEvent.On')
	 * 	foreach _L;_func{
	 * 		if SUBSTR(_func,26,1) == '_'
	 * 			_func=SUBSTR(_func,27,STRLEN(_func))
	 * 		_base_external_event_funcs,=_func
	 * 	}
	 * 	SHIORI_FW.Make_X_SSTP_PassThru('external',ARRAYDEDUP(_base_external_event_funcs))
	 * }
	 * SHIORI_EV.ExternalEvent.On_Get_Supported_Events{
	 * 	SHIORI_EV.On_Get_Supported_Events
	 * }
	 */
	/*@__PURE__*/get_supported_events(): Promise<{
		local: string[],
		external: string[]
	}>;
	/**
	 * fmo情報を入手
	 * @returns {Promise<fmo_info_t>} fmo情報
	 * @example
	 * let fmo=await jsstp.get_fmo_infos();
	 * if(fmo.available)
	 * 	console.log(fmo);
	 */
	/*@__PURE__*/get_fmo_infos(): Promise<fmo_info_t>;
	/**
	 * 現在のホストの稼働状況を取得する
	 * @returns {Promise<Boolean>} ゴーストが利用可能かどうかのステータス
	 * @example
	 * if(await jsstp.available())
	 * 	//do something
	 * else
	 * 	console.error("ゴーストが利用できません。ゴーストが起動しているか確認してください。");
	 */
	/*@__PURE__*/available(): Promise<Boolean>;
	/**
	 * 現在のホストの稼働状況を取得する
	 * @param {(jsstp:jsstp_t)=>any} resolve ゴーストがいるときに実行される機能
	 * @returns {Promise<any>} ゴーストが利用可能ならjsstpで解決し、そうでなければ拒否する。
	 * @example
	 * jsstp.if_available(() => {
	 * 	//do something
	 * });
	 * @example
	 * xxx.then(v => jsstp.if_available()).then(() => {
	 * 	//do something
	 * });
	 * @group PromiseLike Methods
	 */
	/*@__PURE__*/if_available<result_T = undefined>(resolve: (value?: jsstp_t) => result_T): Promise<result_T>;
	/**
	 * ghostがサポートするイベントのクエリーを取得する
	 * @returns {Promise<ghost_events_queryer_t>} イベントをサポートするクエリへの問い合わせ
	 * @example
	 * jsstp.new_event_queryer().then(queryer => 
	 * 	queryer.check_event("OnTest").then(result =>
	 * 		console.log(result)
	 * 	)
	 * );
	 */
	/*@__PURE__*/new_event_queryer(): Promise<ghost_events_queryer_t>;
}

/**
 * ゴースト・イベント・ファインダー
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("現在、ゴーストはイベントクエリをサポートしていません。");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
declare class ghost_events_queryer_t extends ExtensibleFunction<[string, security_level_t], Promise<Boolean>> {
	/**
	 * イベントクエリアの構築
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/constructor(base_jsstp: jsstp_t);
	/**
	 * デフォルトのセキュリティレベルを問い合わせます。nodejsでは "local"、ブラウザでは "external"です。
	 * @see {@link https://www.google.com/search?q=site%3Assp.shillest.net%2Fukadoc%2F+SecurityLevel}
	 */
	default_security_level: security_level_t;
	/**
	 * イベントの存在をチェックするには、ゴーストは少なくとも `Has_Event` イベントをサポートしている必要があり、`Get_Supported_Events` イベントを提供することでより効率的にすることができる。
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer.check_event("On_connect");
	 * @see {@link jsstp_t.has_event} と {@link jsstp_t.get_supported_events} に基づいています。
	 */
	/*@__PURE__*/check_event(event_name: String, security_level?: security_level_t): Promise<Boolean>;
	/**
	 * イベントをチェックできるかどうかを確認する
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.available)
	 * 	console.error("イベントをチェックできない");
	 */
	/*@__PURE__*/get available(): Boolean;
	/**
	 * `Get_Supported_Events`を使用して、サポートされているイベントのリストを素早く取得できるかどうかを確認する。
	 * @returns {Promise<Boolean>}
	 * @example
	 * if(!ghost_events_queryer.fast_query_available)
	 * 	console.info("サポートされているイベントのリストを素早く取得できない");
	 * else
	 * 	console.info("そうだね！");
	 * @description サポートされていない場合は、動作が遅くなるだけで、`check_event`はまだ機能する。
	 */
	/*@__PURE__*/get fast_query_available(): Boolean;
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	reset(): Promise<ghost_events_queryer_t>;
	/**
	 * @returns {Promise<ghost_events_queryer_t>} this
	 */
	init(): Promise<ghost_events_queryer_t>;
	clear(): void;
}
/**
 * ゴースト・イベント・ファインダー
 * @example
 * let ghost_events_queryer = jsstp.new_event_queryer();
 * if(!ghost_events_queryer.available)
 * 	console.log("現在、ゴーストはイベントクエリをサポートしていません。");
 * if(ghost_events_queryer.has_event("OnBoom"))
 * 	jsstp.OnBoom();
 * @alias jsstp.ghost_events_queryer_t
 * @see {@link jsstp_t.new_event_queryer}
 */
interface ghost_events_queryer_t {
	/**
	 * イベントクエリアの構築
	 * @param {jsstp_t} base_jsstp
	 */
	/*@__PURE__*/new(base_jsstp: jsstp_t): ghost_events_queryer_t;
	/**
	 * 宣言の呼び出し  
	 * ゴーストには少なくとも `Has_Event` イベントサポートが必要で、 `Get_Supported_Events` イベントを提供することでより効率的にすることができる。
	 * @param {String} event_name
	 * @param {security_level_t} security_level
	 * @returns {Promise<Boolean>}
	 * @example
	 * let result = await ghost_events_queryer("On_connect");
	 * @see {@link ghost_events_queryer_t_class.check_event} に基づく。
	 */
	/*@__PURE__*/(event_name: String, security_level?: security_level_t): Promise<Boolean>;
}

/**
 * sstpラッパー
 * @example
 * jsstp.SEND({
 * 	Event: "OnTest",
 * 	Script: "\\s[0]Hell Wold!\\e"
 * });
 * @var jsstp
 * @type {jsstp_t}
 * @global
 */
declare var jsstp: jsstp_t;

export { base_sstp_info_t, jsstp as default, fmo_info_t, ghost_events_queryer_t, jsstp, jsstp_t, list_info_t, sstp_info_t };
