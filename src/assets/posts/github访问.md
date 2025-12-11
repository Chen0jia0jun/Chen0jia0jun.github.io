---
title: "GitHub访问指北"
createdAt: "2025-12-01T10:30:00"
updatedAt: "2025-12-11T14:20:00"
---
# GitHub流畅访问


1.挂梯子

2.watt加速器（但有时候会挂）

3.fastgithub软件（但没效果...）

4.修改host配置文件```C:\Windows\System32\drivers\etc\hosts```，随后清理DNS缓存```ipconfig /flushdns```

```
访问 https://www.ipaddress.com/website/assets-cdn.github.com/
获取到如下几个域名的IP地址，随后配置在hosts文件中
assets-cdn.github.com
github.global.ssl.fastly.net
github.com

eg：
140.82.112.3       github.com
151.101.1.194      github.global.ssl.fastly.net
185.199.108.153    assets-cdn.github.com
```

没啥用，但至少知道了steam++（或者说watt加速器）的工作原理是配置hosts文件，将steam或者GitHub等网站的IP地址指向本地127.0.0.1，随后分发到CDN加速节点，绕过原本的DNS解析，实现加速访问。并且hosts配置文件，对于同一个域名的多个配置，只有最后一行有效，它并不会有轮询等高级功能

