const express = require('express');
const app = express();
const port = 5500; 
app.use (express.json());
require('./db/mongose');
const reporterRouter = require('./router/reporter')
const newsRouter = require('./router/news')
app.use(reporterRouter);
app.use(newsRouter);


app.listen(port ,()=>{
    console.log('server is running');
});