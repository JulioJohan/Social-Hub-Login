"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDoubleAuthenticacion = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
// Doble Autenticación
const sendDoubleAuthenticacion = (datos) => {
    // Estableciendo la api key 
    mail_1.default.setApiKey(process.env.SEND_GRID);
    //extrayendo los datos
    const { email, nombre, authenticacionDoble } = datos;
    // Contenido del correo
    const msg = {
        to: email,
        from: 'shub64127@gmail.com',
        subject: 'Social Hub - Verificacion de dos pasos',
        text: 'Comprueba tu cuenta en Social Hub',
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Social Hub</p>
        <p>Tu codigo de verificacion es: ${authenticacionDoble}
        <p> Si tu no pediste el acceso a tu cuenta 
        cambia tu contraseña en la app de Social Hub</p>`
    };
    // Envio del correo
    mail_1.default.send(msg).then(() => {
        console.log('Email sent');
    }).catch((error) => {
        console.error(error);
    });
};
exports.sendDoubleAuthenticacion = sendDoubleAuthenticacion;
