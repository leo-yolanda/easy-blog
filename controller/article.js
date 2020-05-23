const Article = require('../models/article');

//渲染文章发表页面
exports.addArticle = async ctx => {
    await ctx.render('add-article', {
        title: '发表文章页面',
        session: ctx.session

    })
}

//提交发表信息(保存到数据库)
exports.add = async ctx => {
    // console.log(ctx.session.isNew);
    //用户未登录
    if (ctx.session.isNew) {
        //true 未登录状态 不需要查询数据库
        return ctx.body = {
            msg: '您还未登录 请登陆后再发表',
            status: 0
        }
    }
    //用户已登录
    const data = ctx.request.body;
    // console.log(data);

    //schema中有title content tips 只有author没有 
    //添加作者
    data.author = ctx.session.username;

    await new Promise((reslove, reject) => {
            new Article(data).save((err, data) => {
                if (err) return reject(err)
                reslove(data)
            })
        })
        .then(data => {
            ctx.body = {
                msg: '发表成功',
                status: 1
            }
        })
        .catch(err => {
            ctx.body = {
                msg: '发表失败',
                status: 0
            }
        })
}