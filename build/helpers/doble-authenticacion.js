"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarDobleAuthenticacion = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const enviarDobleAuthenticacion = (datos) => {
    const { email, nombre, authenticacionDoble } = datos;
    const trasnsportarEmail = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const informacion = trasnsportarEmail.sendMail({
        from: '"Social Hub - Redes Sociales" <socialhub@support.com>',
        //Email del usuario
        to: email,
        subject: "Social Hub - Verificacion de dos pasos",
        text: "Comprueba tu cuenta en Social Hub",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Social Hub</p>
        <p>Tu codigo de verificacion es: ${authenticacionDoble}
       <p> Si tu no pediste el acceso a tu cuenta 
        cambia tu contraseña en la app de Social Hub</p>`
    });
};
exports.enviarDobleAuthenticacion = enviarDobleAuthenticacion;
