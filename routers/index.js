const Router = require('koa-router');
//拿到操作user集合的操作对象
const user = require('../controller/user');

const router = new Router;


/**
 * 用户的操作  /user
 * 注册       /user/login
 * 登陆       /user/reg
 * 退出       /user/logout
 * 
 * restful路由风格
 * 新增用户信息   POST    >  /user  ->新增用户信息的方法 
 * 删除用户信息   DELETE  >  /user  ->删除用户信息的方法  需要带上用户的id
 * 修改用户信息   PUT  >  /user  ->修改用户信息的方法
 * 查询用户信息   GET     >  /user  ->查询用户信息的方法
 * 
 * 超级管理员对用户的操作
 * 删除 某一 id用户
 * 新增 一个 用户
 * 
 */


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
// router.get(/^\/user\/(?=reg|login)/, async ctx => {
//     //show 为true时显示注册 false显示登陆  
//     const show = /reg$/.test(ctx.path);
//     await ctx.render('register', {
//         show
//     })
// })

// //处理用户的登陆请求 post
// router.post('/user/login', async ctx => {
//     const data = ctx.request.body
//     console.log(data);

// })

// //处理用户的注册请求 post
// router.post('/user/reg', user.reg)



module.exports = router;