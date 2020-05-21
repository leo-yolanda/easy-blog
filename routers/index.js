const Router = require('koa-router');
//拿到操作user集合的操作对象
const user = require('../controller/user');

const router = new Router;


//主页
router.get('/', async ctx => {
    await ctx.render("index", {
        title: '个人博客',
        session: {
            role: 0
        }
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
router.post('/user/login', async ctx => {
    const data = ctx.request.body
    console.log(data);

})

//处理用户的注册请求 post
router.post('/user/reg', user.reg)



module.exports = router;