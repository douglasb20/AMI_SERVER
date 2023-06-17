import WS from 'ws';
// @ts-ignore
import AMI from 'asterisk-ami-client';
import express from 'express';
import http from 'http';
import cors from 'cors'

try {
    const app = express();
    const server = http.createServer();
    const ami = new AMI({ reconnect: true, keepAlive: true });
    
    // app.use(cors());
    
    ami.connect(process.env.USER_AMI, process.env.PASS_AMI, { host: process.env.HOST_AMI, port: 5038,keepAlive: true }).then(function (e:any) {
        console.log('Connected to AMI');
        const wss = new WS.Server({server});
        
        wss.on('connection', function connection(ws) {
            console.log('Client connected');
            
            ws.on('message', function incoming(message) {
                let action = JSON.parse(message.toString());
                
                ami.action(action, true)
                .catch((error:any) => console.log(error));
                
                console.log('Received message:', action);
            });
            
            ami.on('event', (event:any) => {
                // Converte o objeto de evento em uma string JSON
                const message = JSON.stringify(event);
        
                // Envia a mensagem para todos os clientes WebSocket conectados
                ws.send(message);
            })
            ws.on("close", function () {
                ws.close();
                console.log("Conexao finalizado");
                if (wss.clients.size === 0) {
                    ami.action({
                        Action: "Logoff"
                    })
                }
            })
        })
        
    }).catch((error: any) => console.log(error))

    app.get("/", (req, res) => {
        res.send("Olá")
    })

    const port = process.env.PORT || 8080;
    server.listen(port, () => {
        console.log('server runs on port ', port);
    })
    
} catch (error) {
    console.log(error)
}