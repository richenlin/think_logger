# 介绍
-----

[![npm version](https://badge.fury.io/js/think_logger.svg)](https://badge.fury.io/js/think_logger)
[![Dependency Status](https://david-dm.org/thinkkoa/think_logger.svg)](https://david-dm.org/thinkkoa/think_logger)

Logger for ThinkKoa.Obsolete and replaced by think_trace. 已经废弃！！功能被think_trace取代!

# 安装
-----

```
npm i think_logger
```

# 使用
-----

1、logger中间件为thinkkoa内置中间件,无需在项目中创建引用。该中间件默认开启

2、项目中间件配置 config/middleware.js:
```
config: { //中间件配置
    ...,
    logger: {
        log: true, //是否存储日志
        log_path: think.root_path + '/logs', //存储日志文件目录
        log_level: ['warn', 'error'], //日志存储级别, 'info', 'warn', 'error', 'success'
    }
}
```
