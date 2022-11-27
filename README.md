# express-demo

### 简介

node项目下各种功能研发实验，提供Demo

### 功能点
1. WebShell
    - 热键支持-Ctrl F全屏切换、⌘ F终端检索，⌘ K清屏、Ctrl C执行取消
    - 终端会话录制-日志功能
    - 全文检索
    - 文件编辑
    - ZModem集成
2. code-server-web代理
   - 不需要直接开放web端口到外网，利用SSH隧道代理访问内网web编辑器服务

### code-server源码拉取

```shell

git clone git@github.com:coder/code-server.git  --single-branch main

```

## 终端会话录制
清屏操作触发，录制日志中内容并不同步清除
