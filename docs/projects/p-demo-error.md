---
title: vue下面监控报错并上抛错误日志
date: 2019-11-11
sidebar: 'auto'
categories:
 - 框架
tags:
 - vue错误日志

---

# 前要

线上出错时，常因为环境重现麻烦，而且很多错误如果没有人反馈的话，开发人员也不知道。当别人上报错误后，也难以在短时间内，定位到错误位置。

# 理论依据
  
window js自带window.onerror可以用来做错误收集

``` js
function handleOnError(errorMessage, scriptURI, lineNumber,columnNumber,errorObj)
{
　　// some code
　　return true // 阻止浏览器console输出
}
function handleListenerError (eventErr){
　　// some code
　　eventErr.preventDefault() // 阻止浏览器console输出
}
window.onerror = handleOnError
window.addEventListener('error', handleListenerError, true);
```

vue 提供了Vue.config.errorHandler　可以用来做错误收集
``` js
/** 处理Vue的错误  */
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+ 可用
  console.log (err, vm, info)
}
```

# 实现

我的项目是采用的vue，下面直接上代码

index.js
``` js
import Report from './report.js'
import Vue from 'vue'
const isProduction = process.env.NODE_ENV === 'development'
let myRport = new Report({
  url: '错误日志上传链接',
  module: '项目'
})

if (!isProduction) {
  /** 处理网络请求的错误  */
  let xhr = XMLHttpRequest.prototype
  var send = xhr.send
  xhr.send = function () {
    let loadend = arg => {
      const currentTarget = arg.currentTarget
      // 请求返回码非200
      if (currentTarget.status !== 200) {
        myRport.xhrHandler(currentTarget.responseURL, currentTarget.status, currentTarget.response)
      }
      this.removeEventListener('loadend', loadend, false)
    }
    this.addEventListener('loadend', loadend, false)
    return send.apply(this, arguments)
  }

  /** 处理Vue的错误  */
  Vue.config.errorHandler = function (err, vm, info) {
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
    myRport.handler(err, vm, info)
  }
}

```

report.js

``` js
// taken and reworked from Vue.js source
import logRequest from './request.js'
const ErrorStackParser = require('error-stack-parser')
const StackGenerator = require('stack-generator')
const reduce = (arr, fn, accum) => {
  let val = accum
  for (let i = 0, len = arr.length; i < len; i++) val = fn(val, arr[i], i, arr)
  return val
}

// Array#filter
const filter = (arr, fn) =>
  reduce(arr, (accum, item, i, arr) => !fn(item, i, arr) ? accum : accum.concat(item), [])

// Array#map
// const map = (arr, fn) =>
//   reduce(arr, (accum, item, i, arr) => accum.concat(fn(item, i, arr)), [])

// // Array#includes
// const includes = (arr, x) =>
//   reduce(arr, (accum, item, i, arr) => accum === true || item === x, false)

const classify = str => str.replace(/(?:^|[-_])(\w)/g, c => c.toUpperCase()).replace(/[-_]/g, '')

let dateFormat = function (fmt) { // author: meizz
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}

// taken and reworked from Vue.js source
const formatComponentName = (vm, includeFile) => {
  if (vm.$root === vm) return '<Root>'
  const options = typeof vm === 'function' && vm.cid != null
    ? vm.options
    : vm._isVue
      ? vm.$options || vm.constructor.options
      : vm || {}
  let name = options.name || options._componentTag
  const file = options.__file
  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/)
    name = match && match[1]
  }

  return (
    (name ? ('<' + (classify(name)) + '>') : '<Anonymous>') +
    (file && includeFile !== false ? (' at ' + file) : '')
  )
}

const hasStack = (err) => {
  return !!err &&
    (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
    typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
    err.stack !== `${err.name}: ${err.message}`
}

const getStacktrace = function (error, errorFramesToSkip = 0, generatedFramesToSkip = 0) {
  if (hasStack(error)) {
    return ErrorStackParser.parse(error).slice(errorFramesToSkip)
  }
  // in IE11 a new Error() doesn't have a stacktrace until you throw it, so try that here
  try {
    throw error
  } catch (e) {
    if (hasStack(e)) return ErrorStackParser.parse(error).slice(1 + generatedFramesToSkip)
    // error wasn't provided or didn't have a stacktrace so try to walk the callstack
    return filter(StackGenerator.backtrace(), frame =>
      (frame.functionName || '').indexOf('StackGenerator$$') === -1
    ).slice(1 + generatedFramesToSkip)
  }
}

const normaliseFunctionName = name => /^global code$/i.test(name) ? 'global code' : name
const formatStackframe = frame => {
  const f = {
    file: frame.fileName,
    method: normaliseFunctionName(frame.functionName),
    lineNumber: frame.lineNumber,
    columnNumber: frame.columnNumber,
    code: undefined,
    inProject: undefined
  }
  // Some instances result in no file:
  // - calling notify() from chrome's terminal results in no file/method.
  // - non-error exception thrown from global code in FF
  // This adds one.
  if (f.lineNumber > -1 && !f.file && !f.method) {
    f.file = 'global code'
  }
  return f
}

class Report {
  constructor (options) {
    this.options = options
  }

  doSendRequest (data) {
    if (data.requestAddress && data.requestAddress.indexOf('错误日志上传链接') > -1) {
      // 上报链接需要排徐，否则可能导致无限循环
      // return false
    } else {
      if (this.options.sendRrquest && typeof (this.options.sendRrquest) === 'function') {
        this.options.sendRrquest(data)
      } else {
        var params = new URLSearchParams()
        params.append('parameter', JSON.stringify({ body: { request: data } }))
        logRequest.sendRrquest({
          method: 'post',
          url: this.options.url,
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        })
      }
    }
  }

  /**
   * vue 错误日志处理
   */
  handler (err, vm, info) {
    let stacktraceArr = getStacktrace(err)
    let stacktrace = reduce(stacktraceArr, (accum, frame) => {
      const f = formatStackframe(frame)
      // don't include a stackframe if none of its properties are defined
      try {
        if (JSON.stringify(f) === '{}') return accum
        return accum.concat(f)
      } catch (e) {
        return accum
      }
    }, [])

    let errorOption = {
      name: err.name,
      message: err.message,
      stacktrace: stacktrace,
      errorInfo: info,
      props: vm ? vm.$options.propsData : undefined,
      data: vm ? vm.$data : undefined
    }
    // logLevel级别 DEBUG、INFO、WARN、ERROR
    let logData = {
      module: this.options.module,
      logLevel: 'ERROR',
      logType: 'js报错',
      time: dateFormat.call(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      clientInfo: window.navigator.userAgent.toLowerCase(), // 客户端信息
      errInfoAndCallStack: JSON.stringify(errorOption), // 错误的信息和调用堆栈
      url: window.location.href,
      // requestAddress: '',
      // requestTake: 0,
      errLocation: vm ? formatComponentName(vm, true) : '1'
    }
    this.doSendRequest(logData)
  }

  /**
  * http 错误日志处理
  */
  xhrHandler (url, xhrStatus, xhrErrRespons) {
    // logLevel级别 DEBUG、INFO、WARN、ERROR
    let xhrData = {
      module: this.options.module,
      logLevel: 'ERROR',
      logType: 'xhr报错',
      time: dateFormat.call(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      clientInfo: window.navigator.userAgent.toLowerCase(),
      errInfoAndCallStack: xhrErrRespons,
      url: window.location.href,
      requestAddress: url,
      requestTake: xhrStatus,
      errLocation: '1'
    }
    this.doSendRequest(xhrData)
  }

  /**
   * 页面性能监控
   */
  reportPerformance () {
    // 浏览器不支持，就算了！
    if (!window.performance && !window.performance.getEntries) {
      return false
    }

    var result = []
    // 获取当前页面所有请求对应的PerformanceResourceTiming对象进行分析
    window.performance.getEntries().forEach(item => {
      result.push({
        url: item.name,
        entryType: item.entryType,
        type: item.initiatorType,
        'duration(ms)': item.duration
      })
    })
    return result
  }
}

export default Report

```


request.js 用来处理请求
``` js
import axios from 'axios'
let axiosInst
const typeOf = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
  return typeof obj
} : function (obj) {
  return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
}
let https = {} // 请求队列
// 封装请求
class LogRequest {
  constructor () {
    // 创建axios实例
    // 生产环境

    axiosInst = axios.create({
      timeout: 60000,
      withCredentials: true
    })

    // const isProduction = (process.env.NODE_ENV === 'development')
    // if (isProduction) {
    //   // 开发环境
    //   axiosInst = axios.create({
    //     timeout: 60000,
    //     withCredentials: true
    //   })
    // } else {
    //   // 生产环境
    //   axiosInst = axios.create({
    //     baseURL: 'https://' + appConfig.API_URL,
    //     timeout: 60000,
    //     withCredentials: true
    //   })
    // }

    // 添加请求拦截器
    axiosInst.interceptors.request.use(function (config) {
      let urlParams = config.data
      let str = urlParams.get('parameter')
      if (https.hasOwnProperty(str)) {
        return false
      } else {
        https[str] = 1
        return config
      }
      // open_id 用户在不同平台上对应的唯一值
      // 在发送请求之前做些什么
    }, function (error) {
      // 对请求错误做些什么
        console.log('error: ', error)
    })

    // 添加响应拦截器
    axiosInst.interceptors.response.use((response) => {
      let {config} = response
      let urlParams = new URLSearchParams(config.data)
      let str = urlParams.get('parameter')
      delete https[str]
      // 对响应数据做点什么
      return response.data
    }, function (error) {
      console.log('error: ', error)
      // 对响应错误做点什么
    })
  }

  // 是否是对象
  isObject (obj) {
    return (typeof obj === 'undefined' ? 'undefined' : typeOf(obj)) === 'object' && obj !== null
  }

  // 继承扩展
  extend (obj) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key]
    }
    if (this.isObject(obj) && args.length > 0) {
      if (Object.assign) {
        return Object.assign.apply(Object, [obj].concat(args))
      }
      args.forEach(function (arg) {
        if (this.isObject(arg)) {
          Object.keys(arg).forEach(function (key) {
            obj[key] = arg[key]
          })
        }
      })
    }
    return obj
  }

  sendRrquest (data) {
    return axiosInst(data)
  }
}

const logRequest = new LogRequest()
export default logRequest

```