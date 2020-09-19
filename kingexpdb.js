const express = require('express');
const app = express();
const fs = require('fs');
const bodyparser = require('body-parser'); 
const compression = require('compression');
const helmet = require('helmet');
const sanitize = require('sanitize-html');
const mysql = require('mysql');
const private = require('./mysql');

const port = 8080;
const db = mysql.createConnection({
  host: 'localhost',          // 호스트는 어떤 컴퓨터에 있는가?? 디비서버가 내 컴터에 있다면 로컬호스트
  user: 'root',
  password: private,
  database: 'dksql'           // 디비 이름
});
db.connect();

const template = {
  list:function(results){
    let ret = '<ol>';
    for(dbval of results){
      ret += `<a href = "/page/${dbval.id}"><li>${dbval.title}</li></a>`;
    }ret += '</ol>';
    return ret;
  },
  authorsel:function(authors, authid){
    let tag = '';
      for (val of authors){
        let selected = '';
        if(authid === val.id){
          selected = ' selected';
        }
        tag += `<option value="${val.id}"${selected}>${val.name}</option>`;
      }
    return tag;
  },
  html:function(dbdata,list,description){
    let title ='';
    if(typeof(dbdata) === 'string'){
      title = dbdata;
    }else{
      title = dbdata.title;
    }
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
          <a href ="/page/update/${dbdata.id}">update</a>
          <form action = "/page/delete" method="post">
            <input type ="hidden" name = "del" value=${dbdata.id}>
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

app.get('/', function(request,response){
  db.query('SELECT* FROM TOPIC',function(error,results){
    let title = 'Home - EXPMinesweeper';
    let list = template.list(results);
    let description = 'this it home ~~'; 
    let html = template.html(title, list, description);
    response.send(html);
  });
})

app.get('/page/create',function(request,response){
  let title = "Create";
  db.query('SELECT * FROM topic',function(error, results){
    let list = template.list(results);
    db.query('SELECT *FROM author', function(error2,authors){
      let tag = template.authorsel(authors);
      let formdata = `
        <form action = "/page/create" method="post">
          <p><input type = "text" name ="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><select name = "author">${tag}</select></p>
          <p><input type ="submit"></p>
        </form>`;
      let html = template.html(title, list, formdata);
      response.send(html);
    });
  });
})

app.post('/page/create',function(request,response){
  let body = request.body;
  let title = body.title;
  let description = body.description;
  db.query('INSERT INTO TOPIC (title,description,created,author_id) VALUES(?,?,NOW(),?)',[title,description,body.author]
    ,function(error,results){
    if(error)throw error;
    response.redirect(`/page/${results.insertId}`);       // id는 고유키이기 때문에 직접 쿼리 안날려줘도 알아서 이쁘게 갱신해서 넣어줌
  });
})

app.get('/page/update/:pageid',function(request,response){
  let pageid = request.params.pageid;
  db.query('SELECT *FROM TOPIC',function(error,results){
    if(error) throw error;
    let list = template.list(results);
    db.query('SELECT *FROM TOPIC WHERE id=?',[pageid],function(error2, data){
      if(error2) throw error2;
      db.query('SELECT* FROM author', function(error3, authors){
        let title = data[0].title;
        let description = data[0].description;
        let tag = template.authorsel(authors, data[0].author_id);
        let formdata = `
        <form action ="/page/update" method ="post">
          <input type="hidden" name = "idval" value= ${pageid}>
          <p><input type ="text" name="title" value = ${title}></p>
          <p><textarea name="description">${description}</textarea></p>
          <p><select name = "author">${tag}</select></p>
          <input type="submit">
        </form>`;
        let html = template.html(data[0], list, formdata);
        response.send(html);
      });
    });
  });
})

app.post('/page/update',function(request,response){
  let body = request.body;
  let title = body.title; 
  let description = body.description;
  console.log(`tt == ${title} , des == ${description} , id = ${body.idval}`);
  db.query('UPDATE topic SET title=?, description=?,author_id=1 WHERE id=?',[title,description,body.idval],
    function(error,results){
      response.redirect(`/page/${body.idval}`);
  });
})

app.post('/page/delete',function(request,response){
  let body = request.body;
  let delid = body.del;
  db.query('DELETE FROM TOPIC WHERE ID = ?',[delid],function(error,results){
    if(error) throw error;
    response.redirect('/');
  })
})

app.get('/page/:pageid', function(request,response,next){
  let pageid = request.params.pageid;
  db.query('SELECT *FROM TOPIC',function(error1, results){
    if(error1) throw error1;
    let list = template.list(results);
    db.query('SELECT *FROM TOPIC LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?'
    ,[pageid], function(error2, data){
      if(error2) throw error2;
      let desc = data[0].description;
      desc += `<p>by ${data[0].name}</p>`; 
      let html = template.html(data[0],list,desc);
      response.send(html);
    });
  });
})

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