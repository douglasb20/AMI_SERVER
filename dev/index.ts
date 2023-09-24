// @ts-ignore
import AMI from 'asterisk-ami-client';
import express, {Request, Response, NextFunction} from 'express';
import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import MiddlewareValidarJWT from './MiddlewareValidarJWT';
import AmiServer from './AmiServer';


try {
    const { app, getWss } = expressWs(express());
    const port            = process.env.PORT || 8080;
    const ami             = new AMI({ reconnect: true, keepAlive: true });
    let amiConected       = false;

    ami
        .connect(process.env.USER_AMI, process.env.PASS_AMI, { host: process.env.HOST_AMI, port: 5038, keepAlive: true })
        .then(() => {
            amiConected = true
            console.log('Connected to AMI');            
        })
        .catch((err:any) => console.log("Error"))


    var allowedOrigins = [process.env.URL_ORIGIN];
    expressWs(app);

    app.use(bodyParser.json());
    // app.use(
    //     cors(
    //         {
    //             origin: function(origin, callback){
                    
    //                 if(!origin) return callback(null, true);
    //                 if(allowedOrigins.indexOf(origin) === -1){
    //                     var msg = 'The CORS policy for this site does not ' +
    //                                 'allow access from the specified Origin.';
    //                     return callback(new Error(msg), false);
    //                 }
                    
    //                 return callback(null, true);
    //             }
    //         }
    //     )
    // );

    // @ts-ignore
    app.ws("/amiserver", async (ws, req) => {
        if (amiConected) {
            AmiServer(ws, getWss, ami)
        }
    });

    app.listen(port, () => {
        console.log('server runs on port ', port);
    });
    
} catch (error) {
    console.log(error)
}