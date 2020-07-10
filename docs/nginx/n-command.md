---
title: nginx常用命令
date: 2017-08-09
sidebar: 'auto'
categories:
 - nginx
tags:
 - nginx常用命令
publish: true
---

在nginx.exe目录，打开命令行工具，用命令 启动/关闭/重启nginx 
 
start nginx : 启动nginx
nginx -s reload  ：修改配置后重新加载生效
nginx -s reopen  ：重新打开日志文件
nginx -t -c /path/to/nginx.conf 测试nginx配置文件是否正确

关闭nginx：
nginx -s stop  :快速停止nginx
nginx -s quit  ：完整有序的停止nginx



nginx常用命令：
 
验证配置是否正确: nginx -t
 
查看Nginx的版本号：nginx -V
 
启动Nginx：start nginx
 
快速停止或关闭Nginx：nginx -s stop
 
正常停止或关闭Nginx：nginx -s quit
 
配置文件修改重装载命令：nginx -s reload


systemctl nginx reload