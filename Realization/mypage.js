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

router.get('/create',function(request,response){
  console.log("jjbbbjbjbjbbjj");
  let title = "Create";
  let list = template.list(request.list);
  let formdata = `
    <form action = "/page/create" method="post">
      <p><input type = "text" name ="title" placeholder="title"></p>
      <p><textarea name="description" placeholder="description"></textarea></p>
      <p><input type ="submit"></p>
    </form>`;
  let html = template.html(title, list, formdata);
  response.send(html);
})

router.post('/create',function(request,response){
  let title = request.body.title;
  let description = request.body.description;
  console.log(description);
  fs.writeFile(`./data/${title}`,description,'utf8',function(error){
    if(error) throw error;
    response.redirect(`/page/${title}`);
  });
})

router.get('/update/:pageid',function(request,response){
  let title = request.params.pageid;
  let list = template.list(request.list);
  fs.readFile(`./data/${title}`, 'utf8',function(error,data){
    let formdata = 
    `<form action = "/page/update" method="post">
      <input type = "hidden" name ="before" value=${title}>
      <p><input type = "text" name ="title" value=${title}></p>
      <p><textarea name="description">${data}</textarea></p>
      <p><input type ="submit"></p>
    </form>`;
  let html = template.html(`${title} - Update`,list,formdata);
  response.send(html);
  });
})

router.post('/update',function(request,response){
  let body = request.body;
  let before = body.before;
  let title = body.title;
  let description = body.description;
  fs.rename(`./data/${before}`,`./data/${title}`,function(error){
    if(error) throw error;
    fs.writeFile(`./data/${title}`, description,'utf8',function(error){
      if(error) throw error;
      response.redirect(`/page/${title}`);
    });
  });
})

router.post('/delete',function(request,response){
  let body = request.body;
  let delid = body.del;
  fs.unlink(`./data/${delid}`,function(error){
    if(error) throw error;
    response.redirect('/');
  });
})

router.get('/:pageid', function(request,response,next){
  let title = request.params.pageid;
  let list = template.list(request.list);
  fs.readFile(`./data/${title}`,'utf8',function(error,data){
    console.log(title);
    if(error) next(error); 
    else{
      let description = data;
      let html = template.html(title,list,description);
      response.send(html);
    }
  });
})

module.exports = router;