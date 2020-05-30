//后台管理页面

const fs = require('fs');
const { join } = require('path');

exports.index = async ctx => {
    if (ctx.session.isNew) {
        //未登录
        ctx.status = 404;
        return await ctx.render('404', {
            title: '不管你怎么找，这里都没有你要的东西'
        })
    }

    const id = ctx.params.id;

    //获取admin文件夹中的模板文件名
    const arr = fs.readdirSync(join(__dirname, '../views/admin'));
    let flag = false;
    //循环的内部最好不要有异步
    arr.forEach(v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g, '');
        if (name == id) {
            flag = true;
        }
    })
    if (flag) {
        await ctx.render('admin/admin-' + id, {
            role: ctx.session.role
        })
    } else {
        ctx.status = 404;
        await ctx.render('404', {
            title: '你再找啥呢？'
        })
    }
}