---
title: css鼠标移动气泡
date: 2018-09-08
sidebar: 'auto'
categories:
 - 例子
tags:
 - css3

---

::: demo 
```html
<template>
  <canvas class="canvas" id='canvas' ref='canvas'></canvas> 
</template>
<style>
#canvas {
  width: 100%;
  height: 400px;
  /* position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%; */
  pointer-events: none;
}
  
</style>
<script>

let colors = ['#FFE300', '#FF7494', '#00E6FF', '#89FF47']
class Circle {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 10 + 10;
    this.v = Math.random()
    this.step = 60
    this.ctx = ctx
    // 颜色的取值范围
    this.color = colors[Math.floor((Math.random() * colors.length))]
    //随机方向
    this.dx = Math.random() * 7 - 3.5;
    this.dy = Math.random() * 7 - 3.5;
  }
  render() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
    this.ctx.closePath();
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.r -= this.v;
    this.step--
  }
}

export default {
  name: 'd-css-circle',
  data () {
    return {
      circleArr: []
    }
  },

  mounted() {
    let _this = this
    this.initCanvas()
    window.addEventListener("mousemove", _this.handleMousemove , false)
  },
  destroyed(){
    let _this = this
    if(this.timer){
      window.cancelAnimationFrame(this.timer)
    }
    window.removeEventListener("mousemove", _this.handleMousemove);
  },
  methods: {
    initCanvas(){
      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
      // let canvas = document.getElementById("canvas");
      let canvas = this.$refs.canvas;
      this.ctx = canvas.getContext("2d");
      let w = canvas.width = canvas.offsetWidth
      let h = canvas.height = canvas.offsetHeight
      let draw = _ => {
        this.ctx.clearRect(0, 0, w, h)
        for (let i = 0; i < this.circleArr.length; i++) {
          let item = this.circleArr[i]
          item.update()
          if(item.step <= 0 || item.r <= 0){
              for (var j = 0; j < this.circleArr.length; j++) {
                  if (this.circleArr[j] === item) {
                    this.circleArr.splice(j, 1)
                    break
                  }
              }
          } else {
            item.render()
          }
        }
        this.timer = requestAnimationFrame(draw)
      }
      draw()
    },
    handleMousemove(e) {
      /***
      offsetWidth       //返回元素的宽度（包括元素宽度、内边距和边框，不包括外边距）
      offsetHeight      //返回元素的高度（包括元素高度、内边距和边框，不包括外边距）
      clientWidth        //返回元素的宽度（包括元素宽度、内边距，不包括边框和外边距）
      clientHeight       //返回元素的高度（包括元素高度、内边距，不包括边框和外边距）
      style.width         //返回元素的宽度（包括元素宽度，不包括内边距、边框和外边距）
      style.height       //返回元素的高度（包括元素高度，不包括内边距、边框和外边距）
      scrollWidth       //返回元素的宽度（包括元素宽度、内边距和溢出尺寸，不包括边框和外边距），无溢出的情况，与clientWidth相同
      scrollHeigh       //返回元素的高度（包括元素高度、内边距和溢出尺寸，不包括边框和外边距），无溢出的情况，与clientHeight相同
      1. style.width 返回的是字符串，如28px，offsetWidth返回的是数值28；
      2. style.width/style.height与scrollWidth/scrollHeight是可读写的属性，clientWidth/clientHeight与offsetWidth/offsetHeight是只读属性
      3. style.width的值需要事先定义，否则取到的值为空。而且必须要定义在html里(内联样式)，如果定义在css里，style.height的值仍然为空，但元素偏移有效；而offsetWidth则仍能取到。
      //-----------------------------------------------------------------------------------------------
      offsetTop    //返回元素的上外缘距离最近采用定位父元素内壁的距离，如果父元素中没有采用定位的，则是获取上外边缘距离文档内壁的距离。所谓的定位就是position属性值为relative、absolute或者fixed。返回值是一个整数，单位是像素。此属性是只读的。
      offsetLeft       //此属性和offsetTop的原理是一样的，只不过方位不同，这里就不多介绍了。
      scrollLeft        //此属性可以获取或者设置对象的最左边到对象在当前窗口显示的范围内的左边的距离，也就是元素被滚动条向左拉动的距离。返回值是一个整数，单位是像素。此属性是可读写的。
      scrollTop   //此属性可以获取或者设置对象的最顶部到对象在当前窗口显示的范围内的顶边的距离，也就是元素滚动条被向下拉动的距离。返回值是一个整数，单位是像素。此属性是可读写的。
      //-------------------------------------------------------------------------------------------------
      当鼠标事件发生时（不管是onclick，还是omousemove，onmouseover等）
      clientX        鼠标相对于浏览器（这里说的是浏览器的有效区域）左上角x轴的坐标；  不随滚动条滚动而改变；
      clientY        鼠标相对于浏览器（这里说的是浏览器的有效区域）左上角y轴的坐标；  不随滚动条滚动而改变；
      pageX        鼠标相对于浏览器（这里说的是浏览器的有效区域）左上角x轴的坐标；  随滚动条滚动而改变；
      pageY        鼠标相对于浏览器（这里说的是浏览器的有效区域）左上角y轴的坐标；  随滚动条滚动而改变；
      screenX     鼠标相对于显示器屏幕左上角x轴的坐标；  
      screenY      鼠标相对于显示器屏幕左上角y轴的坐标；  
      offsetX        鼠标相对于事件源左上角X轴的坐标
      offsetY        鼠标相对于事件源左上角Y轴的坐标
      ***/
     
      this.circleArr.push(new Circle(e.offsetX, e.offsetY, this.ctx)) 
    }
  }
}
</script>
```
:::