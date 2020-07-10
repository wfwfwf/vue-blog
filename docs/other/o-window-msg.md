---
title: 桌面提示
date: 2018-05-09
sidebar: 'auto'
categories:
 - 提示
tags:
 - 桌面提示

---

# 桌面通知

Notifications API 的通知接口用于向用户配置和显示桌面通知。



构造方法
```
let notification = new Notification(title, options)
```
参数
title
一定会被显示的通知标题
options 可选
一个被允许用来设置通知的对象。它包含以下属性：
dir : 文字的方向；它的值可以是 auto（自动）, ltr（从左到右）, or rtl（从右到左）
lang: 指定通知中所使用的语言。这个字符串必须在 BCP 47 language tag 文档中是有效的。
body: 通知中额外显示的字符串
tag: 赋予通知一个ID，以便在必要的时候对通知进行刷新、替换或移除。
icon: 一个图片的URL，将被用于显示通知的图标。


事件处理
Notification.onclick
处理 click 事件的处理。每当用户点击通知时被触发。
Notification.onshow
处理 show 事件的处理。当通知显示的时候被触发。
Notification.onerror
处理 error 事件的处理。每当通知遇到错误时被触发。
Notification.onclose
处理 close 事件的处理。当用户关闭通知时被触发。


###　示例

```
if(window.Notification && Notification.permission !== "denied") {
	Notification.requestPermission(function(status) {
		var n = new Notification('小伙子你中招了', { body: '敢关你的电脑就完了！',icon:'https://ss0.baidu.com/73F1bjeh1BF3odCf/it/u=926886369,3147214923&fm=85&s=F13B30D68C44BD4F12AA18930300D089' }); 
	});
}
```

### 官方文档地址

https://developer.mozilla.org/zh-CN/docs/Web/API/Notification

