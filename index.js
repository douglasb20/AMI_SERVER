"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const asterisk_ami_client_1 = __importDefault(require("asterisk-ami-client"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
try {
    const app = (0, express_1.default)();
    const server = http_1.default.createServer();
    const ami = new asterisk_ami_client_1.default({ reconnect: true, keepAlive: true });
    ami.connect(process.env.USER_AMI, process.env.PASS_AMI, { host: process.env.HOST_AMI, port: 5038, keepAlive: true }).then(function (e) {
        console.log('Connected to AMI');
        const wss = new ws_1.default.Server({ server });
        wss.on('connection', function connection(ws) {
            console.log('Client connected');
            ws.on('message', function incoming(message) {
                let action = JSON.parse(message.toString());
                ami.action(action, true)
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
        });
    }).catch((error) => console.log(error));
    app.get("/", (req, res) => {
        res.send("Olá");
    });
    const port = process.env.PORT || 8080;
    server.listen(port, () => {
        console.log('server runs on port ', port);
    });
}
catch (error) {
    console.log(error);
}
