const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const sanitizehtml = require('sanitize-html');

const template = {

  Html (title,list,body,control) {
    return `
          <!doctype html>
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
          </html>`;  
  },
  List (data){
    let list = '<ul>';
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].substr(0, data[i].length - 4);
      list += `<li><a href="/?id=${data[i]}">${data[i]}</a></li>`;
    }
    list += '</ul>'
    return list;    
  }
}

const app = http.createServer((request, response) =>{   // req == 클라로 들어온 객체데이터 
                                                        // res == 클라에게 응답하는 객체
  const _url = request.url;
  console.log(`url === ${_url}`);
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  let title = queryData.id;

  if(pathname === '/'){
    if(queryData.id === undefined){
        fs.readdir('./data', (err,filelist) =>{
          if (err) {
            throw err;
          }
          console.log(filelist);
          const title = 'welcome';
          const description = 'hawi node';
          const list = template.List(filelist);
          
          response.writeHead(200);
          // response.end(templateHtml(title,list,`<h1>${title}</h2>${description}`,
          // `<a href="/create">create</a>`));
          response.end(template.Html(title,list,`<h1>${title}</h2>${description}`,
          `<a href="/create">create</a>`));
        }); 

    }else{
      fs.readdir('./data', (err,filelist) =>{
        if (err) {
          throw err;
        }
        const filterid = path.parse(queryData.id).base;
        fs.readFile(`data/${filterid}.txt`, 'utf8', (err, data) => {
          const title = queryData.id;

          const description = data;
          const list = template.List(filelist);

          const sanitizetitle = sanitizehtml(title);                        // 세에탁       
          const sanitizedesciption = sanitizehtml(description);

          response.writeHead(200);
          response.end(template.Html(sanitizetitle,list,`<h1>${sanitizetitle}</h1>${sanitizedesciption}`,
          `<a href = "/create">create</a> 
          <a href="/update?id=${sanitizetitle}">update</a>
          <form action = "delete_process" method = "post">
            <input type = "hidden" name="id" value = "${sanitizetitle}">
            <input type = "submit" value = "delete">
          </form>`));
        });
      });
    }
  } else if(pathname === '/create') {
    fs.readdir('./data', (err,filelist) =>{
      if (err) {
        throw err;
      }
      const title = 'Web-Create';
      const list = template.List(filelist);
      
      response.writeHead(200);
      response.end(template.Html(title,list,
        `<form action="/create_process" method="post">  
        <div>
            <input type="text" name = "title" placeholder = "input title"></div>
        <div>    
            <textarea name = "description" placeholder = "description"></textarea>
        </div>
        <div>
            <input type="submit">
        </div>
    </form>`,''));  
    });    
  }else if(pathname === '/create_process'){
    let body = '';
    request.on('data', (data)=>{  
      body += data;
    });
    request.on('end',()=>{      // 데이터 수신 다 받았을 때
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      fs.writeFile(`data/${title}.txt`, description, 'utf8',(err) =>{
        if(err){
          throw err;
        }
        response.writeHead(302,{Location: `/?id=${title}`});
        response.end();
      })
    });
  }else if(pathname === '/update'){
    fs.readdir('./data', (err,filelist) =>{
      if (err) {
        throw err;
      }
      const filterid = path.parse(queryData.id).base;
      fs.readFile(`data/${filterid}.txt`, 'utf8', (err, data) => {
        const title = queryData.id;
        const description = data;
        const list = template.List(filelist);

        response.writeHead(200);
        response.end(template.Html(title,list,
          `<form action="/update_process" method="post">  
          <input type = "hidden" name = "id" value = "${title}">
          <div>
              <input type="text" name = "title" placeholder = "input title" value = "${title}"></div>
          <div>    
              <textarea name = "description" placeholder = "description">${description}</textarea>
          </div>
          <div>
              <input type="submit">
          </div>
      </form>`,
        `<a href = "/create">create</a> <a href="/update?id=${title}">update</a>`));
      });
    });
  }else if(pathname==='/update_process'){
    let body = '';
    request.on('data', (data)=>{  
      body += data;
    });
    request.on('end',()=>{                  // 데이터 수신 다 받았을 때
      const post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;
      fs.rename(`data/${id}.txt`, `data/${title}.txt`, (err) => {
        if(err){
          throw err;
        }
        fs.writeFile(`data/${title}.txt`, description, 'utf8', (err) => {
          if (err) {
            throw err;
          }
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        })
      });
    });
  }else if(pathname==='/delete_process'){
    let body = '';
    request.on('data', (data) =>{
      body += data;
    });
    request.on('end', ()=>{
      const post = qs.parse(body);
      const id = post.id;
      const filterid = path.parse(id).base;

      fs.unlink(`data/${filterid}.txt`, (err)=>{
        response.writeHead(302, {Location :`/`}); 
        response.end();
      })
    })
  }else{
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(3000, () =>{
  console.log("waiting... 3000");
});
