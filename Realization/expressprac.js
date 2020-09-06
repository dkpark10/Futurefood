// 초기 세팅 npm init -> npm install -> npm install express --save
// 익스프레스는 라우터랑 미들웨어 두개가 다야 ~~
const express = require('express');
const app = express();
const fs = require('fs');
const qs = require('querystring');
// npm install body-parser --save
const bodyparser = require('body-parser'); 
const compression = require('compression');
const sanitizehtml = require('sanitize-html');
const port = 8080;

// public 폴더안에 static 파일찾겠다~~
// 이렇게 하면 url을 통해 접근할 수 있다...
app.use(express.static('public'));

// bodyparser는 request에 바디 프로퍼티 만들어준다.
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json()); // json으로 받겠다 ~~~

// 호출하면 미들웨어를 리턴 app.use()를 통해 장착
app.use(compression());   // 서버가 브라우저에 데이터 전송할 때 용량압축
// 미들웨어는 함수이다.

// request에 리스트 property 대입
// get 방식에서만 이 미들웨어를 사용 !!!!!! 그 외 다른전송방식은 쳐냄
app.get('*',function(request,response,next){      
  fs.readdir('./data',function(error,filelist){
    if(error) throw error;
    request.list = filelist;
    next();               // 그 다음 호출해야할 미들웨어 실행할지 아닐지 여기서 결정
  });
});

const template = {
  list:function(filelist){
    let ret = '<ol>';
    for(let i=0; i<filelist.length; i++){
      ret += `<li><a href = "/page/${filelist[i]}">${filelist[i]}</a></li>`;
    }
    return ret += '</ol>';
  },
  html:function(title,list,description){
    let ret = `
      <!doctype html>
      <html>
        <head>
          <title>MineSweeper</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href='/'>MineSweeper~~</a></h1>
          ${list}
          <a href ='/create'>create</a></p>
          <a href ='/update/${title}'>update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name = "delid" value="${title}">
            <input type="submit" value="delete">
          </form>
          <h3>${title}</h3>
          ${description}
          <img src ="/images/dragon.jpg" style ="display:block";>
        </body>
      </html>
    `;
    return ret;
  }
}

// get 은 라우팅 처음인자는 path 이것이 곧 미들웨어이다 이말이야~~.
app.get('/', function (request, response) {
  let title = 'Mine Sweeper - home';
  let list = template.list(request.list);
  let description = "homememememeow~~";
  let html = template.html(title, list, description);
  response.send(html);
})

// page 뒤 콜론은 키값 url 입력하면 키에 값 대입 
// '/page/:pagdid/:chapterid'
app.get('/page/:pageid', function (request, response, next) {
  let title = request.params.pageid;
  let list = template.list(request.list);
  fs.readFile(`./data/${title}`, 'utf8', function (error, data) {
    if(error){
      next(error);                                      // error 처리하는 미들웨어로 넘어간다.
    }
    else{
      let description = data;
      let html = template.html(title, list, description);
      response.send(html);
    }
  });
})

app.get('/create',function (request,response) {

  let title = 'Create Money';
  let list = template.list(request.list);
  // url이 같더라도 전송방식이 다르면 다르다 ^^ 이건 post니까 get에 안들어감
  let formdata = `
      <form action ="/create" method="post"> 
        <p><input type = "text" name="title" placeholder="input text"></p>
        <p><textarea name="description" placeholder="input description"></textarea></p>
        <p><input type="submit"></p>
      </form>`;
  let html = template.html(title, list, formdata);
  response.send(html);
})

app.post('/create',function(request,response){
  // let tmpbody = '';
  // request.on('data',function (data) {
  //   if(data.length > 1e6){
  //     response.connection.destroy();
  //   }    
  //   tmpbody += data;
  // });
  // request.on('end',function() {
  //   let body = qs.parse(tmpbody);
  //   let title = body.title;
  //   let description = body.description;
  //   fs.writeFile(`./data/${title}`,description,'utf8',function (error) {
  //     if(error) throw error;
  //     response.writeHead(302,{Location:`/page/${title}`});
  //     response.end();
  //   });
  // });
  let body = request.body;
  let title = sanitizehtml(body.title);
  let description = sanitizehtml(body.description);
  fs.writeFile(`./data/${title}`,description,'utf8',function(error){
    if(error)throw error;
    response.redirect(`/page/${title}`);
  });
})

app.get('/update/:updateid', function (request, response) {
  let title = `update - ${request.params.updateid}`;
  let list = template.list(request.list);
  fs.readFile(`./data/${request.params.updateid}`, function (error, data) {
    let description = data;
    let formdata = `
      <form action ="/update" method="post"> 
        <input type="hidden" name="before" value="${request.params.updateid}">
        <p><input type = "text" name="title" value=${request.params.updateid}></p>
        <p><textarea name="description">${description}</textarea></p>
        <p><input type="submit"></p>
      </form>`;
    let html = template.html(title, list, formdata);
    response.send(html);
  });
})

// 마찬가지로 같은 url이라도 전송방식이 다르므로 ~~
app.post('/update',function(request,response) {
  // let tmpbody='';
  // request.on('data',function (data) {
  //   if(data.length >1e6){
  //     response.connection.destroy();
  //   }
  //   tmpbody += data;
  // });
  // request.on('end',function() {
  // let body = qs.parse(tmpbody);

  let body = request.body; 
  let title = body.title;
  let description = body.description;
  fs.rename(`./data/${body.before}`,`./data/${title}`,function(error){
    if(error) throw error;
    fs.writeFile(`./data/${title}`,description,'utf8',function(error){
      response.redirect(`/page/${title}`);
    })
  })  
})

app.post('/delete_process/',function(request,response) {
  // let tmpbody='';
  // request.on('data',function(data){
  //   if(data.length > 1e6){
  //     response.connection.destroy();
  //   }
  //   tmpbody += data;
  // });
  // request.on('end',function () {
  //   let body = qs.parse(tmpbody);
  //   fs.unlink(`./data/${body.delid}`, function(error) {
  //     if(error) throw error;
  //     response.redirect('/');
  //   // });  
  // });

  let body = request.body;
  fs.unlink(`./data/${body.delid}`, function(error) {
    if(error) throw error;
    response.redirect('/');
  });  

  // let delid = request.params.delid;   // 쿼리스트링으로 삭제가 안되네???? 흠..
  // console.log(delid, request.url);
  
  // fs.unlink(`./data/${delid}`, function(error) {
  //     if(error) throw error;
  //     response.writeHead(302,{Location:`/`});
  //     response.end();
  // });
})

// 미들웨어는 순차적으로 실행 여기까지 오면 페이지 못찾은거니까 ~~~~ 404 센드!
app.use(function(request,response,next){
  response.status(404).send("Not Found");
})

// 인자 4개는 에러 핸들링 하기 위한 미들웨어
// next(error) 던져주면 이 미들웨어가 실행된당!!!!...
app.use(function(error,request,response,next){  
  console.error(error.stack);
  response.status(505).send('something everything');
})

app.listen(port,function(){
  console.log(`waiting... ${port}`);
})
