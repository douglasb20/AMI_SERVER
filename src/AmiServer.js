"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AmiServer = (ws, getWss, ami) => {
    console.log('Client connected');
    let wss = getWss();
    ws.send(JSON.stringify({
        Event: "ConnectionStatus",
        status: "OK"
    }));
    ami.action({
        Action: "SIPpeers",
    }, true);
    ws.on('message', function (message) {
        let action = JSON.parse(message.toString());
        ami
            .action(action, true)
            .catch((error) => console.log(error));
        console.log('Received message:', action);
    });
    ami.on('event', (event) => {
        const message = JSON.stringify(event);
        ws.send(message);
    });
    ws.on("close", function () {
        ws.close();
        console.log("Conexao finalizado");
        if (wss.clients.size === 0) {
            ami.action({
                Action: "Logoff"
            });
        }
    });
};
exports.default = AmiServer;
