```javascript
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet')
app.use(helmet());
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport') 
const localStrategy = require('passport-local').Strategy;
const port = 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));

const user = {
  email: 'aa',
  pwd: '456456'
};

// passport는 세션을 사용하기 때문에 세션 미들웨어 다음에 코드 삽입
// passport 초기 설정
app.use(passport.initialize()); 
app.use(passport.session());  // 내부적으로 세션 사용


// 로그인 성공시 세션 내부 처리 로직
passport.serializeUser((userInfo, done) => {
  console.log(`로그인 성공~~~ ${userInfo.email}`);
  done(null, userInfo.email); 
});

// deserializeUser 호출될 때 마다 세션 유저정보를 콜백함수 처음 파라미터에 던짐
passport.deserializeUser((id, done) =>{
  console.log('deserializeUser 호추우우우울');
  done(null, user);
});

const formNameforPassport = {
  usernameField: 'email',     // form 에서 전송할 아이디 name
  passwordField: 'pwd'        // form 에서 전송할 비번 name
};

passport.use(new localStrategy(formNameforPassport,
  (username, pwd, done) => {
    console.log(`localStrategy ${username} , ${pwd}`);
    if (username === user.email && pwd === user.pwd) {
      return done(null, user);      // serializeUser 함수에 user 넘김
    }else{
      return done(null, false, {
        message: 'incorrect username or password'
      });
    }
  }
));

app.post('/login_process', 
  passport.authenticate('local', {    // local 유저아이디 pwd 로 로그인한다.
    failureRedirect: '/login'
  }), (request, response, next) => {    // 세션 안전저장위해 콜백 호출
    request.session.save(() => {
      response.redirect('/');
    })
  });

function htmlTemplate(isLogined) {
  const loginStatus = isLogined ? 
  `<a href='/logout'>logout</a>`:
  `<a href='/login'>login</a>`;

  return `<!doctype html>
          <html>
          <head>
            <title>passport</title>
            <meta charset="utf-8">
          </head>
          <body>
            ${loginStatus}
          </body>
          </html>`;
}


app.get('/login', (request, response, next) => {
  response.send( `<!doctype html>
            <html>
            <head>
              <title>sibal...</title>
              <meta charset="utf-8">
            </head>
            <body>
            <form action ="/login_process" method="post"> 
              <p><input type = "text" name="email" placeholder="id"></p>
              <p><input type = "password" name="pwd" placeholder="pwd"></p>
              <p><input type="submit"></p>
            </form>
            </body>
            </html>`);
});


app.get('/login_process', function (request, response, next) {
  console.log('/create_login input getgetget');
  var post = request.query;
  var email = post.email;
  var password = post.pwd;

  if (user.email === email && user.pwd === password) {
    response.status(200).send('welcome ~~~~~~~~~~');
  }
  else {
    response.status(200).send('login fail,,,');
  }
});


app.get('/logout', (request,response,next) => {
  request.logout();
  request.session.save(() => {      // 저장하고 리다이렉트 
    response.redirect('/');
  })
});


app.get('/', (request, response, next) => {
  response.send(htmlTemplate(request.user));
});


app.use(function(request, response, next) {
  response.status(404).send('Sorry cant find that!');
});


app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});


app.listen(port, function () {
  console.log(`waiting... ${port}`);
});
```
