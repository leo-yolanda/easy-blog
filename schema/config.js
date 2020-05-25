//连接数据库 导出对象
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://127.0.0.1:27017/user', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('数据库连接成功');
}).catch(() => {
    console.log('数据库连接失败');

})

const Schema = mongoose.Schema;

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: Number
// })

// let User = mongoose.model('users', userSchema);

// let aa = new User({
//     username: "小林",
//     password: 123456
// });

// aa.save({})
//     .then(result => {
//         console.log('数据保存成功');
//         console.log(result);
//     })
//     .catch(err => {
//         console.log('数据保存失败');
//         console.log(err)
//     })

module.exports = {
    db,
    Schema
}