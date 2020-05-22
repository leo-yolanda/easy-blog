const Router = require('koa-router');
//拿到操作user集合的操作对象
const {
    reg,
    login,
    keepLog,
    logout
} = require('../controller/user');

const router = new Router;


//主页
//user.keepLon 保持用户的登陆状态
router.get('/', keepLog, async ctx => {
    await ctx.render("index", {
        title: '个人博客',
        session: ctx.session
    })
})

//设置动态路由 主要用来出来处理返回用户登录 注册 
router.get(/^\/user\/(?=reg|login)/, async ctx => {
    //show 为true时显示注册 false显示登陆  
    const show = /reg$/.test(ctx.path);
    await ctx.render('register', {
        show
    })
})

//处理用户的登陆请求 post
router.post('/user/login', login);

//处理用户的注册请求 post
router.post('/user/reg', reg);

//用户退出
router.get('/user/logout', logout);

module.exports = router;