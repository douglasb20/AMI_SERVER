"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asterisk_ami_client_1 = __importDefault(require("asterisk-ami-client"));
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
try {
    const { app, getWss } = (0, express_ws_1.default)((0, express_1.default)());
    const port = process.env.PORT || 8080;
    const ami = new asterisk_ami_client_1.default({ reconnect: true, keepAlive: true });
    (0, express_ws_1.default)(app);
    app.ws("/amiserver", (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
        yield ami.connect(process.env.USER_AMI, process.env.PASS_AMI, { host: process.env.HOST_AMI, port: 5038, keepAlive: true });
        console.log('Connected to AMI');
        console.log('Client connected');
        let wss = getWss();
        ami.action({
            Action: "SIPpeers",
        }, true);
        ws.on('message', function (message) {
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
    }));
    app.listen(port, () => {
        console.log('server runs on port ', port);
    });
}
catch (error) {
    console.log(error);
}