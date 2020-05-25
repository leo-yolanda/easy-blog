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
    }
}, { versionKey: false })

module.exports = UserSchema;