import  {Request, Response, NextFunction} from 'express';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken'

const MiddlewareValidarJWT = (req: Request, res: Response, next: NextFunction) => {
    const jwt          = req.headers["authorization"];
    const chavePrivada = process.env.KEY_JWT;

    // Efetuando a validação do JWT:
    const jwtService = require("jsonwebtoken");

    jwtService.verify(jwt, chavePrivada, (err: VerifyErrors, userInfo:JwtPayload) => {
        if (err) {
            res.status(401).end("Error");
            return;
        }

        // O objeto "req" é alterado abaixo
        // recebendo uma nova propriedade userInfo.
        // Este mesmo objeto chegará na rota
        // podendo acessar o req.userInfo
        // @ts-ignore
        req.userInfo = userInfo;
        next();
    });
};

export default MiddlewareValidarJWT;