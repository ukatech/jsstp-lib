/**
 * より読みやすい派生クラスの関数型で初期化できる拡張可能な関数型。
 */
declare class ExtensibleFunction<args_T extends Array<any>,return_T> extends Function {
	/**
	 * 自己関数のインスタンス初期化
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	constructor(func: (...args: args_T) => return_T);
	/**
	 * 関数を呼び出し、関数の this 値を指定されたオブジェクトに、関数の引数を指定された配列に置き換えます。
	 * @param thisArg thisオブジェクトとして使用されるオブジェクト。
	 * @param argArray 関数に渡される引数のセット。
	 */
	apply(thisArg: (...args: args_T) => return_T, argArray?: args_T): return_T;

	/**
	 * 現在のオブジェクトを別のオブジェクトに置き換えるオブジェクトのメソッドを呼び出します。
	 * @param thisArg 現在のオブジェクトとして使用されるオブジェクト。
	 * @param argArray メソッドに渡される引数のリスト。
	 */
	call(thisArg: (...args: args_T) => return_T, ...argArray: args_T): return_T;

	/**
	 * 与えられた関数に対して、元の関数と同じボディを持つ束縛関数を作成します。
	 * バインドされた関数の this オブジェクトは、指定されたオブジェクトに関連付けられ、指定された初期引数を持ちます。
	 * @param thisArg 新しい関数内で this キーワードが参照できるオブジェクト。
	 * @param argArray 新しい関数に渡される引数のリスト。
	 */
	bind(thisArg: (...args: args_T) => return_T, ...argArray: any): (...args: args_T) => return_T;
}

export{ ExtensibleFunction };
