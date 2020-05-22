const mongoose = require('mongoose');
const { db } = require('../Schema/config');
const UserSchema = require('../Schema/user');
const User = mongoose.model('users', UserSchema);

module.exports = User;