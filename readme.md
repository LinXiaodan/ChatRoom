# 聊天室
## 结合koa和WebSocket完成的一个Web的实时聊天室

### 依赖
- ws: 在node.js中使用的WebSocket模块
- koa: 基于Node.js的web框架
    - koa-router: middleware, 处理URL映射
    - koa-bodyparser: middleware, 解析request中的参数
    - koa-static: middleware, 处理静态文件请求
- nunjucks: 模板引擎，基于模板配合数据构造出字符串输出的一个组件

### 结构
- controllers: URL处理函数
    - index.js: GET方法，路径为'/'
    - signin.js: GET方法， 路径为'/signin'； POST方法，路径为'/signin'； GET方法，路径为'signout'
- static: 静态资源文件
- views: html模板文件
    - base.html: 主模板
    - room.html: 聊天界面
    - signin.html: 登录界面
- app.js: 使用koa的js
- controller.js: 扫描指定文件夹（controllers）中的js文件， 注册请求处理
- package.json: 项目描述
- templating.js: 模板引擎（nunjucks）入口

### 使用步骤
1. 安装依赖
```
    npm install
```
2. 安装Vue
```
    sudo npm install --global vue
```
3. 运行
```
    npm start
```
4. 浏览器访问 http://localhost:3000