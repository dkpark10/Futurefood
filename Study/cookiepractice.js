const http = require('http');
const cookie = require('cookie');
const port = 8080;

http.createServer(function(request,response){
  
  let cookies = {};
  if(request.headers.cookie !== undefined){           // 쿠기가 없을 떄를 대비 
    cookies = cookie.parse(request.headers.cookie);   // 쿠기 파싱 함수
  }
  console.log(cookies);
  response.writeHead(200, {
    'Set-cookie': ['yumi = choco', 
    'tasty = strawberry',
    `Permanent=cookies; Max-Age=${60*60*24}`,  // 영구적쿠키 기간 설정 가능
    'Secure=Secure; Secure',                   // https only 통신가능 뒤옵션이 중요함
    'HttpOnly=HttpOnly; HttpOnly',             // http only 옵션을 통해 보안
    'path=path; Path=/cookie',                  // path = /cookie일경우만 path쿠키 존재
    'domain=domain; Domain=o2.org'              // o2.org에서만 사용가능한 쿠키
  ]    
  })  
  response.end('cc'); 
})
.listen(port,function(){
  console.log(`${port} waiting...`);
}) 