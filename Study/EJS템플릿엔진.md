# EJS 

프론트 **프레임웤 3대장**을 아직 배우고 싶지? 않아 템플릿 엔진을 써보자
템플릿 엔진 EJS는 html안에 내장되어 있는 것
또한 서버에서 보낸 값을 사용할 수 있다. 
문법은 **<% %>** 이다. 이 태그안에 자바스크립트 내용을 넣자

```javascript
<body>
	<% for(let i=0; i<size; i++){ %>
		<h1>으어어어어</h1>
	<%}%>
</body>
```

<%%> 사이에는 무조건 자바스크립트 코드 
새로운 줄바꿈도 역시 <%%> 를 사용해야한다.
보나마나 으어어어 사이즈 수만큼 출력된다. 

#### 변수값 내장

<%=%> 문법으로 태그안 변수 값을 그대로 코드처럼 옮겨준다. 걍 예제보자

```javascript
<body>
	<% for(let i=0; i<size; i++){ %>
		<h1> <%= i+1 %>번째 사랑</h1>
	<%}%>
</body>
```

보나마나 1번부터 N번까지 출력

#### 서버에서 보내준 값을 출력해보자아아아

넘기는 변수만 리터럴 객체형식으로 넘겨야 한다. (키값형태)

```javascript
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

app.set('view', 'ejs')	// 뷰폴더 셋팅 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())		// json 파싱
app.use('static',express.static(__dirname + '/public'));

app.get('/', (request,response) =>{
	response.render("test111", {});
});

app.get("/hi",(request,response)=>{
	response.render("test2",{
		one:'ooooonenenene',
		two:'twwwwoowowowo'
	})
});

app.post('/postTest',(request,response) =>{
	response.json({ok:true, name:request.body.name});
});
```

위 코드의 실행결과는 **/hi** 로 요청하고 응답은 test2.ejs로 one,two 키값이
넘어가게 된다. 

```javascript
// test2.ejs
<body>
	<h1><%= one %></h1>
	<h1><%= two %></h1>
</body>
```

ooooonenenene  ,twwwwoowowowo 을 출력 ~~~

#### 주의사항

1. <%%> 는 반드시 한줄로 쭉 쓰자 개행시 또 쓰자
2. <%%>로 변수 선언시 스코프적용이 된다. 그러기 때문에 ejs 내부에 변수명이 동일하여도
따로 인식을 한다. 전역변수, 지역변수 스택영역의 개념이 html 내부 안에서 똑같이 적용된더.
3. var a = <% =1%>;은 가능 <%var a %> = 1;은 불가능 
내장된 코드의 값을 html내부로 불러오는건 가능하나 내장시킬 코드에 html파일에 있는
값을 넣는 것을 불가능하다.
4. <% 문자열 변수 %> 는 문자열로 인식되지 않는다.  그렇기 때문에 문자열로 인식하려면
	"<%=%>" 로 쓰자.
5. <%%>는 개발자모드로 볼 수 없다.