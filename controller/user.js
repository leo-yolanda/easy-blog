const mongoose = require('mongoose');
const { db } = require('../Schema/config');
const UserSchema = require('../Schema/user');
const enctry = require('../util/crypto.js');

const User = mongoose.model('users', UserSchema);

exports.reg = async ctx => {
    // console.log('这是注册中间件');
    //用户注册时通过post请求发送数据
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    console.log(username);
    console.log(password);

    //这里是异步的
    //查询并判断用户注册的用户名是否存在
    await new Promise((reslove, reject) => {
            //查询user数据库
            User.find({ username }, (err, data) => {
                if (err) return reject(err);
                //判断用户名在数据库是否存在
                if (data.length !== 0) {
                    //用户名已存在
                    return reslove("")
                }
                //用户名不存在 则保存到数据库 enctry 密码进行加密
                const _user = new User({
                    username,
                    password: enctry(password)
                })
                _user.save((err, data) => {
                    if (err) {
                        //保存失败
                        reject(err);
                    } else {
                        //保存成功
                        reslove(data)
                    }
                })
            })
        })
        //成功的状态 用户名存在 用户名保存成功  reslove
        .then(async data => {
            if (data) {
                //注册成功
                await ctx.render('isOk', {
                    status: "注册成功"
                })
            } else {
                //用户名已存在
                await ctx.render('isOk', {
                    status: "用户名已存在"
                })
            }
        })
        .catch(async err => {
            await ctx.render('isOk', {
                status: "注册失败 请重试"
            })
        })

}