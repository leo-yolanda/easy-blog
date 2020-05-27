const { Comment } = require('../models/comments');
const { Article } = require('../models/article');
const { User } = require('../models/user');

exports.addCom = async ctx => {
    //验证用户是否登录
    let message = {
        status: 0,
        msg: '你还未登录，请登陆后再发表评论'
    };
    if (ctx.session.isNew) return ctx.body = message;

    //用户已登录
    const data = ctx.request.body;
    //获取当前用户登陆的id
    data.from = ctx.session.uid;

    const _comment = new Comment(data);

    await _comment
        .save()
        .then(data => {
            message = {
                status: 1,
                msg: '评论成功'
            }

            //更新当前评论文章的计数器
            Article
            //更新评论数量
                .updateOne({
                _id: data.article
            }, {
                //$inc原子操作 自增
                $inc: { commentNum: 1 }
            }, err => {
                if (err) return console.log(err);
                console.log('计数器更新成功');

            })

            console.log(data);

            //更新用户的评论的计数器
            User.updateOne({
                _id: data.from
            }, {
                $inc: { commentNum: 1 }
            }, err => {
                if (err) return console.log(err);
            })
        })
        .catch(err => {
            message = {
                status: 0,
                msg: err
            }
        })
    ctx.body = message
}