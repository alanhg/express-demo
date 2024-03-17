## 简介

node项目下各功能实验

## 功能点
1. WebShell
    - 热键支持-Ctrl F全屏切换、⌘ F终端检索，⌘ K清屏、Ctrl C执行取消
    - 文件编辑器-`Code-Server`, 目前采用的GitHub地址，挂载VPS需要网络通常
    - ZModem集成`szrz`
    - SFTP
    - 右键文件下载
    - 终端会话录制-`清屏操作触发，录制日志中内容并不同步清除`
    - 背景图设置-透明度支持
    - 终端图片显示
   
## code-server源码拉取

```shell

git clone git@github.com:coder/code-server.git  --single-branch main

```

## Code-Server

### 代理方案
- Web代理
- SSH代理
- WebSocket协议代理支持

### 操作

```shell
pkill -f ".term/code-server"
```

