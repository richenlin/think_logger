const fs = require('fs');
const os = require('os');
const util = require('util');
const lib = require('think_lib');
const fsopen = util.promisify(fs.open);
const fsappend = util.promisify(fs.appendFile);
const fsclose = util.promisify(fs.close);


// https://en.wikipedia.org/wiki/ANSI_escape_code
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
        if (type === 'debug') {
            Error.captureStackTrace(logger);
            const matchResult = (logger.stack).match(/\(.*?\)/g) || [];
            params.push(matchResult[3] || '');
        }

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
 * @param {object} options 
 * @param {any} args 
 * @returns 
 */
const print = function (type, options = {}, args) {
    try {
        const opt = {
            print: process.env.NODE_ENV === 'development' ? true : false,
            record: process.env.LOGS,
            level: process.env.LOGS_LEVEL ? process.env.LOGS_LEVEL : 'warn, error',
            path: process.env.LOGS_PATH ? process.env.LOGS_PATH : os.tmpdir(),
            css: 'white'
        };
        options = Object.assign(opt, options || {});

        // print console
        if (options.print) {
            args = format(type, args);
            const css = options.css || 'grey';
            const style = styles[css] || styles.grey;
            console.log.apply(null, [style[0] || '', ...args, style[1]] || '');
        }
        // record log files
        if (options.record === 'true' && options.level.indexOf(type) > -1) {
            (function (p, t, a, f) {
                return write(p, t, a, f);
            })(options.path, type, args, options.print);
        }
        return null;
    } catch (e) {
        console.error(e);
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
const write = async function (fpath, name, msgs, formated = false) {
    try {
        if (fpath) {
            if (!lib.isDir(fpath)) {
                lib.mkDir(fpath);
            }
            let params = msgs;
            if (!formated) {
                params = format(name, msgs);
            }
            let file = `${fpath}${lib.sep}${name ? name + '_' : ''}${lib.datetime('', 'YYYY-MM-DD')}.log`;
            const fd = await fsopen(file, 'a');
            await fsappend(fd, `${util.format.apply(null, params)}\n`, 'utf8');
            await fsclose(fd);
        }
        // tslint:disable-next-line: no-null-keyword
        return null;
    } catch (err) {
        console.error(err);
        // tslint:disable-next-line: no-null-keyword
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
        return print(type, { css: css || 'gray' }, args);
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
        return print('debug', { css: 'blue' }, ...arguments);
    },
    /**
     * log info
     * 
     * @returns 
     */
    info() {
        //判断console.xxx是否被重写
        // ('prototype' in console.info) && console.info(message);
        return print('info', { css: 'white' }, ...arguments);
    },
    /**
     * log sucess info
     * 
     * @returns 
     */
    success() {
        //判断console.xxx是否被重写
        // ('prototype' in console.info) && console.info(message);
        return print('info', { css: 'green' }, ...arguments);
    },
    /**
     * log warnning
     * 
     * @returns 
     */
    warn() {
        //判断console.xxx是否被重写
        // ('prototype' in console.info) && console.info(message);
        return print('warn', { css: 'yellow' }, ...arguments);
    },

    /**
     * log error
     * 
     * @returns 
     */
    error() {
        //判断console.xxx是否被重写
        // ('prototype' in console.info) && console.info(message);
        return print('error', { css: 'red' }, ...arguments);
    },


};

module.exports = logger;
