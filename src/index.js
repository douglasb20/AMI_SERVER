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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const AmiServer_1 = __importDefault(require("./AmiServer"));
try {
    const { app, getWss } = (0, express_ws_1.default)((0, express_1.default)());
    const port = process.env.PORT || 8080;
    const ami = new asterisk_ami_client_1.default({ reconnect: true, keepAlive: true });
    let amiConected = false;
    ami.connect(process.env.USER_AMI, process.env.PASS_AMI, { host: process.env.HOST_AMI, port: 5038, keepAlive: true })
        .then(() => amiConected = true);
    console.log('Connected to AMI');
    var allowedOrigins = [process.env.URL_ORIGIN];
    (0, express_ws_1.default)(app);
    app.use(body_parser_1.default.json());
    app.use((0, cors_1.default)({
        origin: function (origin, callback) {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    }));
    app.ws("/amiserver", (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
        if (amiConected) {
            (0, AmiServer_1.default)(ws, getWss, ami);
        }
    }));
    app.listen(port, () => {
        console.log('server runs on port ', port);
    });
}
catch (error) {
    console.log(error);
}
