# easy-blog

个人简单博客

##项目部署

####1. 在GitHub上新建一个仓库（前提已注册GitHub账号）

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

项目文件目录结构

>|- controller     控制器 用于处理路由操作的各种方法
>
>​   |-- user.js    处理用户注册登陆的方法
>
>​   |-- article.js    处理用户发表文章的方法
>
>|- databases      数据
>
>​   |-- db         数据库  用于存放数据的数据库
>
>|- node_modules   包/模块 所有用到的包 模块 依赖
>
>|- public         静态资源目录  主要存放图片 css js 文件
>
>|- routers        路由  
>
>   |--index.js    路由
>
>|- schema         模式  用于创建数据对象的模式
>
>   |-- config.js  数据库的配置
>
>   |-- user.js    处理用户的模式
>
>   |-- user.js    处理发表文章的模式
>
>|- util           工具
>
>   |-- crypto.js  加密工具 用于账户密码的加密
>
>|- views          视图模板
>
>|- .gitignore     设置使用git上传文件时忽略某些文件或文件夹
>
>|- app.js         项目的入口运行文件
>
>|- package-lock.json
>
>|- pageage.json   初始化文件时创建的文件 记录各种信息
>
>|- README.md      阅读文档 说明
>
>

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
>
>**模块/包** 
>`koa-static`   设置静态资源目录
>`koa-views`    渲染视图模板
>`koa-router`   路由
>`koa-logger`   日志
>`koa-body`     用于处理post请求
>`koa-session`  类似于前端的session 用于保存用户的登陆状态并返回给前端
>`path`         文件路径拼接  解构join用于配置静态资源目录和视图模板
>`crypto`       加密  用于对账号密码的加密
>
>**数据库**
>`mongodb`      非关系型数据库
>`mongoose`     对mongodb的进一步封装


数据库的连接与使用

1.连接

>在schema -> config.js下
>1.引入mongoose
>2.连接mongodb
>3.定义schema
>4.导出对象

2.使用

>在schema -> user.js 下
>实例化UserSchema对象并导出
>
>在controller -> user.js 下
>定义并导出在操作路由时的方法 




#####2.2 创建node服务

在根目录下新建一个app.js文件作为项目的入口运行文件

>配置相关的模块

####3. 路由的划分及路由的设置

#####3.1 划分用户的注册 登陆 退出 保持登录状态的路由

>1.设置动态路由 主要用来出来处理通过选项卡或者导航栏所选的返回用户 登录 或者 注册 的路由  这里使用正则匹配 
>2.处理用户注册路由 通过post请求获取用户名密码信息 先判断再连接数据库并查看是否已注册 此过程是异步的
>3.处理用户登陆路由 通过post请求获取用户名密码信息 先判断再连接数据库并查看是否已存在 存在则登陆成功 并且在渲染页面时设置cookie和session用于确定用户的登陆状态 和 保持用户的登陆状态
>4.保持用户的登陆状态路由 判断session是否存在 根据session的状态返回并设置状态
>5.处理用户退出路由 将cookie 和 session设置为null 并重定向到首页

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


#####3.2 划分发表文章的路由 以及文章关联用户集合

######划分发表文章的路由

>1.注册发表文章页面的路由 点击跳转到发表文章页面  此操作需要用户登录之后才能发表
>2.提交发表文章的信息 此操作是在用户已登陆的情况下进行
>

######文章关联用户集合

