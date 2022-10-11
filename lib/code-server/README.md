> 目标机器一键安装code-server,同时代理穿透访问web


## 基本原理
1. SSH连通目标机器，用于执行命令
2. SSH方式检测/安装/启动 code-server
3. SSH方式启动目标机器代理服务，生成唯一识别代理服务的ID
4. 根据ID，走代理访问code-server服务

## 好处

1. 目标机器不需要对外开放code-server web端口
2. 用户一键安装code-server
3. 支持动态代理多台code-server，且可控，登录/安全均可走业务实现


## code-server宿主机硬件最低要求

- 1 GB of RAM
- 2 CPU cores

https://github.com/coder/code-server/blob/main/docs/requirements.md

## 宿主机网络要求

1. SSH-22端口对外或者对代理机器开放
2. 云机器本身的安全策略，比如需要对代理服务端网络开放


## 登录密码

1. 默认启动后登录会有密码保护， cat ~/.config/code-server/config.yaml
2. 除了密码登录，也可以通过设置做到免密登录

## 定制化

定制化有几个方法，用于解决特定问题。

1. code-server启动配置文件
   ~/.config/code-server/config.yaml
2. 用户设置配置文件
   ~/.local/share/code-server/User/settings.json
3. 缺省配置文件，需要源码修改
   defaultSettings.json
4. CSS/JS源码修改
5. code-server拓展

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


### 服务端口-名称

```shell
# 服务化code-server，自定义端口,端口修改还有一个办法是 ~/.config/code-server/config.yaml修改缺省配置值

cat > /usr/lib/systemd/system/code-server@.service << EOF
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

## Code-Server升级

code-server配置文件位置在`~/.local/share/code-server`，与程序安装位置不同，因此升级安装不会造成配置丢失等。
https://coder.com/docs/code-server/latest/upgrade

