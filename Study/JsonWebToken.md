# JWT

### 토큰인증방식

웹서비스를 개발한다면 토큰을 사용하여 인증작업을 처리하는 것이 가장 좋다.
http 프로토콜은 이전에 통신했던 데이터를 저장하지 않기 때문에 이를 위해 세션에 데이터를
저장한다. 예를들어 유저가 로그인 시 세션에 로그인 되었다고 저장을 하고 서비스를 제공하기 위해 세션을 사용한다. Stateless 서버는 상태를 유지하지 않기 때문에 상태정보를 저장하지 않고
클라이언트측에서 들어오는 요청만을 확인하고 처리한다. 서버의 확장성이 높아진다.

### 왜 토큰을 사용하는가??

유저가 인증을 할 때 서버는 이 기록을 세션에 저장한다. 트래픽 과부하로 로그인한 유저가 많아진다면 파일에 저장하던 DB에 저장하던 리소스를 잡아먹게 된다. 

세션을 사용하면 서버확장에 어려움이 생긴다. 트래픽이 많은 웹어플리케이션들은 모놀리식이 아닌 필수적으로 분산처리를 하기 위해 여러개의 프로세스를 돌리거나 여러 서버컴퓨터를 추가하거나 MSA로 작성하기 때문에 세션을 사용하면서 분산처리를 설계하는 것은 매우 어렵다. 

웹어플리케이션에서 세션을 관리할 때 자주 사용되는 쿠키는 단일 도메인 및 서브도메인에서만
작동하도록 되있다. 따라서 쿠키를 여러 도메인에서 관리하는 것은 번거롭다.

### 토큰 시스템 작동원리

토큰은 Stateless하다. 상태유지를 하지 않는다. 세션이 존재하지 않으니 유저들이 로그인되어 있는지 아닌지 신경쓰지 않아도 된다. 서버의 확장이 쉽다. 대략적으로 로직은 다음과 같다.

1. 유저가 로그인
2. 서버에서 해당 계정 검증
3. 정보가 정확하다면 서버측에서 유저에게 토큰을 발급
4. 브라우저는 토큰을 저장해두고 서버에 요청할 때 토큰을 같이 전달.
5. 서버는 토큰검증 서비스 응답

[https://velopert.com/wp-content/uploads/2016/12/token-diagram.png](https://velopert.com/wp-content/uploads/2016/12/token-diagram.png)

서버에서 토큰을 전달할 때 HTTP헤더의 토큰값을 포함시켜 전달한다.

### JWT란?

json web token 은 웹표준(RFC 7519)로 두개체에 JSON객체를 사용하여 가볍고 자가수용적인 방식을로 정보를 안정성있게 전달한다. jwt는 필요한 모든 정보를 자체적으로 지니고 있다.
jwt는 토큰에 대한 기본정보, 내용, 검증증명을 포함하고 있다. jwt는 http 헤더나 URI 파라미터로 전달할 수 있다. 

### JWT 생김새

다음과 같이 헤더, 내용, 서명으로 나누어져 있다.

[https://velopert.com/wp-content/uploads/2016/12/jwt.png](https://velopert.com/wp-content/uploads/2016/12/jwt.png)

### 헤더1

헤더는 두가지 정보를 지니고 있다. 

```javascript
{
	"typ" : "JWT",
	"alg" : "SHA256"
}
```

타입은 토큰타입 즉 jwt고 alg는 해싱알고리즘을 지정한다. nodejs에서 간단하게 base64로 인코딩해보자

```javascript
const header = {
	"typ" : "JWT",
	"alg" : "SHA256"
};

const encodedHeader = new Buffer.from(JSON.stringify(header))
					.toString('base64')
					.replace('=','');
```

포스트맨으로 post 요청을 받아보면 다음과 같은 결과값을 얻을 수 있다.

```javascript
{
    "header": "eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9"
}
```

### 정보2

Payload 에는 토큰에 담을 정보가 있다. 정보의 한조각을 클레임이라 부르고 name - value 한 쌍으로 이루어져 있다. 클레임은 다음과 같이 분류된다.

1. 등록된 클레임
2. 공개 클레임
3. 비공개 클레임

##### 정보2 등록된 클레임

등록된 클레임은 서비스에 필요한 정보가 아니라 토른에 대한 정보들을 담기위한 클레임이다. 등록된 클레임의 사용은 선택적이며 다음과 같다.

1. iss : 토큰발급자
2. sub: 토큰제목
3. aud: 토큰대상자
4. exp: 토큰만료기간 시간은 NumericDate형식으로 지정되있어야 하며 언제나 현재시간보다 이후로 설정되 있어야 한다.
5. nbf : Not Before를 의미하며 이 날짜가 지나기 전까지 토큰이 처리되지 않는다. 
6. iat: 토큰이 발급된 시간
7. jti: jwt고유 식별자로서 중복처리 방지를 위해 사용 일회용 토큰에 사용한다.

##### 정보2 공개 클레임

공개 클레임들은 충돌이 방지된 이름을 가지고 있어야 한다. 충돌 방지를 위해 클레임 이름을 URI형식으로 짓는다.

```javascript
{
	"https://domain.com/parameter/is_admin" : true
}
```

##### 정보2 비공개 클레임

클라이언트와 서버간 협의하에 사용되는 클레임 

```javascript
{
    "iss": "server",
    "exp": "192780000000",
    "https://domain.com/parameter/is_admin": true,
    "userId": "2929fejwefwj",
    "username": "king"
}
```

위 코드는 2개의 등록된 클레임 1개의 공개클레임 2개의 비공개 클레임으로 이루어져 있다.
위 코드를 또 인코딩하고 포스트맨으로 요청하고 받아보자.

```javascript
{
  "payload":"eyJpc3MiOiJzZXJ2ZXIiLCJleHAiOiIxOTI3ODAwMDAwMDAiLCJodHRwc  zovL2RvbWFpbi4uY29tL3BhcmFtZXRlci9pc19hZG1pbiI6dHJ1ZSwidXNlcklkIjoiMjkyOWZlandlZndqIiwidXNlcm5hbWUiOiJraW5nIn0"
}
```

### 서명

마지막 부분은 바로 서명 헤더와 정보의 인코딩 값을 합친후 비밀키로 해쉬를 암호화하여 생성한다. 수도코드로 나타내보자.

```javascript
shaw256(`${base64EncodedHeader}.${base64EncodedPayload}`,secretKey);
```

이제 헤더와 정보를 합치고 해싱해보자. 

```javascript
function encode(str){
  return new Buffer.from(JSON.stringify(str))
  .toString('base64')
  .replace('=', '');
}

const jwtInfo = {
  "header": {
    "typ": "JWT",
    "alg": "HS256"
  },
  "payload": {
    "iss": "server",
    "exp": "192780000000",
    "https://domain.com/parameter/is_admin": true,
    "userId": "2929fejwefwj",
    "username": "king"
  }
};

const crypto = require('crypto');
const signature = crypto.createHmac('sha256', 'secret')
             .update(`${encode(jwtInfo.header)}.${encode(jwtInfo.payload)}`)
             .digest('base64')
             .replace('=', '');
             
//  "signature": "z7ds9l08jwfdjQsaVy0P5QQgzAXLe01WhR1LZtuwFpI"
```

지금까지 구한 값을  [https://jwt.io/](https://jwt.io/) 에 붙여보자 

> eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzZXJ2ZXIiLCJleHAiOiIxOTI3ODAwMDAwMDAiLCJodHRwczovL2RvbWFpbi5jb20vcGFyYW1ldGVyL2lzX2FkbWluIjp0cnVlLCJ1c2VySWQiOiIyOTI5ZmVqd2Vmd2oiLCJ1c2VybmFtZSI6ImtpbmcifQ.z7ds9l08jwfdjQsaVy0P5QQgzAXLe01WhR1LZtuwFpI

재밌다!.
