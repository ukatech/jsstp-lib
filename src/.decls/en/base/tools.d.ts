/**
 * An extensible function type that can be initialised with a function for the more readable derived class function type
 */
declare class ExtensibleFunction<args_T extends Array<any>,return_T> extends Function {
	/**
	 * Initialising from a function instance  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
	 * @param {Function} func
	 * @returns {ExtensibleFunction}
	 */
	constructor(func: (...args: args_T) => return_T);
	/**
	 * Calls a function and replaces the function's this value with the specified object and the function's arguments with the specified array.  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
	 * @param thisArg The object that will be used as the this object.
	 * @param argArray A set of arguments to be passed to the function.
	 */
	apply(thisArg: (...args: args_T) => return_T, argArray?: args_T): return_T;

	/**
	 * Calls a method on an object that replaces the current object with another object.  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
	 * @param thisArg The object that will be used as the current object.
	 * @param argArray The list of arguments to be passed to the method.
	 */
	call(thisArg: (...args: args_T) => return_T, ...argArray: args_T): return_T;

	/**
	 * For a given function, creates a bound function with the same body as the original function.  
	 * The this object of the bound function is associated with the specified object and has the specified initial argument.  
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
	 * @param thisArg An object that the this keyword can refer to in the new function.
	 * @param argArray A list of arguments to be passed to the new function.
	 */
	bind(thisArg: (...args: args_T) => return_T, ...argArray: any): (...args: args_T) => return_T;

	/**
	 * Function's name.
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
	 */
	readonly name: string;

	/**
	 * The number of arguments expected by the function.
	 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)
	 */
	readonly length: number;
}
/**
 * Security levels in ghost interactions
 */
type security_level_t = "local" | "external";

export{ ExtensibleFunction, security_level_t };
