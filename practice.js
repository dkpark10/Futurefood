// http://asdf:8080/main?id=HTML&page=12
// http: 프로토콜
// asdf: 호스트, 도메인주소
// 8080: 포트번호 
// main: path
// id=HTML&page=12 : querystring 쿼리스트링의 시작은 ?(물음표)

const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 8080;

const app = http.createServer(function(request,response){
  let _url = request.url;              // url 은 포트번호 뒤 주소문자열
  console.log(`_url = ${_url}`);
  let querydata = url.parse(_url,true).query;     // 쿼리스트링 객체
  console.log(`querydata = ${querydata.id}`);     // 포트번호 뒤 쿼리객체 id라는 키의 값출력
  let title = querydata.id;

  if(_url === '/'){
    title = 'Welcome Party';
  }
  if(_url === '/favicon.ico'){
    return response.writeHead(404);
  }
  response.writeHead(200);                // 요청성공 응답메세지

  let template = `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    <ol>
      <li><a href="/?id=HTML">HTML</a></li>
      <li><a href="/?id=CSS">CSS</a></li>
      <li><a href="/?id=JavaScript">JavaScript</a></li>
    </ol>
    <h2>${title}</h2>
    <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification"
    >Hypertext Markup Language (HTML)</a> is the standard markup language for
    <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML
     documents from a web server or from local storage and render them into multimedia web pages.
      HTML describes the structure of a web page semantically and originally included cues for the
       appearance of the document.
    </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, 
    images and other objects, such as interactive forms, may be embedded into the rendered page. 
    It provides a means to create structured documents by denoting structural semantics for text such as headings,
     paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
    </p>
  </body>
  </html>
  `;
  // console.log(`__dirname == ${__dirname}`);      // __dirname 파일 경로
  response.end(template);
});

app.listen(port, function(){
  console.log(`waiting... ${port}`);
});