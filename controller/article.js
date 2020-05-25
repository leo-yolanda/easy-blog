const { Article } = require('../models/article');
const { Comment } = require('../models/comments')

//获取用户的schema 拿到操作users集合的实例对象


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
    //添加作者  存uid 
    // data.author = ctx.session.username;
    data.author = ctx.session.uid;

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
        .populate('authors', 'username')
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

    console.log(comments);


    await ctx.render('article', {
        title: article.title,
        article,
        session: ctx.session,
        comments
    })
}