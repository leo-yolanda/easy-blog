//用户加密模块
const cropty = require('crypto');

//导出用于处理加密的函数
//加密对象 -> 返回加密成功的数据  jianxin 加密 签名 二次加密
module.exports = function(password, key = 'jianxin') {
    //创建加密对象
    const hmac = cropty.createHmac('sha256', key);
    //加密对象
    hmac.update(password);
    const passwordHmac = hmac.digest('hex');
    return passwordHmac;
}