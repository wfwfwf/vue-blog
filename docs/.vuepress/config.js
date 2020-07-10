// .vuepress/config.js
const path = require('path')

module.exports = {
  title: '光明山',
  description: '山妖的老窝',
  base: '/vue-blog/dist/',
  dest: 'docs/dist',
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }],
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js' }]
  ],
  displayAllHeaders: true,  // 显示所有页面的标题链接
  smoothScroll: true, // 启用页面滚动效果
  // extend: 'vuepress-theme-reco',
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    author: '山妖',
    startYear: '2016',
    editLinks: false,
    docsDir: 'docs',
    authorAvatar: '/spider.jpg',
    // valineConfig: {
    //   appId: '7UVrYoXI8L5RbdVsYkR2Ruiq-gzGzoHsz',     // your appId
    //   appKey: 'Q1U9mUiXSYTmEGLIbofuh4n7' // your appKey
    // },
    // vssueConfig: {
    //   platform: 'github',
    //   owner: 'wfwfwf',
    //   repo: 'blog',
    //   clientId: 'soso',
    //   clientSecret: 'mamahuhu'
    // },
    // record: 'ICP 备案文案',
    // recordLink: 'ICP 备案指向链接',
    // cyberSecurityRecord: '公安部备案文案',
    // cyberSecurityLink: '公安部备案指向链接',

    noFoundPageByTencent: false, // 404 腾讯公益
    friendLink: [
      {
        title: 'CSDN',
        desc: '老博客',
        email: 'yeyu.yeyu@163.com',
        link: 'https://blog.csdn.net/wfwfwf128'
      }
    ],
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: 'Tag'      // 默认文案 “标签”
      }
    },
    nav: [
      { text: '首页', link: '/' },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
      { text: 'External', link: 'https://github.com/wfwfwf/vue-blog' },
    ],
    sidebar: 'auto', // 侧边栏配置
    // sidebar: {
    //   '/vue/': [
    //     {
    //       title: 'vue',   // 必要的
    //       collapsable: false, // 可选的, 默认值是 true,
    //       sidebarDepth: 1,    // 可选的, 默认值是 1
    //       children: [
    //         '',
    //         'demo',
    //         'start',
    //         'assets'
    //       ]
    //     }
    //   ]
    // },
    },
    plugins: [
      [require('./plugins/demo/')]
      // ["@vuepress-reco/vuepress-plugin-kan-ban-niang",
      //   {
      //     theme: ["shizuku"],
      //     clean: true,
      //     modelStyle: {
      //       position: "fixed",
      //       left: "0px",
      //       bottom: "0px",
      //       opacity: "0.9",
      //       zIndex: 99999
      //     }
      //   }
      // ]
    ],  
    // markdown: {
    //   // markdown-it-anchor 的选项
    //   anchor: { permalink: false },
    //   // markdown-it-toc 的选项
    //   toc: { includeLevel: [1, 2] },
    //   extendMarkdown: md => {
    //     console.log('>>>>>>>>进来一　>>>>>')
    //     const id = setInterval(() => {
    //       const render = md.render;
    //       if (typeof render.call(md, '') === 'object') {
    //         md.render = (...args) => {
    //           let result = render.call(md, ...args);
    //           const { template, script, style } = renderDemoBlock(result.html);
    //           result.html = template;
    //           result.dataBlockString = `${script}\n${style}\n${result.dataBlockString}`;
    //           return result;
    //         }
    //         clearInterval(id);
    //       }
    //     }, 10);
    //   }
    // },
    // chainMarkdown(config) {
    //   console.log('>>>>>>>>进来二　>>>>>')
    //   config.plugin('containers')
    //     .use(demoBlockContainers({
    //       component: 'demoBlock'
    //     }))
    //     .end();
    // },
  chainWebpack: (config, isServer) => {
    // config 是 ChainableConfig 的一个实例
    // console.log('config >> ', config)
    // config.module.rule('md')
    //   .test(/\.md$/)
    //   .use('vmd-loader')
    //   .loader(require.resolve('./rules/vmd-loader/index'))
    //   .options({
    //     enforce: "pre",
    //     importLoaders: 1
    //   })
    //   .end()
  }
}