---
title: 小程序创建watch
date: 2019-09-09
sidebar: 'auto'
categories:
 - 小程序
tags:
 - 小程序
publish: true
prev: false
next: false
---

# 前要

小程序在前面的版本是没有实现watch和computed的，后面通过npm引包实现了，但在部分版本上不支持。　另外，个人觉得小程序页面对象的创建，最好是自己包一层　如下面代码中的newPage，这样将一些公共代码就可以直接封装在newPage方法的实现里，比如说判断是否注册。



# 小程序watch实现　

``` js
class Tools {
  constructor() { }
  /*时间差倒计时
   *@method timeDiffer 
   *@for Tools
   *@param{参数类型}startTime 开始时间戳
   *@param{参数类型}endTime 结束时间戳
   *@return {返回值类型} 返回对象或者false
  */
  timeDiffer(startTime, endTime) {
    let timestamp = startTime ? startTime : (new Date()).valueOf()
    let differ = (endTime - timestamp) / 1000
    if (differ > 0) {
      let daySeconds = 24 * 60 * 60
      let day = parseInt(differ / daySeconds) //计算整数天数
      let afterDay = differ - day * daySeconds; //取得算出天数后剩余的秒数
      let hour = parseInt(afterDay / 3600) //计算整数小时数
      let afterHour = differ - day * daySeconds - hour * 3600 //取得算出小时数后剩余的秒数
      let min = parseInt(afterHour / 60) //计算整数分
      let second = parseInt(differ - day * daySeconds - hour * 3600 - min * 60) //取得算出分后剩余的秒数
      return {
        day,
        hour: hour < 10 ? '0' + hour : hour,
        min: min < 10 ? '0' + min : min,
        second: second < 10 ? '0' + second : second,
      }
    } else {
      return false
    }
  }
  /*处理跳转传参
   *@method handleParam
   *@for Tools
   *@param{Object}obj 需处理的对象
   *@return {String} 拼接后字符串
  */
  handleParam(obj) {
    let str = ''
    for (let key in obj) {
      str += key + '=' + obj[key] + '&'
    }
    return str.substring(0, str.length - 1)
  }

  /**
   * 处理合并参数
   */
  handlePageParamMerge(arg) {
    let numargs = arg.length; // 获取被传递参数的数值。
    let data = {}
    let page = {}
    for (let ix in arg) {
      let item = arg[ix]
      if (item.data && typeof (item.data) === 'object') {
        data = Object.assign(data, item.data)
      }
      if (item.methods && typeof (item.methods) === 'object') {
        page = Object.assign(page, item.methods)
      } else {
        page = Object.assign(page, item)
      }
    }
    page.data = data
    return page
  }

  /***
   * 合并页面方法以及数据, 兼容 {data:{}, methods: {}} 或 {data:{}, a:{}, b:{}}
   */
  mergePage() {
    return this.handlePageParamMerge(arguments)
  }

  /**
   * 处理组件参数合并
   */
  handleCompParamMerge(arg) {
    let numargs = arg.length; // 获取被传递参数的数值。
    let data = {}
    let options = {}
    let properties = {}
    let methods = {}
    let comp = {}
    for (let ix in arg) {
      let item = arg[ix]
      // 合并组件的初始数据
      if (item.data && typeof (item.data) === 'object') {
        data = Object.assign(data, item.data)
      }
      // 合并组件的属性列表
      if (item.properties && typeof (item.properties) === 'object') {
        properties = Object.assign(properties, item.properties)
      }
      // 合组件的方法列表
      if (item.methods && typeof (item.methods) === 'object') {
        methods = Object.assign(methods, item.methods)
      }
      if (item.options && typeof (item.options) === 'object') {
        options = Object.assign(options, item.options)
      }
      comp = Object.assign(comp, item)
    }
    comp.data = data
    comp.options = options
    comp.properties = properties
    comp.methods = methods
    return comp
  }

  /**
   * 组件混合 {properties: {}, options: {}, data:{}, methods: {}}
   */
  mergeComponent() {
    return this.handleCompParamMerge(arguments)
  }

  /***
   * 合成带watch的页面
   */
  newPage() {
    let options = this.handlePageParamMerge(arguments)
    let that = this
    let app = getApp()

    //增加全局点击登录判断
    if (!options.publicCheckLogin){
      options.publicCheckLogin = function (e) {
        let pages = getCurrentPages()
        let page = pages[pages.length - 1]
        let dataset = e.currentTarget.dataset
        let callback = null

        //获取回调方法
        if (dataset.callback && typeof (page[dataset.callback]) === "function"){
          callback = page[dataset.callback]
        }
        console.log('callback>>', callback, app.isRegister())
        //判断是否登录
        if (callback && app.isRegister()){
          callback(e)
        }
        else{
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    }

    const { onLoad } = options
    options.onLoad = function (arg) {
      options.watch && that.setWatcher(this)
      onLoad && onLoad.call(this, arg)
    }

    const { onShow } = options
    options.onShow = function (arg) {
      if (options.data.noAutoLogin || app.isRegister()) {
        onShow && onShow.call(this, arg)
        //页面埋点
        app.ga({})
      }
      else {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    }

    return Page(options)
  }

  /**
   * 合成带watch等的组件
   */
  newComponent() {
    let options = this.handleCompParamMerge(arguments)
    let that = this
    const { ready } = options
    options.ready = function (arg) {
      options.watch && that.setWatcher(this)
      ready && ready.call(this, arg)
    }
    return Component(options)
  }

  /**
    * 设置监听器
    */
  setWatcher(page) {
    let data = page.data;
    let watch = page.watch;
    Object.keys(watch).forEach(v => {
      let key = v.split('.'); // 将watch中的属性以'.'切分成数组
      let nowData = data; // 将data赋值给nowData
      for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
        nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
      }

      let lastKey = key[key.length - 1];
      // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
      let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
      let deep = watch[v].deep; // 若未设置deep,则为undefine
      this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
    })
  }

  /**
   * 监听属性 并执行监听函数
   */
  observe(obj, key, watchFun, deep, page) {
    var val = obj[key];
    // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
    if (deep && val != null && typeof val === 'object') {
      Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
        this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
      })
    }
    var that = this;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        if (val === value) {
          return
        }
        // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
        watchFun.call(page, value, val); // value是新值，val是旧值
        val = value;
        if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
          that.observe(obj, key, watchFun, deep, page);
        }
      },
      get: function () {
        return val;
      }
    })
  }

  delMark (str) {
    if (str) {
      // 去掉转义字符  
      str = str.replace(/[\'\"\\\/\b\f\n\r\t]/g, '')
      // 去掉特殊字符  
      str = str.replace(/[`~!#$^*|{}:;',\\\.\/?！@￥……_*——|{}【】；："。，、？\s]/g, '')
    }
    return str
  }

}
export let tools = new Tools()  
```