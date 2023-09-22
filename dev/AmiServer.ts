
// @ts-ignore
const AmiServer = (ws, getWss, ami) => {
    console.log('Client connected');
    let wss = getWss();

    ws.send(JSON.stringify({
        Event: "ConnectionStatus",
        status: "OK"
    }))

    ami.action({
        Action   : "SIPpeers",
    }, true)
    
    ws.on('message', function (message: string) {
    
        let action = JSON.parse(message.toString());

        ami
        .action(action, true)
        .catch((error:any) => console.log(error));
        
        console.log('Received message:', action);
    });
    
    ami.on('event', (event: any) => {
        // Converte o objeto de evento em uma string JSON
        const message = JSON.stringify(event);

        // Envia a mensagem para todos os clientes WebSocket conectados
        ws.send(message);
    });
    
    ws.on("close", function () {
        ws.close();
        console.log("Conexao finalizado");
        if (wss.clients.size === 0) {
            ami.action({
                Action: "Logoff"
            })
        }
    })
}


export default AmiServer;