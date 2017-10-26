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
        let params = [];
        css = css || 'grey';
        let style = styles[css] || styles['grey'];
        if (lib.isArray(args)) {
            params = args;
        } else if (lib.isError(args)) {
            params = [args.stack];
        } else {
            params = [args];
        }
        params = [style[0], `[${lib.datetime('', '')}]`, `[${type.toUpperCase()}]`].concat([].slice.call(params));
        params.push(style[1]);
        console.log.apply(null, params);
    } catch (e) {
        // console.error(e.stack);
    }
    return null;
};

/**
 * 
 * 
 * @param {any} type 
 * @param {object} options 
 * @param {any} args 
 * @returns 
 */
/*eslint-disable func-style */
function logger(type, options = {}, args) {
    try {
        options = options || {};
        // print console
        if (!options.print) {
            options.print = process.env.NODE_ENV === 'development' ? true : false;
        }
        if (options.print) {
            show(type ? type.toUpperCase() : 'INFO', options.css || 'grey', args);
        }
        // record log files
        if (!options.record) {
            options.record = process.env.LOGS ? true : false;
        }
        if (!options.level) {
            options.level = process.env.LOGS_LEVEL ? process.env.LOGS_LEVEL.split(',') : ['warn', 'error'];
        }
        options.path = process.env.LOGS_PATH ? process.env.LOGS_PATH : os.tmpdir();
        if (options.record && options.level.indexOf(type) > -1) {
            logger.write(options.path, type, args);
        }
    } catch (e) {
        // console.error(e.stack);
    }
    return null;
}

/**
 * write log file
 * 
 * @param {any} path 
 * @param {any} name 
 * @param {any} msgs 
 */
logger.write = function (path, name, msgs) {
    try {
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
    } catch (e) {
        // console.error(e.stack);
    }
    return null;
};

/**
 * 
 * 
 * @param {any} type 
 * @param {any} css 
 * @param {any} args 
 * @returns 
 */
logger.custom = function (type, css, args) {
    return logger(type, { css: css || 'gray' }, args);
};

/**
 * log info
 * 
 * @returns 
 */
logger.info = function () {
    //判断console.xxx是否被重写
    // ('prototype' in console.info) && console.info(message);
    return logger('info', { css: 'blue' }, ...arguments);
};

/**
 * log sucess info
 * 
 * @returns 
 */
logger.success = function () {
    return logger('success', { css: 'green' }, ...arguments);
};

/**
 * log warnning
 * 
 * @returns 
 */
logger.warn = function () {
    return logger('warn', { css: 'yellow' }, ...arguments);
};

/**
 * log error
 * 
 * @returns 
 */
logger.error = function () {
    return logger('error', { css: 'red' }, ...arguments);
};

module.exports = logger;