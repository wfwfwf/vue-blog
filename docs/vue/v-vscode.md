---
title: vscode代码块
date: 2017-09-09
sidebar: 'auto'
categories:
 - vue
tags:
 - vue
 - vscode
publish: true
---

eslimt:
首选项－> 设置
```
{
    "editor.quickSuggestions": {
        "strings": true
    },
    "vetur.format.defaultFormatter.html": "js-beautify-html",
    "explorer.confirmDelete": false,
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
        "language": "html",
        "autoFix": true
        },
        {
        "language": "vue",
        "autoFix": true
        }
    ]
}
```


vue 代码块　
```
{
  "Print to console": {
    "prefix": "vue",
    "body": [
      "<template>",
      "  <div>\n",
      "  </div>",
      "</template>\n",
      "<script>",
      "export default {",
      "  data() {",
      "    return {\n",
      "    }",
      "  },",
      "  created() {\n",
      "  },",
      "  mounted() {\n",
      "  },",
      "  methods: {\n",
      "  }",
      "};",
      "</script>\n",
      "<style lang=\"${1:scss}\">\n",
      "</style>\n",
    ],
    "description": "Create vue template"
  }
}
```