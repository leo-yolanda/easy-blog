const { Comment } = require('../models/comments');

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
        })
        //更新当前评论文章的计数器
        .catch(err => {
            message = {
                status: 0,
                msg: err
            }
        })
    ctx.body = message
}