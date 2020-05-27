//后台管理 
const mongoose = require('mongoose');
const { db } = require('../Schema/config');
const AdminSchema = require('../Schema/admin');
const Admin = mongoose.model('admin', AdminSchema);



module.exports = {
    Admin
};