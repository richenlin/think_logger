# 介绍
-----

[![npm version](https://badge.fury.io/js/think_logger.svg)](https://badge.fury.io/js/think_logger)
[![Dependency Status](https://david-dm.org/thinkkoa/think_logger.svg)](https://david-dm.org/thinkkoa/think_logger)

Logger for ThinkKoa.

# 安装
-----

```
npm i think_logger
```

# 使用
-----


### logger(type, option, ...args)

自定义控制台输出。

* type 控制台输出类型,例如 THINK, HTTP等
* option { print: true, css: 'blue', record: true, path: path } 
    print 是否在控制台打印日志
    css 控制台输出字符颜色,例如 white,grey,black,blue,cyan,green,magenta,red,yellow等
    record 是否保存为日志文件
    path 日志文件保存路径
* ...args 其余可变参数。不限制参数个数。类型为数组

```js
logger('custom', {css:'blue'}, ['测试内容']);
logger('custom', {css:'green'}, ['测试：', '测试内容']);
logger('custom', {css:'blue'}, [{"测试": "测试内容"}]);
logger('custom', {css:'blue'}, ['测试：', '测试内容']);
logger('custom', {css:'red'}, [new Error('测试内容')]);
```
### think.logger.info(...args)

自定义控制台输出info类型信息。

* ...args 可变参数。不限制参数个数

```js
logger.info('测试：', '测试内容');
logger.info({"测试": "测试内容"});
logger.info(['测试：', '测试内容']);
logger.info(new Error('测试内容'));
```
### logger.success(...args)

自定义控制台输出success类型信息。

* ...args 可变参数。不限制参数个数

```js
logger.success('测试内容');
logger.success('测试：', '测试内容');
logger.success({"测试": "测试内容"});
logger.success(['测试：', '测试内容']);
logger.success(new Error('测试内容'));
```
### logger.warn(...args)

自定义控制台输出warn类型信息。

* ...args 可变参数。不限制参数个数

```js
logger.warn('测试内容');
logger.warn('测试：', '测试内容');
logger.warn({"测试": "测试内容"});
logger.warn(['测试：', '测试内容']);
logger.warn(new Error('测试内容'));
```
### logger.error(...args)

自定义控制台输出error类型信息。

* ...args 可变参数。不限制参数个数

```js
logger.error('测试内容');
logger.error('测试：', '测试内容');
logger.error({"测试": "测试内容"});
logger.error(['测试：', '测试内容']);
logger.error(new Error('测试内容'));
```

### logger.write(path, name, msgs)

自定义信息写入日志文件。自动按照日期切割。

* path 日志保存绝对路径
* name 日志文件名
* msgs 接收 Error、对象、字符串等类型数据

```js

//写入日志 
await logger.write(__dirname, 'test', JSON.stringify({aa: 11}));
```