const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const router = require('./routers/index');
const logger = require('koa-logger');
const body = require('koa-body');
const { join } = require('path');

//生成koa实例
const app = new Koa;


//挂载
app
    .use(logger()) //注册日志模块 打印日志 主要是服务器请求与响应所耗费的时间和内存 必须放在前面
    .use(static(join(__dirname, "public"))) //配置静态资源目录
    .use(views(join(__dirname, "views"), { //配置视图模板
        extension: "pug"
    }))
    .use(body()) // 配置koa-body 处理post请求数据


app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, () => {
        console.log("服务器已启动");
    })