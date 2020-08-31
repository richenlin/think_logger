// https://en.wikipedia.org/wiki/ANSI_escape_code

const fs = require('fs');
const os = require('os');
const util = require('util');
const lib = require('think_lib');

const styles = {
    'bold': ['\x1B[1m', '\x1B[22m'],
    'italic': ['\x1B[3m', '\x1B[23m'],
    'underline': ['\x1B[4m', '\x1B[24m'],
    'inverse': ['\x1B[7m', '\x1B[27m'],
    'strikethrough': ['\x1B[9m', '\x1B[29m'],

    'white': ['\x1B[37m', '\x1B[39m'],
    'grey': ['\x1B[90m', '\x1B[39m'],
    'black': ['\x1B[30m', '\x1B[39m'],
    'blue': ['\x1B[34m', '\x1B[39m'],
    'cyan': ['\x1B[36m', '\x1B[39m'],
    'green': ['\x1B[32m', '\x1B[39m'],
    'magenta': ['\x1B[35m', '\x1B[39m'],
    'red': ['\x1B[31m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'],

    'whiteBG': ['\x1B[47m', '\x1B[49m'],
    'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG': ['\x1B[40m', '\x1B[49m'],
    'blueBG': ['\x1B[44m', '\x1B[49m'],
    'cyanBG': ['\x1B[46m', '\x1B[49m'],
    'greenBG': ['\x1B[42m', '\x1B[49m'],
    'magentaBG': ['\x1B[45m', '\x1B[49m'],
    'redBG': ['\x1B[41m', '\x1B[49m'],
    'yellowBG': ['\x1B[43m', '\x1B[49m']
};
// console.log('\x1B[47m\x1B[30m%s\x1B[39m\x1B[49m', 'hello') //白底黑色字

const printConsole = process.env.NODE_ENV === 'development' ? true : false;
const writeFile = process.env.LOGS ? true : false;
const writeLevel = process.env.LOGS_LEVEL ? process.env.LOGS_LEVEL.split(',') : ['warn', 'error'];
const writePath = process.env.LOGS_PATH ? process.env.LOGS_PATH : os.tmpdir();

/**
 * 
 * 
 * @param {any} type 
 * @param {any} args 
 * @returns 
 */
const format = function (type, args) {
    try {
        let params = [];
        switch (typeof args) {
            case 'array':
                params = args;
                break;
            case 'string':
                params = [args];
                break;
            default:
                if (args.stack) {
                    params = [args.stack];
                } else {
                    params = [args];
                }
                break;
        }
        params = [`[${lib.datetime('', '')}]`, `[${type.toUpperCase()}]`, ...params];
        return params;
    } catch (e) {
        // console.error(e.stack);
        return [];
    }
};

/**
 * 
 * 
 * @param {any} type 
 * @param {any} css 
 * @param {any} args 
 * @returns 
 */
const show = function (type, css, args) {
    try {
        let params = [...args];
        css = css || 'grey';
        let style = styles[css] || styles.grey;
        style[0] && params.unshift(style[0]);
        style[1] && params.push(style[1]);
        console.log.apply(null, params);
        return null;
    } catch (e) {
        // console.error(e.stack);
        return null;
    }
};

/**
* write log file
*
* @param {*} fpath
* @param {*} name
* @param {*} msgs
* @param {boolean} [formated=false]
* @returns
*/
const write = function (fpath, name, msgs, formated = false) {
    try {
        if (fpath && msgs.length > 0) {
            const key = `LOGS_PATH_${fpath.replace(/[\/|\\\\|:]/g, '_')}`;
            if (!process.env[key]) {
                lib.isDir(fpath) || lib.mkDir(fpath);
                // !process.env.LOGS_PATH_EXISTS && (process.env.LOGS_PATH_EXISTS = {});
                process.env[key] = true;
            }
            let params = msgs;
            if (!formated) {
                params = format(name, msgs);
            }
            params = util.format.apply(null, params) + '\n';
            let file = `${fpath}${lib.sep}${name ? name + '_' : ''}${lib.datetime('', 'YYYY-MM-DD')}.log`;
            fs.appendFile(file, params, function () {
                fs.close(file, () => { });
            });
        }
        return null;
    } catch (e) {
        // console.error(e.stack);
        return null;
    }
};

/**
 * 
 * 
 * @param {any} type 
 * @param {object} options 
 * @param {any} args 
 * @returns 
 */
const print = function (type, options = {}, args) {
    try {
        options = Object.assign({
            print: printConsole,
            record: writeFile,
            level: writeLevel,
            path: writePath,
            css: 'white'
        }, options || {});
        args = format(type, args);

        // print console
        if (options.print) {
            show(type ? type.toUpperCase() : 'INFO', options.css || 'grey', args);
        }
        // record log files
        if (options.record && options.level.indexOf(type) > -1) {
            write(options.path, type, args, true);
        }
        return null;
    } catch (e) {
        // console.error(e.stack);
        return null;
    }
};

const logger = {
    /**
    * write log file
    *
    * @param {*} fpath
    * @param {*} name
    * @param {*} msgs
    * @param {boolean} [formated=false]
    * @returns
    */
    write: write,

    /**
     * custom logs
     * 
     * @param {any} type 
     * @param {any} css 
     * @param {any} args 
     * @returns 
     */
    custom(type, css, args) {
        return print(type, { css: css || 'gray', print: true }, args);
    },
    /**
     * log debug
     * 
     * @param {any} type 
     * @param {any} css 
     * @param {any} args 
     * @returns 
     */
    debug() {
        return print('debug', { css: 'white', print: true }, ...arguments);
    },
    /**
     * log info
     * 
     * @returns 
     */
    info() {
        //判断console.xxx是否被重写
        // ('prototype' in console.info) && console.info(message);
        return print('info', { css: 'blue', print: true }, ...arguments);
    },
    /**
     * log sucess info
     * 
     * @returns 
     */
    success() {
        //判断console.xxx是否被重写
        // ('prototype' in console.info) && console.info(message);
        return print('info', { css: 'green', print: true }, ...arguments);
    },
    /**
     * log warnning
     * 
     * @returns 
     */
    warn() {
        //判断console.xxx是否被重写
        // ('prototype' in console.info) && console.info(message);
        return print('warn', { css: 'yellow', print: true }, ...arguments);
    },

    /**
     * log error
     * 
     * @returns 
     */
    error() {
        //判断console.xxx是否被重写
        // ('prototype' in console.info) && console.info(message);
        return print('error', { css: 'red', print: true }, ...arguments);
    },


};

module.exports = logger;
