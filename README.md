#express-demo

###简介

本demo结合一些常用组件(如session/mysql等)构建一个简单的demo,作为自己在不断的学习、踩坑中的反思总结,也希望能够帮助一些小白。

###使用组件及作用介绍如下:

- express-session,浏览器会话管理
- connect-redis,redisSession存储方案
- mysql,数据库组件
- log4js,日志组件
- nodemon,热启


###redis服务端安装
redis需要安装服务端,express中创建客户端建立连接,从而使用redis进行session会话存储
(redis官网)[http://redis.io/download]
(mac环境下安装:)[http://www.jianshu.com/p/6b5eca8d908b]
(Linux&windows)[http://www.runoob.com/redis/redis-install.html]

###最喜欢的一句话
技术和工具永远只是实现想法的手段,工具可能会被更好的工具替代,但思考本身却需要自己不断地更新完善