const Koa = require('koa');
const static = require('koa-static');
const views = require('koa-views');
const router = require('./routers/index');
const logger = require('koa-logger');
const body = require('koa-body');
const { join } = require('path');
const session = require('koa-session');

//生成koa实例
const app = new Koa;

//用于签名的key值(密钥)
app.keys = ['剑心'];

//session的配置对像
const CONFIG = {
    key: 'Sid', //用于加密的签名
    maxAge: 36e5, //过期时间 1000*60*60  科学计数法
    overerite: true, //是否覆盖
    httpOnly: true, //
    // signed: true, //是否需要签名
    rolling: true //在访问的时候即将过期重新设置过期时间
}


//挂载
app
// .use(logger()) //注册日志模块 打印日志 主要是服务器请求与响应所耗费的时间和内存 必须放在前面
    .use(session(CONFIG, app)) //注册session 挂载app对象  保存对象
    .use(body()) // 配置koa-body 处理post请求数据
    .use(static(join(__dirname, "public"))) //配置静态资源目录
    .use(views(join(__dirname, "views"), { //配置视图模板
        extension: "pug"
    }))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, () => {
        console.log("服务器已启动");
    })


//创建管理员用户 如果管理员用户已存在 则返回
{
    const User = require('./models/user');
    const enctry = require('./util/crypto.js');

    //查找管理员用户是否存在
    User
        .find({ username: 'admin' })
        .then(data => {
            //管理员用户不存在
            if (data.length === 0) {
                //创建管理员用户
                new User({
                        username: 'admin',
                        password: enctry('admin'),
                        role: 666
                    })
                    .save()
                    .then(data => {
                        console.log(`管理员账户->admin 密码->admin`);
                    })
                    .catch(err => {
                        console.log(`保存失败`);
                    })
            } else {
                console.log(`用户名已存在 管理员账户->admin 密码->admin`);

            }
        })

}