/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/5/2
 */

const fs = require('fs');
const util = require('util');
const lib = require('think_lib');

/**
 * 
 * 
 * @param {any} path 
 * @param {any} name 
 * @param {any} msgs 
 */
const write = function (path, name, msgs) {
    try {
        let log_path = `${think.root_path}${lib.sep}logs${lib.sep}${lib.isEmpty(path) ? 'console' : path}`;
        lib.isDir(log_path) || lib.mkDir(log_path);
        if (!lib.isEmpty(msgs)) {
            let file = `${log_path}${lib.sep}${name ? name + '_' : ''}${lib.datetime('', 'yyyy-mm-dd')}.log`;
            msgs = ['[' + lib.datetime('', '') + ']'].concat([].slice.call(msgs));
            let message = util.format.apply(null, msgs) + '\n';
            fs.appendFile(file, message);
        }
    } catch (e) { }
};

/**
 * 
 * 
 * @param {any} [level=[]] 
 */
const logConsole = function (level = []) {
    ['info', 'warn', 'error'].map(item => {
        if (level.indexOf(item) > -1) {
            console[item] = function () {
                try {
                    let msgs = ['[' + item.toUpperCase() + ']'].concat([].slice.call(arguments));
                    write('', '', msgs);
                } catch (e) { }
            };
        }
    });
};

const logCustom = function (name, msgs) {
    try {
        msgs = ['[INFO]', lib.isString(msgs) ? msgs : JSON.stringify(msgs)];
        write('custom', name, msgs);
    } catch (e) { }

};

/**
 * console format
 * 
 * @param {any} msg 
 * @param {any} type 
 * @param {any} showTime 
 * @param {any} debug 
 */
const logger = function (msg, type, showTime, debug) {
    debug = debug || think.app_debug || false;
    let dateTime = `[${lib.datetime('', '')}] `;
    let message = msg;
    if (lib.isError(msg)) {
        type = 'ERROR';
        message = msg.stack;
        ('prototype' in console.error) && console.error(msg.stack);
    } else if (type === 'ERROR') {
        type = 'ERROR';
        if (!lib.isString(msg)) {
            message = JSON.stringify(msg);
        }
        ('prototype' in console.error) && console.error(message);
    } else if (type === 'WARNING') {
        type = 'WARNING';
        if (!lib.isString(msg)) {
            message = JSON.stringify(msg);
        }
        ('prototype' in console.warn) && console.warn(message);
    } else {
        if (!lib.isString(msg)) {
            message = JSON.stringify(msg);
        }
        if (lib.isNumber(showTime)) {
            let _time = Date.now() - showTime;
            message += '  ' + `${_time}ms`;
        }
        type = type || 'INFO';
        //判断console.info是否被重写
        ('prototype' in console.info) && console.info(message);
    }
    (debug || type === 'THINK') && console.log(`${dateTime}[${type}] ${message}`);
};


module.exports = function (options) {
    //logger仅执行一次
    think.app.once('appReady', () => {
        think.log = logger;
        think.addLogs = logCustom;
        
        if (!options || !options.log) {
            return;
        }
        //日志
        let level = options.level || [];
        logConsole(level);
        
    });

    return function (ctx, next) {
        return next();
    };
};