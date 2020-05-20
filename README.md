# easy-blog
个人简单博客

##项目部署
####1. 在GitHub上新建一个仓库
####2. 将新建的项目克隆到本地
```shell
  git clone [项目地址]
```
####3. 设置需要忽略上传的文件夹或文件
在项目文件的根目录下 右键打开git bash 并输入命令
```shell
  vim .gitignore 或 touch .gitignore
```
>按`i`键切换到编辑状态，输入规则，例如`/node_modules`，然后按`Esc`键退出编辑，输入`:wq`保存退出

其他详情请前往`https://www.jianshu.com/p/699ed86028c2`
*说明*  
>.gitignore文件是用来设置在上传文件时忽略指定文件或文件夹
>这里需要忽略`node_modules`文件夹和`package-lock.json`文件
>原因：
>1.`node_modules`文件夹是各种包和所需的依赖 体积过大
>2.`package-lock.json`文件是配置文件 不上传是担心与其他文件冲突 只需要`package.json`文件就够了
>解决方法
>只需要在当前路径下打开`power shell`窗口输入`npm i`命令即可

##开发阶段
####1. 在从GitHub上克隆到本地的文件夹中初始化文件夹
打开`power shell`窗口并输入如下命令
```shell
  npm init -y
```
  注意：文件夹的名称不能是中文名 最好不要用驼峰命名 会出现警告 可以使用-来区分语义

####2. 使用koa创建一个node服务
#####2.1 需要安装的框架和模块
>**使用框架** 
>`koa`  
>**模块/包** 
>`koa-static`   设置静态资源目录
>`koa-views`    渲染视图模板
>`koa-router`   路由
>`koa-logger`   日志
>`koa-body`     用于处理post请求
>`path`         文件路径拼接
>**数据库**
>`mongodb`      非关系型数据库
>`mongoose`     对mongodb的进一步封装

#####2.2 创建node服务
新建一个app.js文件作为项目的入口运行文件
```js
//引入模块
const Koa = require('koa');
//实例化对象
const app = new Koa;
//访问路径
app.use('/',ctx=>{
  ctx.body = "<h1>hello world</h1>"
})
//监听端口
app.listen(3000,()=>{
  console.log('服务器已启动在3000端口');
})
```
####3. 路由的划分及路由的设置
#####3.1 将路由抽离出来并存放在一个文件夹中
#####3.2 创建一个`routers.js`文件作为主路由
#####3.3 设置动态路由 主要用来出来处理用户登录 注册 退出 通过 `:id`  这个`id`是变量

######基本思路
> * 用户的操作  /user
> * 注册       /user/login
> * 登陆       /user/reg
> * 退出       /user/logout
> * 
> * restful路由风格
> * 新增用户信息   POST    >  /user  ->新增用户信息的方法 
> * 删除用户信息   DELETE  >  /user  ->删除用户信息的方法  需要带上用户的id
> * 修改用户信息   PUT  >  /user  ->修改用户信息的方法  需要带上用户的id
> * 查询用户信息   GET     >  /user  ->查询用户信息的方法  需要带上用户的id
> * 
> * 超级管理员对用户的操作
> * 删除 某一 id用户
> * 新增 一个 用户

主路由
>用于渲染主页面

用户登陆注册路由
>因为用户的注册和登陆是在同一个页面 用选项卡进行切换 这里就用正则来匹配路由
>