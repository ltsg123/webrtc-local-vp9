const app = require("express")();
const wsInstance = require("express-ws")(app);

app.ws("/", (ws) => {
  if (wsInstance.getWss().clients.size === 2) {
    console.log("都进入频道了！");
    wsInstance.getWss().clients.forEach((server) => {
      server.send(
        JSON.stringify({
          type: "start_live",
        })
      );
    });
  }
  ws.on("message", (data) => {
    // 未做业务处理，收到消息后直接广播
    wsInstance.getWss().clients.forEach((server) => {
      if (server !== ws) {
        server.send(data);
      }
    });
  });
});

app.listen(8080);
