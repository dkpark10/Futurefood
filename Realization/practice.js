// http://asdf:8080/main?id=HTML&page=12
// http: 프로토콜
// asdf: 호스트, 도메인주소
// 8080: 포트번호 
// main: path
// id=HTML&page=12 : querystring 쿼리스트링의 시작은 ?(물음표)

const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const port = 8080;
// const template = require('./library')
const path = require('path');               // path 세탁 보안이요

// 세탁 npm init -> npm install -S sanitize-html
// 들어가는 정보와 나가는 코드는 항상 세탁해야 한다. 나도 나중에 돈 많이 벌어서 돈세탁해야지
const sanitizehtml = require('sanitize-html');  
const template ={
  html:function (title, list, body, control) {
    let ret = `<!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8"> 
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
    return ret;
  },
  list:function(filelist){
    let list = `<ul>`;
    for (let i = 0; i < filelist.length; i++) {
      list += `<li><a href="/?id=${filelist[i]}"> ${filelist[i]}</a></li>`;
    }
    list += '</ul>';
    return list;
  }
}

const app = http.createServer(function (request, response) {
  let _url = request.url;              // url 은 포트번호 뒤 주소문자열
  console.log(`_url = ${_url}`);
  let querydata = url.parse(_url, true);                 // 쿼리데이터 객체
  // console.log(`querydata.id = ${querydata.id}`);     // 포트번호 뒤 쿼리객체 id라는 키의 값출력
  console.log(url.parse(_url, true));
  let title = querydata.query.id;
  let pathname = querydata.pathname;

  // var args = process.argv;     // 실행전 파라미터 받기 객체로 받음
  // 1. 노드 js 런타임위치
  // 2. 실행시킨 파일경로
  // 3. 입력한 입력값 

  if (pathname === '/') {
    if (querydata.query.id === undefined) {                 // home '/' and undefined

      fs.readdir('./data', function (error, filelist) {
        title = 'Welcome Party';
        var description = 'if you constantly give some favors for people';
        let list = template.list(filelist);
        console.log(`list == ${list}`);
        let html = template.html(title,list,`<h2>${title}</h2>${description}`,
        `<a href ="/create">create</a>`);
        response.writeHead(200);                // 요청성공 응답메세지
        response.end(html);
      });
    }
    else {                            
      fs.readdir('./data', function (error, filelist) {
        let list = template.list(filelist);
        let title = querydata.query.id
        const filteredid = path.parse(title).base;          // 경로중 마지막 슬래쉬 파일만 파싱한다.
                                                            // 그렇게 해서 경로 세탁
        fs.readFile(`./data/${filteredid}`, 'utf8', function (error, description) {
          const sanititle = sanitizehtml(title);            // 세탁해야해 <script>~~~
          const sanidescription = sanitizehtml(description);
          let html = template.html(sanititle, list, `<h2>${title}</h2>${sanidescription}`,
          `<a href ="/create">create</a> 
          <a href="/update?id=${sanititle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanititle}">
            <input type="submit" value="delete">
          </form>`); // 삭제는 절대 쿼리스트링으로 하면 안된다. post!! 
                    // get 방식으로 전송하면 url값으로 삭제가 가능하니까
          response.writeHead(200);                // 요청성공 응답메세지
          response.end(html);
        });
      });
    }
  }
  else if(pathname ==='/create'){
    
    fs.readdir('./data', function (error, filelist) {
      title = 'Welcome-Create';
      let list = template.list(filelist);
      const filteredid = path.parse(title).base;
      fs.readFile(`./data/${filteredid}`, 'utf8', function (error, description) {
        
        let formdata = 
        `<form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit"> 
        </p>
      </form>`
        let html = template.html(title, list, formdata, '');
        response.writeHead(200);                // 요청성공 응답메세지
        response.end(html);
      });
    });
  }
  else if(pathname === '/create_process'){

    let body = '';
    request.on('data',function(data){           // data 수신이용할 때 콜백
      body += data;
      if(body.length >1e6)                     // 데이터 너무 많을 때 끊음
        request.connection.destroy();
    });
    request.on('end',function(){                // 데이터 수신이 끝남요
      var post = qs.parse(body);                // 데이터수신 키값객체
      var title = post.title;
      var description = post.description;
      const filteredid = path.parse(title).base;
      fs.writeFile(`data/${filteredid}`,description,'utf8',function(error){
        response.writeHead(302, {Location:`/?id=${title}`});          // 302는 리다이렉션이요
        response.end(); 
      })
    });    
  }
  else if(pathname === '/update'){
    fs.readdir('./data', function (error, filelist) {
      const filteredid = path.parse(title).base;
      fs.readFile(`./data/${filteredid}`, 'utf8', function (error, description) {
        let title = querydata.query.id
        let list = template.list(filelist);
        let html = template.html(title, list, 
          `<form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p><input type="submit"></p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                                                // input 태그 value에 기본 값 셋팅할 수 있다
        response.writeHead(200);                // 요청성공 응답메세지
        response.end(html);
      });
    });
  }
  else if(pathname === '/update_process'){
    let body = '';
    request.on('data',function(data){           // data 수신이용할 때 콜백
      body += data;
      if(body.length >1e6)                     // 데이터 너무 많을 때 끊음
        request.connection.destroy();
    });
    request.on('end',function(){                // 데이터 수신이 끝남요
      var post = qs.parse(body);                // 데이터수신 키값객체
      var id = post.id;
      var title = post.title;
      var description = post.description;
      const filteredid = path.parse(title).base;
      fs.rename(`data/${id}`,`data/${title}`,function(error){
        fs.writeFile(`data/${filteredid}`,description,'utf8',function(error){
          response.writeHead(302, {Location:`/?id=${title}`});          // 302는 리다이렉션이요
          response.end(); 
        })
      });
    });     
  }
  // 삭제는 반드시 포스트 방식으로 왜냐면 쿼리스트링으로 삭제할 수 있응꼐
  else if(pathname ==='/delete_process'){
    let body = '';
    request.on('data',function(data){           // data 수신이용할 때 콜백
      body += data;
      if(body.length >1e6)                     // 데이터 너무 많을 때 끊음
        request.connection.destroy();
    });
    request.on('end',function(){                // 데이터 수신이 끝남요
      var post = qs.parse(body);                // 데이터수신 키값객체
      var id = post.id;
      const filterdid = path.parse(id).base;
      fs.unlink(`data/${filterdid}`,function(error){
        response.writeHead(302, {Location:`/`});          // 302는 리다이렉션이요
        response.end(); 
      })
    });     
  }
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
  // console.log(`__dirname == ${__dirname}`);      // __dirname 파일 경로
});

app.listen(port, function () {
  console.log(`waiting... ${port}`);
});
