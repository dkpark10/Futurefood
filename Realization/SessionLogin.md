## 간단 세션로그인

```javascript
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const port = 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))

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

const user = {
  email: 'aa',
  pwd: '456456'
};

app.post('/login_process', function (request, response, next) {

  console.log('/create_login input post post post');
  const post = request.body;
  const password = post.pwd;
  const email = post.email;

  if (user.email === email && user.pwd === password) {

    request.session.email = user.email;
    request.session.isLogined = true;

    console.log('성공.......');

    request.session.save(function () {
      response.redirect('/');
    });
  } else {
    response.status(200).send('login fail,,,');
  }
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


app.get('/logout', function(request,response,next){
  request.session.destroy(function(err){
    response.redirect('/');
  });
});


app.get('/', (request, response, next) => {
  response.send(htmlTemplate(request.session.isLogined));
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
