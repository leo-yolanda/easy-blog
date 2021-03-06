const Article = require('../models/article');
const Comment = require('../models/comments');
const User = require('../models/user');


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
    // console.log(data); //这里的data是获取发表文章的tips title content

    //schema中有title content tips 只有author没有 
    //添加作者  存uid 
    // data.author = ctx.session.username;
    data.author = ctx.session.uid;

    //用户评论文章的数量
    data.commentNum = 0
    //用户发表文章的数量
    data.articleNum = 0

    await new Promise((reslove, reject) => {
        new Article(data).save((err, data) => {
            if (err) return reject(err)

            //更新当前用户文章的数量
            //这里的data是获取文章的_id tips title content author commentNum articleNum created updatedAt
            // console.log(data);
            User.updateOne({
                _id: data.author
            }, {
                $inc: { articleNum: 1 }
            }, err => {
                if (err) return console.log(err);

            })
            // console.log(data);
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

//获取文章列表
exports.getList = async ctx => {
    //查询每篇文章对应的作者的头像

    //分页
    //获取动态路由的id值  默认第一页
    let page = ctx.params.id || 1;
    page--

    //获取最大文章数量 计算从后台拿到的数据的长度  estimatedDocumentCount用于获取数据库集合中的总数
    const maxNum = await Article.estimatedDocumentCount((err, num) => {
        err ? console.log(err) : num
    })
    // console.log(maxNum);


    //需要回调才会执行 2种方法 1.回调  2.exec 3.then
    const artList = await Article
        .find() //查询
        .sort('-created') //倒序排序  原子操作  根据创建时间排序
        .skip(5 * page) // 没进行下一页跳过前面的内容
        .limit(5) //筛选当前5条
        .populate({
            path: 'author', //指向对应的集合
            select: 'username _id avatar' //获取username _id avatar
        }) // mongoose 用于连表查询
        .then(data => data)
        .catch(err => err)

    // console.log(artList);
    // console.log(ctx.session);

    await ctx.render('index', {
        session: ctx.session,
        title: '个人博客',
        artList,
        maxNum
    })
}

//文章详情页
exports.details = async ctx => {
    //获取动态路由的id
    const _id = ctx.params.id;
    //查找所点击的文章的详细信息
    const article = await Article
        .findById(_id)
        //连表查询
        .populate('author', 'username')
        .then(data => data)
        .catch(err => err)

    // console.log(ctx.session);

    //查找跟当前文章相关联的所有评论
    const comments = await Comment
        .find({ article: _id }) //通过文章的id值查找
        .sort('-created') //根据评论时间倒序
        .populate('from', 'username avatar')
        .then(data => data)
        .catch(err => err)

    // console.log(comments);


    await ctx.render('article', {
        title: article.title,
        article,
        session: ctx.session,
        comments
    })
}

//后台获取普通用户的所有文章
exports.artList = async ctx => {
    const uid = ctx.session.uid;

    const data = await Article.find({ author: uid })
    // console.log(data);

    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

//后台删除对应id的普通用户的文章
exports.delart = async ctx => {

    //schema中有可以对多个集合关联进行处理的钩子函数
    //只需要在schema的钩子函数写好对应的操作 
    //比如删除一篇文章 同时删除文章对应的评论 评论的用户对这篇文章的评论数减一
    //然后在这里进行删除操作就行

    //获取文章id
    const _id = ctx.params.id

    let res = {
        state: 1,
        message: "文章删除成功"
    }

    //官方说明findByIdAndRemove或者其他and操作是不会触发钩子函数的
    //他是直接操作数据库 他绕过了mongoose的监听 操作数据库的实力对象都监听不了
    // Comment.findByIdAndRemove(commentId).exec()

    //通过构造函数生成的具体的文档对象(类json)
    //只能通过这种方式才可以触发钩子函数
    // new Comment({}).remove()

    await Article
        .findById(_id)
        .then(data => {
            // console.log(data);
            data.remove()
        })
        .catch(err => {
            state: 0;
            message: err
        })

    ctx.body = res

    {
        //这种写法太麻烦了 可以使用schema的钩子函数
        /*
        let uid;
        let res = {};
        
        //删除文章 先找后删
        await Article
        .deleteOne({ _id })
        // .exec((...r)=>{
            // console.log(r); }) //[ null, { n: 1, ok: 1, deletedCount: 1 } ]
            .exec(async err => {
                if (err) {
                    res = {
                        state: 0,
                        message: "删除失败"
                    }
                } else {
                    //查找用户id
                    await Article
                    .findById({ _id })
                    .then(data => {
                        uid = data.author
                    })
                }
            })
            //用户 articleNum -= 1
            await User.updateOne({
                _id: uid
            }, {
                $inc: {
                    articleNum: -1
                }
            })
            //删除文章对应的所有评论
            await Comment.findOne({
                article: _id
            }).then(
                async data => {
                    //data => array
                    let len = data.length;
                    let i = 0;
                    
                    async function deleteUser() {
                        if (i >= len) return
                        const cId = data[i]._id
                        //被删除评论对应的用户表里 commentId -= 1
                        await Comment.deleteOne({
                            _id: cId
                        })
                        .then(data => {
                            User.updateOne({
                                _id: data[i].from
                            }, {
                                $inc: {
                                    commentNum: -1
                                }
                            }, err => {
                                if (err) return console.log(err);
                                i++;
                            })
                        })
                    }
                    deleteUser();
                    
                    res = {
                        state: 1,
                        message: "删除成功"
                    }
                    
        })

        ctx.body = res*/
    }
}