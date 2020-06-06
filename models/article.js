const mongoose = require('mongoose');
const { db } = require('../Schema/config');
const ArticleSchema = require('../Schema/article');
const Article = mongoose.model('article', ArticleSchema);



module.exports = Article;