//生成文章评论的schema对象
const mongoose = require('mongoose');
const { Schema } = require('./config');
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    //头像 用户名
    //文章
    //内容
    content: String,
    //关联用户集合
    from: {
        type: ObjectId,
        ref: 'users'
    },
    //关联article集合
    article: {
        type: ObjectId,
        ref: 'article'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created' //自动添加创建时间和更新时间
    }
})

{
    // //schema中的钩子函数的作用
    // //设置comment 的 remove 钩子 用于处理删除用户的评论
    // //当有删除行为就会触发这个钩子函数 每一个回调函数都是中间件
    // //pre 前置钩子  监听事件发生之前  先执行 可以绑定多个事件
    // commentSchema.pre("remove",function(next){
    //     //this指向当前集合 这里不能使用箭头函数 因为箭头函数没有this
    //     this
    //     next();//不调用next后面的中间件就不会执行
    // })
    // //post 后置钩子 处在删除事件之前  后执行(就算前面没有pre前置钩子也会后执行)
    // //没有中间件 用于接收前置钩子处理的各种操作
    // //document  要保存 操作的数据
    // commentSchema.post("save",(document));

    //设置comment 的 remove 钩子 用于处理删除用户的评论
    //**这个钩子牛逼的地方就是能监听所有的评论的文档所触发的都能够被监听 只需要写一次*/
}
commentSchema.post('remove', (doc) => {
    //当前的save一定会在remove事件之前触发
    // console.log("⬇");
    // console.log(doc);

    const Article = require('../models/article');
    const User = require('../models/user');

    const { from, article } = doc;

    //对应文章评论数-1
    Article
        .updateOne({
            _id: article
        }, {
            $inc: {
                commentNum: -1
            }
        })
        .exec()
    //当前被删除评论的作者的 commentNum -1
    User
        .updateOne({
            _id: from
        }, {
            $inc: {
                commentNum: -1
            }
        })
        .exec()


})


module.exports = commentSchema;