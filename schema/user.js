//生成用户的schema对象
// const { Schema } = require('./config');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    //默认头像 以文件的形式存储
    avatar: {
        type: String,
        default: '/avatar/default1.jpg'
    },
    //用户权限
    role: {
        type: String,
        default: 1 // 1 基础用户权限
    },
    // articleNum: Number,
    // commentNum: Number
    articleNum: {
        type: Number,
        default: 0
    }, //计算当前用户有多少篇文章
    commentNum: {
        type: Number,
        default: 0
    } // 计算文章评论数量
}, { versionKey: false })

module.exports = UserSchema;