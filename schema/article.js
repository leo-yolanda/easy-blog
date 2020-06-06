//生成文章的schema对象
const mongoose = require('mongoose');
const { Schema } = require('./config');
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new mongoose.Schema({
    title: String,
    content: String,
    //关联users集合  author: String
    author: {
        //每次插入必须是以一个id
        type: ObjectId,
        //关联users集合
        ref: 'users',
    },
    tips: String, //标签
    commentNum: Number, //用于计算文章评论数量的字段
    articleNum: Number,
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created' //自动添加创建时间和更新时间
    }
})

//后台删除文章
ArticleSchema.post('remove', (doc) => {
    //当前的save一定会在remove事件之前触发
    // console.log("⬇");
    // console.log(doc);

    const Comment = require('../models/comment');
    const User = require('../models/user');

    const { _id: artId, author: authorId } = doc;

    //对应用户文章数-1
    User
        .findByIdAndUpdate(
            authorId,
            {
                $inc: {
                    articleNum: -1
                }
            })
        .exec()

    //把当前需要删除的文章所关联的而所有评论 一次调用评论 remove
    Comment
        .find({
            article: artId
        })
        .then(data => {
            data.forEach(v => v.remove())
        })
})

module.exports = ArticleSchema;