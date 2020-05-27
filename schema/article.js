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

module.exports = ArticleSchema;