const multer = require('koa-multer');
const { join } = require('path');

//配置存储对象
const storage = multer.diskStorage({
    //存储位置 静态资源
    destination: join(__dirname, '../public/avatar'),
    //文件名
    filename(req, file, callback) {
        const filename = file.originalname.split('.');
        callback(null, `${Date.now()}.${filename[1]}`);
    }
})

module.exports = multer({ storage })