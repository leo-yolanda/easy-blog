const { Comment } = require('../models/comments');
const { Article } = require('../models/article');
const { User } = require('../models/user');

//发表并保存文章评论
exports.addCom = async ctx => {
    let message = {
        status: 0,
        //验证用户是否登录
        msg: '你还未登录，请登陆后再发表评论'
    };
    if (ctx.session.isNew) return ctx.body = message;

    //用户已登录
    const data = ctx.request.body;
    //获取当前用户登陆的id
    data.from = ctx.session.uid;

    const _comment = new Comment(data);

    await _comment
        .save({})
        .then(data => {
            message = {
                status: 1,
                msg: '评论成功'
            };

            //更新当前评论文章的计数器
            //更新评论数量
            Article.updateOne({
                _id: data.article
            }, {
                //$inc原子操作 自增
                $inc: { commentNum: 1 }
            }, err => {
                if (err) return console.log(err);
                console.log('计数器更新成功');
            });

            // console.log(data);

            //更新用户的评论的计数器
            User.updateOne({
                _id: data.from
            }, {
                $inc: { commentNum: 1 }
            }, err => {
                if (err) return console.log(err);
            });


        })
        .catch(err => {
            message = {
                status: 0,
                msg: err
            }
        })
    ctx.body = message;
};

//后台获取用户的所有文章
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
    //评论id
    const commentId = ctx.params.id;
    //文章id  delete请求与post基本相同
    const articleId = ctx.request.body.articleId;
    //用户id
    const uid = ctx.session.uid;

    console.log('评论id ' + commentId);
    console.log('文章id ' + articleId);
    console.log('用户id ' + uid);

    //让文章的计数器减一
    // await Article
    //     .updateOne({ _id: articleId }, {
    //         $inc: {
    //             commentNum: -1
    //         }
    //     })
    //     //用户文章的计数器减一
    // await User
    //     .updateOne({ _id: uid }, {
    //         $inc: {
    //             commentNum: -1
    //         }
    //     })


    //删除评论
    let isOk = false;
    await Comment
        .deleteOne({
                _id: commentId
            },
            err => {
                if (err) isOk = false;
                if (isOk) {
                    ctx.body = {
                        state: 1,
                        message: '删除成功'
                    }


                }
            })
};