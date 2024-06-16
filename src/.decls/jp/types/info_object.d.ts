/**
 * オブジェクトを拡張して、いくつかの簡単な反復操作を提供する。
 */
declare class info_object<key_T = PropertyKey, value_T = any> {
	/**
	 * すべてのキーの配列を取得する
	 */
	/*@__PURE__*/get keys(): key_T[];
	/**
	 * すべての値の配列を取得する
	 */
	/*@__PURE__*/get values(): value_T[];
	/**
	 * すべてのキーと値のペアの配列を取得します。
	 */
	/*@__PURE__*/get entries(): [key_T, value_T][];
	/**
	 * 会員数の取得
	 */
	/*@__PURE__*/get length(): number;
	/**
	 * キーと値のペアごとに関数を実行する。
	 * @param {(value,key?)} func 戻り値が未定義でない場合に、元の値を置き換えるために実行される関数。
	 */
	/*@__PURE__*/forEach(func: (value: value_T, key?: key_T) => value_T | undefined): void;
	/**
	 * 新しいオブジェクトをコピーします。
	 * @returns {info_object} コピーされたオブジェクト
	 */
	/*@__PURE__*/get trivial_clone(): info_object<key_T, value_T>;
	/**
	 * 自分自身とその子をトラバースし、トラバース結果の1次元配列を返す。
	 * @param {(dimensions[...] ,value):any} func 関数を実行し、戻り値を配列に追加します。
	 */
	/*@__PURE__*/flat_map<T>(func: (...dimensions_with_value_in_last: [...key_T[], value_T]) => T): T[];
	/**
	 * 自分自身をトラバースし、トラバース結果の1次元配列を返す。
	 * @param {(value,key?):any} func 関数を実行し、戻り値を配列に追加します。
	 */
	/*@__PURE__*/map<T>(func: (value: value_T, key?: key_T) => T): T[];
	/**
	 * 要素を配列として自分自身に追加する。
	 * @param {[undefined|[key_T,value_T]]} array 追加する配列。
	 */
	/*@__PURE__*/push(array: [undefined | [key_T, value_T]]): void;
}
/**
 * 新しい info_object を生成する
 * @returns {info_object} 生成されたオブジェクト
 * @ignore
 */
declare function new_object<key_T = PropertyKey, value_T = any>(): info_object<key_T, value_T>;
export { new_object as default, info_object };
