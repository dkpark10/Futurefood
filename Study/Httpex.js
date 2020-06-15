const http = require('http');
const fs = require('fs');
const url = require('url');

const templateHtml = (title,list,body) =>{
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
            <a href = "/create">create</a>
            ${body}
          </body>
          </html>`;  
}

const templateList = (data) => {
  let list = '<ul>';
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].substr(0, data[i].length - 4);
    list += `<li><a href="/?id=${data[i]}">${data[i]}</a></li>`;
  }
  list += '</ul>'
  return list;
}

const app = http.createServer((request, response) =>{
  const _url = request.url;
  console.log(`url === ${_url}`);
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  let title = queryData.id;

  if(pathname === '/'){
    if(queryData.id === undefined){
        fs.readdir('./data', (err,data) =>{
          if (err) {
            throw err;
          }
          console.log(data);
          const title = 'welcome';
          const description = 'hawi node';
          const list = templateList(data);
          
          response.writeHead(200);
          response.end(templateHtml(title,list,`<h1>${title}</h2>${description}`));
        });

    }else{
      fs.readdir('./data', (err,filelist) =>{
        if (err) {
          throw err;
        }
        console.log(filelist);
        fs.readFile(`data/${queryData.id}.txt`, 'utf8', (err, data) => {
          const title = queryData.id;
          const description = data;
          const list = templateList(filelist);

          response.writeHead(200);
          response.end(templateHtml(title,list,`<h1>${title}</h2>${description}`));
        });
      });
    }
  } else if(pathname === '/create') {
    fs.readdir('./data', (err,data) =>{
      if (err) {
        throw err;
      }
      const title = 'Web-Create';
      const list = templateList(data);
      
      response.writeHead(200);
      response.end(templateHtml(title,list,
        `<form action="http://localhost:3000/process_create" method="post">  
        <div>
            <input type="text" name = "title" placeholder = "input title"></div>
        <div>
            <textarea name = "description" placeholder = "description"></textarea>
        </div>
        <div>
            <input type="submit">
        </div>
    </form>`));
    });
  }else{
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(3000, () =>{
  console.log("waiting... 8080");
});
