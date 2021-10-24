const mongose = require ('mongoose');
mongose.connect('mongodb://127.0.0.1:27017/news-project-api',
{useNewUrlParser:true});