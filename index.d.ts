// Type definitions for ./index.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// logger.!1

/**
 * 
 */
declare interface Options {

	/**
	 * 
	 */
	print: boolean;

	/**
	 * 
	 */
	record: boolean;

	/**
	 * 
	 */
	level: Array<string>;
}

/**
 * 
 */
declare namespace styles {

	/**
	 * 
	 */
	export var bold: Array<string>;

	/**
	 * 
	 */
	export var italic: Array<string>;

	/**
	 * 
	 */
	export var underline: Array<string>;

	/**
	 * 
	 */
	export var inverse: Array<string>;

	/**
	 * 
	 */
	export var strikethrough: Array<string>;

	/**
	 * 
	 */
	export var white: Array<string>;

	/**
	 * 
	 */
	export var grey: Array<string>;

	/**
	 * 
	 */
	export var black: Array<string>;

	/**
	 * 
	 */
	export var blue: Array<string>;

	/**
	 * 
	 */
	export var cyan: Array<string>;

	/**
	 * 
	 */
	export var green: Array<string>;

	/**
	 * 
	 */
	export var magenta: Array<string>;

	/**
	 * 
	 */
	export var red: Array<string>;

	/**
	 * 
	 */
	export var yellow: Array<string>;

	/**
	 * 
	 */
	export var whiteBG: Array<string>;

	/**
	 * 
	 */
	export var greyBG: Array<string>;

	/**
	 * 
	 */
	export var blackBG: Array<string>;

	/**
	 * 
	 */
	export var blueBG: Array<string>;

	/**
	 * 
	 */
	export var cyanBG: Array<string>;

	/**
	 * 
	 */
	export var greenBG: Array<string>;

	/**
	 * 
	 */
	export var magentaBG: Array<string>;

	/**
	 * 
	 */
	export var redBG: Array<string>;

	/**
	 * 
	 */
	export var yellowBG: Array<string>;
}

/**
 * @param {any} type
 * @param {any} args
 * @returns
 * @param type 
 * @param args 
 * @return  
 */
declare function format(type: string, args: any): any[];

/**
 * @param {any} type
 * @param {any} css
 * @param {any} args
 * @returns
 * @param type 
 * @param css 
 * @param args 
 */
declare function show(type: string, css: string, args: any): Promise<any>;

/**
 * eslint-disable func-style
 * @param type 
 * @param options 
 * @param args 
 */
declare function logger(type: string, options: Options, args: any): void;

/**
 * 
 */
declare namespace logger {

	/**
	 * write log file
	 * 
	 * @param {any} path
	 * @param {any} name
	 * @param {any} msgs
	 * @param path 
	 * @param name 
	 * @param msgs 
	 */
	function write(path: string, name: string, msgs: any): Promise<any>;

	/**
	 * @param {string} type
	 * @param {string} css
	 * @param {any} args
	 * @returns
	 * @param type 
	 * @param css 
	 * @param args 
	 */
	function custom(type: string, css: string, args: any): void;

	/**
	 * log debug trace
	 * 
	 * @returns
	 */
	function debug(...args: string[]): void;

	/**
	 * log info
	 * 
	 * @returns
	 */
	function info(...args: string[]): void;

	/**
	 * log sucess info
	 * 
	 * @returns
	 */
	function success(...args: string[]): void;

	/**
	 * log warnning
	 * 
	 * @returns
	 */
	function warn(...args: string[]): void;

	/**
	 * log error
	 * 
	 * @returns
	 */
	function error(...args: string[]): void;
}

export = logger;