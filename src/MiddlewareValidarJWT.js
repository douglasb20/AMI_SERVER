"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MiddlewareValidarJWT = (req, res, next) => {
    const jwt = req.headers["authorization"];
    const chavePrivada = process.env.KEY_JWT;
    const jwtService = require("jsonwebtoken");
    jwtService.verify(jwt, chavePrivada, (err, userInfo) => {
        if (err) {
            res.status(401).end("Error");
            return;
        }
        req.userInfo = userInfo;
        next();
    });
};
exports.default = MiddlewareValidarJWT;
