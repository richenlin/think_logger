// https://en.wikipedia.org/wiki/ANSI_escape_code

const fs = require('fs');
const util = require('util');
const lib = require('think_lib');

const debug = process.env.NODE_ENV === 'development' ? true : false;
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
 * @param {any} css 
 * @param {any} args 
 * @returns 
 */
const show = function (type, css, args) {
    try {
        let params = [], i = 0, len = args.length;
        css = css || 'grey';
        let style = styles[css] || [];
        params.push(style[0]);
        params.push(`[${lib.datetime('', '')}]`);
        params.push(`[${type.toUpperCase()}]`);
        for (; i < len; i++) {
            if (lib.isError(args[i])) {
                params.push(args[i].stack);
            } else if (typeof args[i] === 'object') {
                params.push(JSON.stringify(args[i]));
            } else {
                params.push(args[i]);
            }
        }
        params.push(style[1]);
        console.log.apply(null, params);
    } catch (e) { }
    return true;
};

/**
 * 
 * 
 * @param {any} type 
 * @param {object} options 
 * @param {any} args 
 * @returns 
 */
const logger = function (type, options, args) {
    if (debug) {
        if (logger[type]) {
            logger[type](...args);
        } else if (options.css) {
            show(type, options.css, args);
        } else {
            logger.info(...args);
        }
    }
    if (options && options.record) {
        logger.write(options.path, type, ...args);
    }
    return true;
};

/**
 * write log file
 * 
 * @param {any} path 
 * @param {any} name 
 * @param {any} msgs 
 */
logger.write = function (path, name, msgs) {
    try {
        path = path || __dirname;
        if (!lib.isEmpty(msgs)) {
            lib.isDir(path) || lib.mkDir(path);
            let file = `${path}${lib.sep}${name ? name + '_' : ''}${lib.datetime('', 'yyyy-mm-dd')}.log`;
            let params = [];
            if (lib.isArray(msgs)) {
                params = msgs;
            } else if (lib.isError(msgs)) {
                params = [msgs.stack];
            } else {
                params = [msgs];
            }
            params = ['[' + lib.datetime('', '') + ']'].concat([].slice.call(params));
            params = util.format.apply(null, params) + '\n';
            fs.appendFile(file, params, function () { });
        }
    } catch (e) { }
    return true;
};

/**
 * log info
 * 
 * @returns 
 */
logger.info = function () {
    if (debug) {
        return show('INFO', 'blue', arguments);
    }
    return null;
};

/**
 * log sucess info
 * 
 * @returns 
 */
logger.success = function () {
    if (debug) {
        return show('SUCCESS', 'green', arguments);
    }
    return null;
};

/**
 * log warnning
 * 
 * @returns 
 */
logger.warn = function () {
    if (debug) {
        return show('WARN', 'yellow', arguments);
    }
    return null;
};

/**
 * log error
 * 
 * @returns 
 */
logger.error = function () {
    if (debug) {
        return show('ERROR', 'red', arguments);
    }
    return null;
};

module.exports = logger;