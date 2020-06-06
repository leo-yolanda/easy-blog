const enctry = require('../util/crypto.js');

const User = require('../models/user');

//用户登陆/注册
exports.reglog = async ctx => {
    //show 为true时显示注册 false显示登陆  
    const show = /reg$/.test(ctx.path);
    await ctx.render('register', {
        show
    })
}

//处理用户注册
exports.reg = async ctx => {
    // console.log('这是注册中间件');
    //用户注册时通过post请求发送数据
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    // console.log(username);
    // console.log(password);

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

//处理用户登录
exports.login = async ctx => {
    //获取post数据
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;

    await new Promise((reslove, reject) => {
        User.find({ username }, (err, data) => {
            if (err) return reject(err);
            if (data.length === 0) return reject('用户名不存在')
            // console.log(data);
            // console.log(data[0].password === enctry(password));
            //判断密码是否相同 将输入的密码加密并于数据库中已经加密的密码比较
            if (data[0].password === enctry(password)) {
                return reslove(data); //成功
            }
            reslove(''); //失败
        })
    })
        .then(async data => {
            if (!data) {
                return ctx.render('isOk', {
                    status: '密码错误 请重新登录'
                })
            }

            // console.log(data);
            //检测用户的登陆状态
            //在页面渲染之前设置保存用户cookie的数据
            ctx.cookies.set('username', username, {
                domain: 'localhost', //cookie信息在哪个页面生效
                path: '/',
                maxAge: 36e5, //当前cookie的过期时间
                httpOnly: true, //禁止客户端访问次cookie
                overwrite: false
            })

            //用户在数据库的_id
            ctx.cookies.set('uid', data[0]._id, {
                domain: 'localhost', //cookie信息在哪个页面生效
                path: '/',
                maxAge: 36e5, //当前cookie的过期时间
                httpOnly: true, //禁止客户端访问次cookie
                overwrite: false
            })

            //后台的session 与前端的cookie比较 不同则重新登陆
            ctx.session = {
                username,
                uid: data[0]._id,
                avatar: data[0].avatar, //用户登陆的默认头像
                role: data[0].role //用于后台用户登陆成功的权限
            }

            // console.log(ctx.session);

            await ctx.render('isOk', {
                status: '登陆成功'
            })
        })
        .catch(async err => {
            await ctx.render('isOk', {
                status: '登陆失败'
            })

        })
}

//确定用户状态 保持用户的状态  这是第一个主程序路由 下面还有路由需要执行 需要用到next
exports.keepLog = async (ctx, next) => {
    //session 不存在
    if (ctx.session.isNew) {
        if (ctx.cookies.get('username')) {
            let uid = ctx.cookies.get('uid');
            await User
                .findById(uid)
                .then(data => data.avatar)
            //更新session
            ctx.session = {
                username: ctx.cookies.get('username'),
                uid,
                avatar
            }
        }
    }
    // console.log(ctx.session.isNew);

    await next();

    // ctx.body = 'aaa'
}

//用户退出
exports.logout = async ctx => {
    //清除session cookie
    ctx.session = null;
    ctx.cookies.set('username', null, {
        maxAge: 0
    })
    ctx.cookies.set('uid', null, {
        maxAge: 0
    })
    //重定向到首页
    ctx.redirect('/')
}

//后台部分
//用户头像上传
exports.uploadavatar = async ctx => {
    //获取头像地址
    const filename = ctx.req.file.filename;

    let datas = {};
    //当前用户的id与session中的id一致 取session中的id
    const data = await User
        .updateOne({
            _id: ctx.session.uid
        }, {
            $set: { avatar: "/avatar/" + filename } //原字操作 有就更新 没有就新增
        }, (err, res) => {
            if (err) {
                datas = {
                    status: 0,
                    message: err
                }
            } else {
                datas = {
                    status: 1,
                    message: '头像上传成功'
                }
            }
        })
    console.log(data);
    // ctx.type = json
    ctx.body = datas;
}

//超级管理员用户管理
exports.users = async ctx =>{
    const data = await User.find()
    // console.log(data)
    ctx.body = {
        code:0,
        data
    }
}

//超级管理员删除用户
exports.deluser = async ctx => {
    const _id = ctx.params.id;
    console.log(_id)
    let res = {
        state: 1,
        message: "删除成功"
    }

    await User
        .findById(_id)
        .then(data => {
            data.remove()
        })
        .catch(err => {
            res => {
                state: 0;
                message: err
            }
        })
    ctx.body = res
}