/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/5/2
 */
const lib = require('think_lib');
const logger = require('./lib/logger.js');

/**
 * 日志输出
 * 包括格式化输出到控制台以及记录日志文件
 * @param {any} path 
 * @param {any} [level=[]] 
 * @param {boolean} [record=false] 
 */
const logOutput = function (path, level = [], record = false) {
    ['info', 'warn', 'error', 'success'].map(item => {
        console[item] = function () {
            try {
                logger[item](...arguments);
                if (record && level.indexOf(item) > -1) {
                    logger.write(path, item, arguments);
                }
            } catch (e) { }
        };
    });
};

/**
 * default options
 */
const defaultOptions = {
    log: true, //是否存储日志
    log_path: think.root_path + '/logs', //存储日志文件目录
    log_level: ['warn', 'error'], //日志存储级别, 'info', 'warn', 'error', 'success'
};

module.exports = function (options) {
    options = options ? lib.extend(defaultOptions, options, true) : defaultOptions;
    //logger仅执行一次
    think.app.once('appReady', () => {
        lib.define(think, 'logger', logger);
        let path = options.log_path || __dirname;
        lib.define(think, 'addLogs', function(name, msgs) {
            return logger.write(path, name, msgs);
        });
        //触发绑定记录日志
        let level = options.log_level || [];
        logOutput(path, level, options.log);
    });

    return function (ctx, next) {
        return next();
    };
};