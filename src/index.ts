// import WS from 'ws';
// @ts-ignore
import AMI from 'asterisk-ami-client';
import express from 'express';
import expressWs from 'express-ws';

try {
    const { app, getWss } = expressWs(express());
    const port            = process.env.PORT || 8080;
    const ami             = new AMI({ reconnect: true, keepAlive: true });
    
    expressWs(app);
    
    app.ws("/amiserver", async (ws, req) => {
        await ami.connect(process.env.USER_AMI, process.env.PASS_AMI, { host: process.env.HOST_AMI, port: 5038, keepAlive: true });
        
        console.log('Connected to AMI');
        console.log('Client connected');
        
        let wss = getWss();

        ami.action({
            Action   : "SIPpeers",
        }, true)
        
        ws.on('message', function (message: string) {
        
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

    app.listen(port, () => {
        console.log('server runs on port ', port);
    })
    
} catch (error) {
    console.log(error)
}