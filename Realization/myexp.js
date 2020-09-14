const express = require('express');
const app = express();
const fs = require('fs');
const bodyparser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const idxrouter = require('./myidx');
const pagerouter = require('./mypage');

const port = 8080;

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(compression());
app.use(helmet());
app.use(express.static('public'));

app.get('*', function(request,response,next){
  fs.readdir('./data', function(error,filelist){
    if(error) throw error;
    request.list = filelist;
    next();
  });
})

app.use('/page',pagerouter);
app.use('/',idxrouter);

app.use(function(request,response,next){
  response.status(404).send('Not Found!!');
})

app.use(function(error,request,response,next){
  console.error(error.stack);
  response.status(500).send('Someting Everything');
})

app.listen(port, function(){
  console.log(`waiting ... ${port}`);
})