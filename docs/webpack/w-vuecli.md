---
title: 如何查看webpack配置
date: 2018-11-09
sidebar: 'auto'
categories:
 - webpack
tags:
 - webpack
 - vue-cli
publish: true
---

## 前要

vue-cli3脚手架，把很多配置都给隐藏了，有时候，在修改配置的时候，难看出来到底配置对不，或者说最终生成的配置是什么样的，看不出来。

## 方法

--mode 指定环境模式 (默认值：development)
运行命令，在终端输出：
开发环境：
```
npx vue-cli-service inspect --mode development
```
生产环境：
```
npx vue-cli-service inspect --mode production
```
运行命令，将输出导入到 js 文件：
开发环境：
```
npx vue-cli-service inspect --mode development >> webpack.config.development.js
```
生产环境：
```
npx vue-cli-service inspect --mode production >> webpack.config.production.js
```
在产生的 js 文件开头，添加：module.exports =，然后格式化即可查看。

官方网址：https://cli.vuejs.org/zh/guide/cli-service.html#vue-cli-service-inspect