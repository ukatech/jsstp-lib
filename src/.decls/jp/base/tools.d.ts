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

export {
	ExtensibleFunction, security_level_t, sstp_return_code_t,
	base_sstp_content_t,
	common_event_sstp_content_t,
	common_communicate_sstp_content_t,
	common_give_sstp_content_t,
	common_execute_sstp_content_t
};
