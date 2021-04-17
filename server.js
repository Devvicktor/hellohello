var http = require("http");
var fs = require("fs");


const webServer=http.createServer((req,res)=>{
    if (req.url === "/main.css") {
        fs.readFile("./main.css", function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/css" });
          res.write(data);
          res.end();
        });
      } else if (req.url === "/adapter.js") {
        fs.readFile("./adapter.js", function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/javascript" });
          res.write(data);
          res.end();
        });
      } else if (req.url === "/client.js") {
        fs.readFile("./client.js", function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/javascript" });
          res.write(data);
          res.end();
        });
      } else if (req.url === "/server.js") {
        fs.readFile("./server.js", function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/javascript" });
          res.write(data);
          res.end();
        });
      } else {
        fs.readFile("./index.html", function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        });
      }
})

const port = process.env.PORT || 3000;
webServer.listen(port, function () {
  console.log("Server is listening on port *:3000");
});
const io=require('socket.io')(webServer,{
    // cors: {
    //     origin: "http://localhost:3000",
    //     methods: ["GET", "POST"]
    // }
});
io.on('connection',(socket)=>{
    console.log('a user is connected')
    socket.on('chat message',(message)=>{
        console.log('user sent a message')
        console.log('message::' + message)
        io.emit('chat message', message);
    })
    socket.on('disconnect',()=>{
        console.log('user has disconnected')
    })
})

