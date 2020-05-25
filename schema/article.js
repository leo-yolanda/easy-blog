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
    tips: String
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created' //自动添加创建时间和更新时间
    }
})

module.exports = ArticleSchema;