페이지 이동없이 비동기로 서버랑 데이터를 전송받는다. 

```javascript
<!doctype html>
<html>
<head>
  <title>button test</title>
  <meta charset="utf8">
  <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet">
  <style>
    .menu {
      list-style-type: none;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    .menu li {
      display: inline-block;
    }
    .menu li a {
      font-family: 'Nanum Gothic', sans-serif;
      color:black; 
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
    }
    .menu a:hover {
      /* background-color: #6799FF; */
      color:#6799FF;
    }
  </style>
  <script>
    function sendrequest() {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200 || xhr.status === 201) {                       // 서버랑 전송이 성공적일 떄
            console.log(xhr.responseText);
            document.getElementById("ajaxbutton").innerHTML = xhr.responseText; // 받은 데이터 다루기
          }else {
            console.error(xhr.responseText);
          }
        }
      }
      xhr.open('GET', 'http://localhost:3000/ajaxtest');      // 주소에 데이터 요청
      xhr.send();
    }
  </script>
</head>

<body>
  <header>
    <ul class = "menu">
      <li><a href="/home">게임하기</a></li>
      <li><a href="/rank">랭킹</a></li>
      <li><a href="/description">게임설명</a></li>
      <li><a href="/community">커뮤니티</a></li>
    </ul>
    <hr color = "#6799FF" size = "0.5px">
  </header>
  <button type="button" onclick="sendrequest()">아약스는네덜란드</button>
  <p id = "ajaxbutton"></p>
</body>
</html>
```
