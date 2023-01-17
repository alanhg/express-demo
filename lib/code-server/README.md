> 目标机器一键安装code-server,同时代理访问web


## 方案

### SSH代理
1. 目标服务器只需要开放SSH端口
2. 服务端SSH连接目标服务器，构建HTTP代理，访问内网code-server

目前的缺点是代码中实现SSH连接，总会出现超时断连问题

## HTTP代理
1. 目标服务器开放code-server的web端口
2. 服务端构建HTTP代理，访问code-server

目前的缺点是目标服务器的code-server与服务端需要解决安全问题。

简单方案是code-server开启密码认证，服务端页面可以自动登录，从效果上看体现成免密登录即可。

## code-server安装原理

1. SSH连通目标机器，用于执行命令
2. SSH方式检测/安装/启动 code-server

## 好处

1. 一键脚本安装/运行code-server
2. 动态代理多台code-server，服务可控/登录/安全均可走业务实现

## code-server宿主机硬件最低要求

- 1 GB of RAM
- 2 CPU cores

https://github.com/coder/code-server/blob/main/docs/requirements.md

## 宿主机网络要求

1. SSH-22端口对外或者对代理机器开放
2. 云机器本身的安全策略，比如需要对代理服务端网络开放


## 登录密码

1. 默认启动后登录会有密码保护， cat ~/.config/code-server/config.yaml
2. 除了密码登录，也可以通过设置做到免密登录`code-server --auth none`

## 定制化

定制化有几个方法，用于解决特定问题。

1. code-server启动配置文件/启动脚本
   ~/.config/code-server/config.yaml
2. 编辑器URL可以携带一些状态参数，比如folder
3. 用户设置配置文件
   ~/.local/share/code-server/User/settings.json
4. CSS/JS源码修改
5. code-server拓展插件

### 菜单栏

"window.menuBarVisibility": "classic"

![https://i.imgur.com/9bBHUAa.jpg](https://i.imgur.com/9bBHUAa.jpg)


### 国际化
https://github.com/Microsoft/vscode-loc

code-server --install-extension ms-ceintl.vscode-language-pack-zh-hans

配置所在位置
~/.local/share/code-server/User/argv.json

![https://i.imgur.com/fns2NYn.jpg](https://i.imgur.com/fns2NYn.jpg)


### 命令中心

![https://i.imgur.com/tDubXca.jpg](https://i.imgur.com/tDubXca.jpg)

"window.commandCenter": true

### logo

workbench.web.main.css内联SVG，修改的话，需要源码修改

### favicon.ico


### app-name

目前没有设置支持，需要源码层面解决


### 后台运行

#### 系统服务

服务形式启动问题是需要root用户权限来控制

```shell
# 服务化code-server，自定义端口,端口修改还有一个办法是 ~/.config/code-server/config.yaml修改缺省配置值

cat > /usr/lib/systemd/system/code-server.service << EOF
[Unit]
Description=code-server
After=network.target

[Service]
Type=exec
ExecStart=/usr/bin/code-server --bind-addr=0.0.0.0:8090
Restart=always
User=%i

[Install]
WantedBy=default.target
EOF
```
服务创建需要root权限，但查看服务状态不需要

#### supervisord

需要安装并启动对应进程-[安装脚本](https://github.com/alanhg/express-demo/blob/3cae43c6020e9d15c71882e6bb5e31025ff5bbaf/lib/code-server/model/install-package-supervisor.sh#L13-L13)


服务关闭：`pkill -f "supervisord-conf"`
服务查询：`ps -ef | grep supervisord-conf`

### URL可携带参数

- folder
- workspace

### 主题

配置该值即可。

```
"workbench.colorTheme": "Default Dark+"
```





## Code-Server升级

code-server配置文件位置在`~/.local/share/code-server`，与程序安装位置不同，因此升级安装不会造成配置丢失等。
https://coder.com/docs/code-server/latest/upgrade


## CDN
1. 代理请求时只针对HTML文件进行静态资源替换，切换为CDN源，替换80%体积占比
2. 源码修改
   - 编辑器页面`lib/vscode/out/vs/code/browser/workbench/workbench.html`
   - 登录页面`src/browser/pages/login.html`
   - `WORKBENCH_WEB_BASE_URL`为静态变量，控制静态资源地址。

## 加载速度

1. 测试发现加载出页面内容需要3s-6s



## 自动登录

除了使用SSO方案外，最简单的方案是读取`~/.config/code-server/config.yaml`，填充表单，自动提交，实现自动登录。为了给用户营造出自动登录，可以将登陆页面隐藏，JS操作自动提交即可。

缺点是浏览器针对表单提交会自动弹出保存密码窗体，为了优化体验可以修改登录页面`src/browser/pages/login.html`，增加`autocomplete="off"`

```html
<form class="login-form" method="post" autocomplete="off">
```

注意，Safari下不work。
