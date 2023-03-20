const SSLPORT = 8080;

const ip = require("ip");
const myip = ip.address();
const HOST_NAME = myip;

const app = require("express")();
const express = require("express");
const fs = require("fs");
const https = require("https");
const privateKey = fs.readFileSync("/Users/config/key.pem", "utf8");
const certificate = fs.readFileSync("/Users/config/cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(SSLPORT, HOST_NAME, function () {
  console.log(`HTTPS Server is running on https://${myip}:${SSLPORT}`);
  console.log(`WSS Server is running on wss://${myip}:${SSLPORT}`);
});

const socket = require("ws");
const SocketServer = socket.Server;
const wss = new SocketServer({ server: httpsServer });
wss.on("connection", function connection(ws) {
  if (wss.clients.size >= 2) {
    wss.clients.forEach((server) => {
      server.send(
        JSON.stringify({
          type: "start_live",
        })
      );
    });
  }
  ws.onmessage = (e) => {
    wss.clients.forEach((server) => {
      if (server !== ws) {
        server.send(e.data);
      }
    });
  };
});

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.use(express.static(__dirname + "/"));
