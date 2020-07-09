# express 


```javascript
const express = require('express');
const app = express();
const port = 8080;

app.get('/', function(request,response){
	response.send('king');
})

app.listen(port, function(){
	console.log('waiting... 8080');
})
```

기본 앱은 서버를 시작 8080 포트와 연결. 앱은 루트URL(/) 또는 라우트에 대한 요청에 응답한다.</br>

## 라우팅

라우팅은 URI or 경로에서 특정한 http 메소드(get,post)인 엔드포인트에 대한 클라의 요청에 응답하는 방법을 결정하는 것. 각 라우트는 하나 이상의 핸들러 함수를 가질 수 있다. </br>

```javascript
app.method(path, handler)
app.post('/', handler) {생략} 	// 루트에서 포스트 요청응답
app.put('/king', handler) {생략}  // king 라우트에 put 요쳥응답
app.delete('/king', handler) {생략}  // king 라우트에 삭제 요쳥응답
```

app은 express()의 구체화된 인스턴스 객체</br>
path는 서버 경로이며 handler는 실행함수</br>

## 라우트 경로

라우트경로는 요청메소드와 조합해 요청이 이루어질 수 있는 엔드포인트를 정의</br>
다음은 문자열 패턴을 기반으로 하는 라우트 경로 및 예이다.</br>

```javascript
app.get('/ab?cd', handler) // acd, abcd 와 일치
app.get('/ab+cd', handler) // abcd, abbcd, abbbcd와 일치
app.get('/ab*cd', handler) // ab와 cd사이 뭐든 가능
app.get('/ab(cd)?e', handler) // abe, abcde와 일치
```

## 라우트 핸들러

미들웨어와 비슷하게 작동하는 여러 콜백함수를 제공 요청을 처리할 수 있다. next('route') 를 호출하여 순차적으로 진행하지 않고 라우트 콜백을 우회할 수 있다. </br>

```javascript
app.get('/example/king', function (request,response,next) {
	{실행}
	next();								// 다음 라우트 콜백 실행
}, function(request,response){
	{실행}
}) 
```

콜백함수 배열은 하나의 라우트를 처리할 수 있다.</br>

```javascript
const cb1 = function(req,res,nx){
	{실행}
	next();
}
const cb2 = function(req,res,nx){
	{실행}
	next();
}
const cb3 = function(req,res){
	{실행}
}
const arr = [cb1,cb2,cb3];
app.get('/', arr);
```

## express.Router

express.Router 메소드를 사용 모듈식 핸들러를 작성가능하다.</br>
다음은 라우터를 모듈로 작성 메인앱에서 모듈로 마운트한다.</br>

```javascript
//main.js
var express = require('express')
var app = express()
var fs = require('fs');
var bodyparser = require('body-parser');
var compression = require('compression')
var indexrouter = require('./routes/index');	// 라우터폴더 인덱스모듈
var topicrouter = require('./routes/topic');
var helmet = require('helmet');

app.use(helmet());                            // 기본적으로 넣어주자
app.use(express.static('public'));              // public 폴더에 정적파일을 찾겠다.
app.use(bodyparser.urlencoded({extended: false}));    // 현재는 이구문을 안써도 reqeust.body 사용가능
app.use(compression());
app.get('*', function(request, response, next){   // get방식 요청에서만 post XX
  fs.readdir('./data',function(error, fileist){
    request.list = fileist;
    next();                                       // 다음 미들웨어를 실행
  })
})

app.use('/', indexrouter)					// 라우터 모듈 임포트
```

```javascript
// index.js
var express = require('express');
var router = express.Router();
var template = request('../lib/template.js');

router.get('/', function(request, response) { 
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `
    <h2>${title}</h2>${description}
    <img src="/images/bsjs1." style="width:300px; display:block; margin-top:10px;">
    `,
    `<a href="/topic/create">create</a>`
  ); 
  response.send(html);
});

module.exports = router; 
```
