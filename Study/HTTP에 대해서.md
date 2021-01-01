# HTTP

#### 개요
http는 인터넷에서 데이터를 주고받을 수 있는 프로토콜
여기서 ht의 **hypertext**는 컴퓨터 화면에서 볼 수 있는 텍스트 데이터 
또 다른 텍스트와 연결될 수 있는 주소를 참조하고 있다.
클라이언트는 브라우저에서 어떤 서비스를 url을 통해 서버에 요청(request)하면
서버는 url을 해석 그에 걸맞는 결과(html, json)를 응답(response)한다.

HTML문서만이 HTTP통신을 위한 유일한 통신수단은 아니다.
JSON, XML도 가능하다. 

#### 특징

1. TCP/IP를 이용하는 응용프로토콜.
2. HTTP는 연결상태를 유지하지 않는 비연결성 프로토콜(한번 요청응답하면 끝 연결성을 유지하기 위해 쿠키세션 사용)
3. 연결상태를 유지하지 않기 때문에 요청/응답방식으로 동작.

#### request(요청)

클라이언트가 서버에 무엇을 보내달라(html, json) 요청하는것. 요청정보를 담아 서버에 보냄
요청메소드로 **GET,POST,PUT,DELETE** 가 있다

```
GET https://apis.google.com/js/api.js HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...
Upgrade-Insecure-Requests: 1
```

위 텍스트는 http 메세지다. </br>
첫줄은 요청메시지의 메소드, 주소, 버전</br>
두번째줄은 헤더이다. (나중에 알아보자)</br>
다음은 본문이다. 서버에 보낼 데이터를 담고있다.</br>

#### response(응답)

```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 35653
Content-Type: text/html;

<!DOCTYPE html><html lang="ko" data-reactroot="">
<head>
	<title>...
```

첫번쨰 줄은 http 버전 및 응답상태를 담고있다. </br>
200은 요청성공이다. </br>
404는 Not Found 이다. </br>
두번째줄은 헤더이다. (나중에 알아보자)</br>
</br>
본문은 HTML 브라우저이다. 이 HTML문서를 브라우저가 화면에 렌더링해 보여준다. 
