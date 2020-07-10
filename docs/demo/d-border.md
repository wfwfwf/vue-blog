---
title: CSS3制作的效果非常炫酷的元素边框线条动画特效
date: 2017-08-08
sidebar: 'auto'
categories:
 - 例子
tags:
 - css3

publish: true
---


::: demo 
```html
<template>
  <div class="d-border-content">
    <div class="bb">
      这是一个边框效果
    </div> 
  </div>
</template>
<style >
/*定义两个伪类元素的位置*/
.d-border-content {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  position: relative;
}
.bb, .bb::before, .bb::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
/*定义容器bb的样式及边框的样式*/
.bb {
  width: 200px;
  height: 200px;
  margin: auto;
  background: no-repeat 50%/70% rgba(0, 0, 0, 0.1);
  color: #69ca62;
  box-shadow: inset 0 0 0 1px rgba(105, 202, 98, 0.5);
  text-align: center;
  line-height: 200px;
}
 /*定义两个伪类的样式及动画开始*/
.bb::before, .bb::after {
  content: '';
  z-index: -1;
  margin: -5%;
  box-shadow: inset 0 0 0 2px;
  animation: clipMe 8s linear infinite;
}
 /*前一个伪类的动画提前4s执行*/
.bb::before {
  animation-delay: -4s;
}
.bb:hover::after, .bb:hover::before{
  background-color: rgba(255, 0, 0, 0.3);
}
 /*定义帧动画*/
@keyframes clipMe {
  0%, 100% {
    clip: rect(0px, 220.0px, 2px, 0px);
  }
  25% {
    clip: rect(0px, 2px, 220.0px, 0px);
  }
  50% {
    clip: rect(218.0px, 220.0px, 220.0px, 0px);
  }
  75% {
    clip: rect(0px, 220.0px, 220.0px, 218.0px);
  }
}
</style>
```
:::