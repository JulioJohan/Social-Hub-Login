"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//
const generateJWT = (uid) => {
    //
    return new Promise((resolve, reject) => {
        //lo que enviaremos para certificar
        const payload = {
            uid,
        };
        //firmar el payload, el token y duracion de lo que dura el token
        jsonwebtoken_1.default.sign(payload, `${process.env.JWT_SECRET}`, {
            expiresIn: '10m',
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject('No se pudo generar el JWT');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generateJWT = generateJWT;
const verificarToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`, (error, decode) => {
            if (error) {
                console.log(error);
                reject('No se pudo generar el JWT');
            }
            else {
                const fechaExpiracionLocal = new Date(decode.exp * 1000).toLocaleString();
                const fechaInicalLocal = new Date(decode.iat * 1000).toLocaleString();
                const fechaInicial = new Date(fechaInicalLocal);
                const fechaExpiracion = new Date(fechaExpiracionLocal);
                const fechas = {
                    fechaInicial,
                    fechaExpiracion
                };
                resolve(fechas);
            }
        });
    });
};
exports.verificarToken = verificarToken;
