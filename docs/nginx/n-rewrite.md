---
title: nginx反向代理
date: 2017-08-09
sidebar: 'auto'
categories:
 - nginx
tags:
 - nginx反向代理
 - nginx rewrite
publish: true
---

使用nginx做反向代理的时候，可以简单的直接把请求原封不动的转发给下一个服务。设置proxy_pass请求只会替换域名，如果要根据不同的url后缀来访问不同的服务，则需要通过如下方法：

方法一：加"/"
```
server {
    listen              8000;
    server_name         abc.com;
    access_log  "pipe:rollback /data/log/nginx/access.log interval=1d baknum=7 maxsize=1G"  main;

    location ^~/user/ {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://user/;
    }

    location ^~/order/ {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://order/;
    }
}
```

^~/user/表示匹配前缀是user的请求，proxy_pass的结尾有/， 则会把/user/*后面的路径直接拼接到后面，即移除user。

方法二：rewrite
```
upstream user {
  server localhost:8089 weight=5;
}
upstream order {
  server localhost:8090 weight=5;
}

server {
    listen              80;
    server_name  abc.com;
    access_log  "pipe:rollback /data/log/nginx/access.log interval=1d baknum=7 maxsize=1G"  main;

    location ^~/user/ {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        rewrite ^/user/(.*)$ /$1 break;
        proxy_pass http://user;
    }

    location ^~/order/ {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        rewrite ^/order/(.*)$ /$1 break;
        proxy_pass http://order;
    }
}
```

proxy_pass结尾没有/， rewrite重写了url。