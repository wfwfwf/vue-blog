---
title: css小技巧
date: 2017-08-08
sidebar: 'auto'
categories:
 - 例子
tags:
 - css3

---

## 物理像素线（也就是普通屏幕下 1px ，高清屏幕下 0.5px 的情况）采用 transform 属性 scale 实现。
```
.mod_grid {
    position: relative;
    &::after {
        // 实现1物理像素的下边框线
        content: '';
        position: absolute;
        z-index: 1;
        pointer-events: none;
        background-color: #ddd;
        height: 1px;
        left: 0;
        right: 0;
        top: 0;
        @media only screen and (-webkit-min-device-pixel-ratio: 2) {
            -webkit-transform: scaleY(0.5);
            -webkit-transform-origin: 50% 0%;
        }
    }
    
}
```

### 对于需要保持高宽比的图，应改用 padding-top 实现
```
.mod_banner {
    position: relative;
    padding-top: percentage(100/750); // 使用padding-top
    height: 0;
    overflow: hidden;
    img {
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        top: 0; 
    }
}
```

### css 画波浪线边框

```
.ss {
  margin: auto;
	width: 400px;
	height: 200px;
	border-bottom: none;
	background: radial-gradient(circle at 50% 50%, #ccc 0, #ccc 50%, transparent 0), radial-gradient(circle at 50% 50%, #ccc 0, #ccc 50%, transparent 0);
	background-repeat: repeat-y;
	background-color: white;
	background-size: 40px 40px;
	background-position: -20px 100px, 380px 100px;
}
```



### 心型的样式
```
.heart{
	width: 10px;
	height: 10px;
	position: fixed;
	background: #f00;
	transform: rotate(45deg);
	-webkit-transform: rotate(45deg);
	-moz-transform: rotate(45deg);
}
.heart:after, .heart:before{
	content: '';
	width: inherit;
	height: inherit;
	background: inherit;
	border-radius: 50%;
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	position: absolute;
}
.heart:after{
	top: -5px;
}
.heart:before{
	left: -5px;
}
```

### 文字颜色跑动
```
.text {
    font-family: 华文行楷, "font-weight bolder";
    max-width: 15rem;
    color: transparent;
    background: -webkit-linear-gradient(45deg, rgb(112, 247, 254), rgb(251, 215, 198), rgb(253, 239, 172), rgb(191, 181, 221), rgb(190, 213, 245)) text;
    animation: 20s linear 0s infinite normal none running run;
}
```