const Router = require('koa-router');
//拿到操作user集合的操作对象
//用户
const {
    reg, //注册
    login, //登录
    reglog, //登陆/注册
    keepLog, //保持登录状态
    logout, //退出
    uploadavatar, //后台头像上传
    users, //后台超级管理员用户管理
    deluser //后台管理员删除用户
} = require('../controller/user');
//文章
const {
    addArticle, //发表文章页面
    add, //发表提交文章
    getList, //文章首页和分页
    details, //文章详情页
    artList, //文章发表
    delart  //后台删除普通用户文章
} = require('../controller/article');
//评论
const {
    addCom, //发表评论
    comlist, //后台获取用户的所有评论
    delcom, //后台删除用户评论
} = require('../controller/comments');
//后台
const {
    index //首页
} = require('../controller/admin');

//头像上传工具
const upload = require('../util/upload');


const router = new Router;


//主页
//user.keepLon 保持用户的登陆状态 获取session的id和头像信息 文章所有列表
router.get('/', keepLog, getList);

//设置动态路由 主要用来出来处理返回用户登录 注册 
router.get(/^\/user\/(?=reg|login)/, reglog);

//处理用户的登陆请求 post
router.post('/user/login', login);

//处理用户的注册请求 post
router.post('/user/reg', reg);

//用户退出
router.get('/user/logout', logout);

//发表文章的页面  需要用户登录之后才能发表
router.get('/article', keepLog, addArticle);

//发表文章 提交
router.post('/article', keepLog, add);

//文章列表分页路由 动态路由  默认第一页
router.get('/page/:id', getList);

//文章详情页
router.get('/article/:id', keepLog, details);

//文章评论的发表
router.post('/comment', keepLog, addCom);

//后台管理路由
//文章 评论 头像上传
router.get('/admin/:id', keepLog, index);

//头像上传功能
router.post('/upload', keepLog, upload.single('file'), uploadavatar);

//后台获取普通用户的所有评论
router.get('/user/comments', keepLog, comlist);

//后台删除普通用户评论
router.delete('/comment/:id', keepLog, delcom);

//后台获取普通用户所有文章
router.get('/user/articles',keepLog,artList)

//后台删除普通用户的文章
router.delete('/article/:id', keepLog, delart);

//后台超级管理员对用户的管理
router.get('/user/users',keepLog,users);

//后台管理员删除用户
router.delete('/user/:id',keepLog,deluser);

//404
router.get('*', async ctx => {
    await ctx.render('404', {
        title: '不管你怎么找，这里没有你要的东西'
    })
})

module.exports = router;