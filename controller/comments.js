const Comment = require('../models/comments');
const Article = require('../models/article');
const User = require('../models/user');

//发表并保存文章评论
exports.addCom = async ctx => {
    let message = {
        status: 0,
        msg: '你还未登录，请登陆后再发表评论'
    };
    //验证用户是否登录
    if (ctx.session.isNew) return ctx.body = message;

    //用户已登录
    const data = ctx.request.body;
    //获取当前用户登陆的id
    data.from = ctx.session.uid;

    const _comment = new Comment(data);

    await _comment
        .save()
        .then(data => {
            // console.log(data);

            //更新当前评论文章的计数器
            //更新评论数量
            Article.update({
                _id: data.article
            }, {
                //$inc原子操作 自增
                $inc: { commentNum: 1 }
            }, err => {
                if (err) return console.log(err);
                console.log('评论计数器更新成功');
            });

            // console.log(data);

            //更新用户的评论的计数器
            User.update({
                _id: data.from
            }, {
                $inc: { commentNum: 1 }
            }, err => {
                if (err) return console.log(err);
                console.log('用户计数器更新成功');

            })

            message = {
                status: 1,
                msg: '评论成功'
            };
        })
        .catch(err => {
            message = {
                status: 0,
                msg: err
            }
        })
    ctx.body = message;
};

//后台查询用户的所有评论
exports.comlist = async ctx => {
    const uid = ctx.session.uid
    const data = await Comment
        .find({ from: uid })
        .populate('article title')

    ctx.body = {
        code: 0,
        count: data.length, //被评文章的数量 通过这个数量在admin-comment模板 再用layui的语法遍历
        data
    }
};

//后台删除对应用户id的评论
exports.delcom = async ctx => {
    const commentId = ctx.params.id;

    let res = {
        state: 1,
        message: "评论删除成功"
    }

    await Comment
        .findById(commentId)
        .then(data => {
            data.remove()
        })
        .catch(err => {
            res => {
                state: 0;
                message: err
            }
        })
    ctx.body = res

    {
        // const commentId = ctx.params.id;
        // let isOk = true;
        // let articleId, uid;

        // //查找当前评论信息
        // await Comment.findById(commentId, (err, data) => {
        //     // console.log(data);
        //     if (err) {
        //         // console.log(err);
        //         isOk = false;
        //         return
        //     } else {
        //         articleId = data.article;
        //         uid = data.from;

        //     }
        // });

        // //删除评论之后更新首页的评论数量
        // await Article.updateOne({ _id: articleId }, {
        //     $inc: { commentNum: -1 }
        // });

        // // await User.updateOne({ _id: uid }, {
        // //     $inc: { commentNum: -1 }
        // // });

        // await Comment.deleteOne({ _id: commentId });

        // if (isOk) {
        //     ctx.body = {
        //         state: 1,
        //         message: "删除成功"
        //     }
        // }
    }
};