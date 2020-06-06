const mongoose = require('mongoose');
const { db } = require('../Schema/config');
const CommentSchema = require('../Schema/comments');
const Comment = mongoose.model('comments', CommentSchema);



module.exports = Comment;