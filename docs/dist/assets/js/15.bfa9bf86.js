(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{817:function(t,n,a){"use strict";a.r(n);var e=a(5),r=Object(e.a)({},(function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"物理像素线（也就是普通屏幕下-1px-，高清屏幕下-0-5px-的情况）采用-transform-属性-scale-实现。"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#物理像素线（也就是普通屏幕下-1px-，高清屏幕下-0-5px-的情况）采用-transform-属性-scale-实现。"}},[t._v("#")]),t._v(" 物理像素线（也就是普通屏幕下 1px ，高清屏幕下 0.5px 的情况）采用 transform 属性 scale 实现。")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v(".mod_grid {\n    position: relative;\n    &::after {\n        // 实现1物理像素的下边框线\n        content: '';\n        position: absolute;\n        z-index: 1;\n        pointer-events: none;\n        background-color: #ddd;\n        height: 1px;\n        left: 0;\n        right: 0;\n        top: 0;\n        @media only screen and (-webkit-min-device-pixel-ratio: 2) {\n            -webkit-transform: scaleY(0.5);\n            -webkit-transform-origin: 50% 0%;\n        }\n    }\n    \n}\n")])])]),a("h3",{attrs:{id:"对于需要保持高宽比的图，应改用-padding-top-实现"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#对于需要保持高宽比的图，应改用-padding-top-实现"}},[t._v("#")]),t._v(" 对于需要保持高宽比的图，应改用 padding-top 实现")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v(".mod_banner {\n    position: relative;\n    padding-top: percentage(100/750); // 使用padding-top\n    height: 0;\n    overflow: hidden;\n    img {\n        width: 100%;\n        height: auto;\n        position: absolute;\n        left: 0;\n        top: 0; \n    }\n}\n")])])]),a("h3",{attrs:{id:"css-画波浪线边框"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#css-画波浪线边框"}},[t._v("#")]),t._v(" css 画波浪线边框")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v(".ss {\n  margin: auto;\n\twidth: 400px;\n\theight: 200px;\n\tborder-bottom: none;\n\tbackground: radial-gradient(circle at 50% 50%, #ccc 0, #ccc 50%, transparent 0), radial-gradient(circle at 50% 50%, #ccc 0, #ccc 50%, transparent 0);\n\tbackground-repeat: repeat-y;\n\tbackground-color: white;\n\tbackground-size: 40px 40px;\n\tbackground-position: -20px 100px, 380px 100px;\n}\n")])])]),a("h3",{attrs:{id:"心型的样式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#心型的样式"}},[t._v("#")]),t._v(" 心型的样式")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v(".heart{\n\twidth: 10px;\n\theight: 10px;\n\tposition: fixed;\n\tbackground: #f00;\n\ttransform: rotate(45deg);\n\t-webkit-transform: rotate(45deg);\n\t-moz-transform: rotate(45deg);\n}\n.heart:after, .heart:before{\n\tcontent: '';\n\twidth: inherit;\n\theight: inherit;\n\tbackground: inherit;\n\tborder-radius: 50%;\n\t-webkit-border-radius: 50%;\n\t-moz-border-radius: 50%;\n\tposition: absolute;\n}\n.heart:after{\n\ttop: -5px;\n}\n.heart:before{\n\tleft: -5px;\n}\n")])])]),a("h3",{attrs:{id:"文字颜色跑动"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#文字颜色跑动"}},[t._v("#")]),t._v(" 文字颜色跑动")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v('.text {\n    font-family: 华文行楷, "font-weight bolder";\n    max-width: 15rem;\n    color: transparent;\n    background: -webkit-linear-gradient(45deg, rgb(112, 247, 254), rgb(251, 215, 198), rgb(253, 239, 172), rgb(191, 181, 221), rgb(190, 213, 245)) text;\n    animation: 20s linear 0s infinite normal none running run;\n}\n')])])])])}),[],!1,null,null,null);n.default=r.exports}}]);