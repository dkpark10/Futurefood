const express = require('express');
const router = express.Router();
const fs = require('fs');

const template = {
  list:function(filelist){
    let ret = '<ol>';
    for(file of filelist){
      ret += `<a href = "/page/${file}"><li>${file}</li></a>`;
    }ret += '</ol>';
    return ret;
  },
  html:function(title,list,description){
    let ret = `
    <!doctype html>
    <html>
      <head>
        <title>this is EXPminesweeper</title>
        <meta charset="utf8">
      </head>
      <body>
        <p><h1><a href="/">Mine-EXPSweeper</a></h1></p>
        <p>${list}</p>
        <p>
          <a href ="/page/create">create</a>
          <a href ="/page/update/${title}">update</a>
          <form action = "/page/delete" method="post">
            <input type ="hidden" name = "del" value=${title}>
            <input type = "submit" value="delete">
          </form>
        </p>
        <p><h3>${title}</h3></p>
        <p>${description}</p>
      </body>
    </html>`;
    return ret;
  }
}

router.get('/', function(request,response){
  let title = 'Home - EXPMinesweeper';
  let list = template.list(request.list);
  let description = 'this it home ~~'; 
  let html = template.html(title,list,description);
  response.send(html);
})

module.exports = router;