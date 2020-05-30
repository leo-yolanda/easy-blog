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

module.exports = commentSchema;