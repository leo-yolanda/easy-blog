//生成schema对象
// const { Schema } = require('./config');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
}, { versionKey: false })

module.exports = UserSchema;