---
title: "nvm的使用"
createdAt: "2026-01-29T14:54:00"
updatedAt: "2025-01-29T14:54:00"
tags: [Front]
---


# nvm的使用
安装软件时遇到了npm没有安装成功的情况，报错提示在访问GitHub时连接中断，需要我手动下载。

在网上查找发现我应该设置nvm的安装源（虽然我以前肯定也设置过了，但不知道为什么没用了）。

在nvm的安装目录下，找到setting.txt文件，在里面添加如下内容即可。

```text
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

