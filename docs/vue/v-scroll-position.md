---
title: 滚动条位置缓存
date: 2017-08-09
sidebar: 'auto'
categories:
 - vue
tags:
 - 滚动条
publish: true
---

## 如何保留滚动条位置

在vue项目中，我们可能会遇到这样的需求，例如：

商品列表页中，点击某一商品，进入到详情页。

从详情页中返回到商品列表页，页面应当显示的页面应当是之前的样子。

也就是说，滚动条的位置应该缓存下来；

思路 商品列表需要被缓存下来,页面的缓存方式请查看vue官方文档keep-alive来缓存页面，这样，在详情页面返回的时候，页面不至于重新加载。 在商品列表生命周期activated中，监听当前scrollContainer父元素的滚动事件，滚动时的回调中，获取到scrollTop(滚动条距离滚动元素即scrollContainer的距离)的值，存入到以及在deactivated中移除掉当前滚动事件的监听。 在商品列表中，点击进入详情页中的时候，将滚动条位置被缓存下来了，你可以放到sessionStorage|localStorage中。当然，如果你使用了vuex，可以直接将值放入vuex中进行管理； 从详情页中返回的时候，同时要做这样的操作，将你存入缓存中的scrollTop值重新赋予给当前div的滚动条 Ok，思路就是这样子，大功告成。 vue中具体实现 我是用的vuex进行管理的滚动条位置，实现代码如下：

```
<div class="scrollContainer" ref="scroll">    //加了一个ref，用于获取当前dom 
     <ul>
       <li>1</li>
       <li>2</li>
       <li>3</li>
       <li>4</li>
       <li>5</li>
       <li>6</li>
       <li>7</li>
       <li>8</li>
       <li>9</li>
       <li>10</li>  
     </ul>
</div>
computed:{
    ...mapGetters([
          "home_list_top"    //vuex中的存放的滚动条的位置
    ])
}
...
methods:{
    recordScrollPosition(e) {
      this.$store.dispatch("setHomeListTop",e.target.scrollTop);    //实时存入到vuex中
    }
}
...
activated(){  //滚动条位置的监听放到activated是因为此页面被keep-alive缓存了
    this.$refs.scroll.scrollTop = this.home_list_top;        //this.$refs.scroll拿到滚动的dom，即scrollContainer，this.home_list_top是存入到vuex里的值
    this.$refs.scroll.addEventListener("scroll",this.recordScrollPosition);    //添加绑定事件
},
deactivated(){  //keep-alive 的页面跳转时，移除scroll事件
    this.$refs.scroll.removeEventListener("scroll",this.recordScrollPosition);  //清除绑定的scroll事件
}
```


## -webkit-overflow-scrolling介绍

-webkit-overflow-scrolling: auto | touch;
auto： 普通滚动，当手指从触摸屏上移开，滚动立即停止 touch：滚动回弹效果，当手指从触摸屏上移开，内容会保持一段时间的滚动效果，继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。

兼容写法
```
over-flow: auto;     /* winphone8和android4+ */
-webkit-overflow-scrolling: touch;    /* ios5+ */
```