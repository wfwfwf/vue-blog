---
title: 添加自动eslint
date: 2018-11-09
sidebar: 'auto'
categories:
 - webpack
tags:
 - webpack
 - vue-cli
publish: true
---


1、添加standard
```
npm install standard --save-dev
```
2、添加执行命令
```
{
  "name": "your-project-name",
  "devDependencies": {
    "standard": "*"
  },
  // 只要在scripts添加以下两句命令
  "scripts": {
    "vy": "standard && node my-tests.js",       
    "fix": "standard --fix"
  }
}
```
3、执行命令
```
yarn run fix
```