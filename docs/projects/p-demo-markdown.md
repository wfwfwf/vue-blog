---
title: 使用vuepress创建一个仿element-ui文档的说明文档
date: 2020-05-08
sidebar: 'auto'
categories:
 - 框架
tags:
 - vuepress
 - markdown

---

# 前要

在项目中，组件我们通常要写很多，但每个组件怎么用，一般不会去类似element-ui的说明文档。所以新人接手时，要不就是直接忽略掉了通用组件，要不就是要看半天才知道一个复杂的组件怎么用。

在19年上半年，我写了一个小组件库，目的是为了统一公司多个工程的通用组件以及样式，并且给出说明文档。　[组件地址](https://github.com/wfwfwf/td-addon)
但这个小组件库的说明文档有点问题，同一个页面，只能允许一个vue。

最近整理自己的东西时，发现以前写的东西都有一些零碎，也没有一个统一的地方存放，所以采用vuepress写了一个博客，并且在这里实现了类似element-ui可以看到代码效果的说明文档。

# 内容

## 看一下效果

::: demo 
```html
<template>
  <div class="hello">
    <h3>{{ msg }}</h3>
    <p class='doc'>
      已经全局引入了element-ui
    </p>
    <el-input v-model='txt' />
    <br/>
    <div>{{txt}}</div>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Hello Word',
      txt: ''
    }
  },
  methods: {
  }
}
</script>
<style>
h3 {
  margin: 40px 0 0;
}
.doc {
  color: #42b983;
}
</style>

```
:::


## 原理说明

vuepress是支持在markdown文件里面直接写vue代码的，那么我们要实现代码和代码效果共存时，最简单的办法，把代码写两份，一份放在pre 里展示代码, 一份直接用来展示效果。
人类的进步很大一部分是原因是来源于偷懒，不想一份代码写两遍，copy一下，也让文档不好看。偷懒的方法来了，继续往下看：

---

**方法一：**
<p>
借助 Vuepress 会自动注册 components 目录下组件的特性，或者通过 enhanceApp.js 钩子自己注册示例代码文件，然后使用 <<< @/filepath 语法将示例代码文件引入
这个方法不好的地方在于组件需要全局注册
</p>

```
<color-picker-basic-demo></color-picker-basic-demo>
## 示例代码如下
```html
<<< @/docs/.vuepress/components/color-picker-basic-demo.vue
```

**方法二：**　
<p>
vuepress 也是有生命周期的，我们可以写一个vuepress插件，在插件里把代码进行拆分组装后，按格式存放在data-里面，然后在vuepress的更新时，使用vue.extend创建实例，并挂载到一个对应的元素上。可以在git 上搜一下vuepress-plugin-demo-block-master　，这个哥们就是用的这种方法
</p>

**方法三：**
<p>
一步到位，在vuepress插件里，先将代码块作为vue组件进行编译，再把编译后的组件插入页面里面。代码看　/docs/.vuepress/plugins/demo里面。
</p>


##　主代码

在config.js里面引入插件

```
[require('./plugins/demo/')]
```


plugins/demo/index代码如下：

```
/**
 * 提供 ::: demo xxx ::: 语法，用于构建 markdown 中的示例
 */
const path = require('path')
const renderDemoBlock = require('./render')
const demoBlockContainers = require('./containers')
module.exports = (options = {}, ctx) => {
  return {
    chainMarkdown(config) {
      config.plugin('containers')
        .use(demoBlockContainers(options))
        .end();
    },
    extendMarkdown: md => {
      const id = setInterval(() => {
        const render = md.render;
        if (typeof render.call(md, '') === 'object') {
          md.render = (...args) => {
            let result = render.call(md, ...args);
            const { template, script, style } = renderDemoBlock(result.html);
            result.html = template;
            result.dataBlockString = `${script}\n${style}\n${result.dataBlockString}`;
            return result;
          }
          clearInterval(id);
        }
      }, 10);
    }
  }
}
```

plugins/demo/render代码如下：
```
const {
  stripScript,
  stripStyle,
  stripTemplate,
  genInlineComponentText
} = require('./util.js');

module.exports = function (content) {
  if (!content) {
    return content
  }
  const startTag = '<!--pre-render-demo:';
  const startTagLen = startTag.length;
  const endTag = ':pre-render-demo-->';
  const endTagLen = endTag.length;

  let componenetsString = ''; // 组件引用代码
  let templateArr = []; // 模板输出内容
  let styleArr = []; // 样式输出内容
  let id = 0; // demo 的 id
  let start = 0; // 字符串开始位置
  let commentStart = content.indexOf(startTag);
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  while (commentStart !== -1 && commentEnd !== -1) {
    templateArr.push(content.slice(start, commentStart));
    const commentContent = content.slice(commentStart + startTagLen, commentEnd);
    const html = stripTemplate(commentContent);
    const script = stripScript(commentContent);
    const style = stripStyle(commentContent);
    const demoComponentContent = genInlineComponentText(html, script); // 示例组件代码内容
    const demoComponentName = `render-demo-${id}`; // 示例代码组件名称
    templateArr.push(`<template><${demoComponentName} /></template>`);
    styleArr.push(style);
    componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`;
    // 重新计算下一次的位置
    id++;
    start = commentEnd + endTagLen;
    commentStart = content.indexOf(startTag, start);
    commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  }
  // 仅允许在 demo 不存在时，才可以在 Markdown 中写 script 标签
  // todo: 优化这段逻辑
  let pageScript = '';
  if (componenetsString) {
    pageScript = `<script>
      export default {
        name: 'component-doc',
        components: {
          ${componenetsString}
        }
      }
    </script>`;
  } else if (content.indexOf('<script>') === 0) { // 硬编码，有待改善
    start = content.indexOf('</script>') + '</script>'.length;
    pageScript = content.slice(0, start);
  }
  // 合并 style 内容
  let styleString = '';
  if(styleArr && styleArr.length > 0) {
    styleString = `<style>${styleArr.join('')}</style>`
  } else {
    styleString = `<style></style>`
  }
  templateArr.push(content.slice(start));
  return {
    template: templateArr.join(''),
    script: pageScript,
    style: styleString
  }
};
```

plugins/demo/fence代码如下：
```
// 覆盖默认的 fence 渲染策略
module.exports = md => {
  const defaultRender = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    // 判断该 fence 是否在 :::demo 内
    const prevToken = tokens[idx - 1];
    const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/);
    if (token.info === 'html' && isInDemoContainer) {
      return `<template><pre><code class="html">${md.utils.escapeHtml(token.content)}</code></pre></template>`;
    }
    return defaultRender(tokens, idx, options, env, self);
  };
};
```

plugins/demo/util代码如下：
```
const { compileTemplate } = require('@vue/component-compiler-utils');
const compiler = require('vue-template-compiler');

function stripScript(content) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

function stripStyle(content) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

// 编写例子时不一定有 template。所以采取的方案是剔除其他的内容
function stripTemplate(content) {
  content = content.trim();
  if (!content) {
    return content;
  }
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim();
}

function pad(source) {
  return source
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n');
}

function genInlineComponentText(template, script) {
  // https://github.com/vuejs/vue-loader/blob/423b8341ab368c2117931e909e2da9af74503635/lib/loaders/templateLoader.js#L46
  const finalOptions = {
    source: `<div>${template}</div>`,
    filename: 'inline-component', // TODO：这里有待调整
    compiler
  };
  const compiled = compileTemplate(finalOptions);
  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      console.warn(tip);
    });
  }
  // errors
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `\n  Error compiling template:\n${pad(compiled.source)}\n` +
        compiled.errors.map(e => `  - ${e}`).join('\n') +
        '\n'
    );
  }
  let demoComponentContent = `
    ${compiled.code}
  `;
  // todo: 这里采用了硬编码有待改进
  script = script.trim();
  if (script) {
    script = script.replace(/export\s+default/, 'const democomponentExport =');
  } else {
    script = 'const democomponentExport = {}';
  }
  demoComponentContent = `(function() {
    ${demoComponentContent}
    ${script}
    return {
      render,
      staticRenderFns,
      ...democomponentExport
    }
  })()`;
  return demoComponentContent;
}

module.exports = {
  stripScript,
  stripStyle,
  stripTemplate,
  genInlineComponentText
};
```


plugins/demo/containers代码如下：
```
const mdContainer = require('markdown-it-container');

module.exports = options => {
  const {
    component = 'demo-block'
  } = options;
  const componentName = component
    .replace(/^\S/, s => s.toLowerCase())
    .replace(/([A-Z])/g, "-$1").toLowerCase();
  return md => {
    md.use(mdContainer, 'demo', {
      validate(params) {
        return params.trim().match(/^demo\s*(.*)$/);
      },
      render(tokens, idx) {
        const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
        if (tokens[idx].nesting === 1) {
          const description = m && m.length > 1 ? m[1] : '';
          const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : '';
          const encodeOptionsStr = encodeURI(JSON.stringify(options));
          return `<${componentName} :options="JSON.parse(decodeURI('${encodeOptionsStr}'))">
            <template slot="demo"><!--pre-render-demo:${content}:pre-render-demo--></template>
            ${description ? `<div slot="description">${md.render(description).html}</div>` : ''}
            <template slot="source">
          `;
        }
        return `</template></${componentName}>`;
      }
    });
  };
}
```