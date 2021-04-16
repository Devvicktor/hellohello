const http = require("http");
const fs = require ('fs');
const port=process.env.PORT || 5500;
fs.readFile ('./index.html', function (err, data) {
    if (err) {
      throw err;
    }
    htmlFile = data;
  });

  fs.readFile ('./main.css', function (err, data) {
    if (err) {
      throw err;
    }
    cssFile = data;
  });
  fs.readFile ('./main.js', function (err, data) {
    if (err) {
      throw err;
    }
    mainJS = data;
  })
const server = http.createServer((request, response) => {
    switch (request.url) {
        case '/main.css':
          response.writeHead (200, {'Content-Type': 'text/css'});
          response.write (cssFile);
          break;
        case '/main.js':
          response.writeHead (200, {'Content-Type': 'text/javascript'});
          response.write (mainJS);
          break;


        default:
          response.writeHead (200, {'Content-Type': 'text/html'});
          response.write (htmlFile);
      }
      response.end ();
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})