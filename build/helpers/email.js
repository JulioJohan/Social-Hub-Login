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
exports.emailForgetPassword = exports.emailRegister = void 0;
//Importando dependencia para poder recibir email
const mail_1 = __importDefault(require("@sendgrid/mail"));
//Datos para la confirmacion del registro
const emailRegister = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    // Estableciendo la api key 
    mail_1.default.setApiKey(process.env.SEND_GRID);
    // Extrayendo los datos del objeto
    const { email, nombre, token } = datos;
    // Contenido del correo
    const msg = {
        to: email,
        from: 'shub64127@gmail.com',
        subject: 'Social Hub - Verificacion de dos pasos',
        text: 'Comprueba tu cuenta en Social Hub',
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Social Hub</p>
        <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
        <a href = "http://localhost:4200/#/auth/confirm/${token}">Comprobar Cuenta</a>       
        <p> Si tu no creaste esta cuente, puedes ignorar el mensaje </p>`
    };
    // Envio del correo
    yield mail_1.default.send(msg).then(() => {
        console.log('Email Enviado');
    }).catch((error) => {
        console.error(error);
    });
    // const info = await transport.sendMail({
    //     //Informacion de quien lo envio   
    //     from:'"Hospital -  Administracion de Hospitales" <hospital@adminpro.com>',
    //       //Email del usuario
    //    to: email,
    //    subject: "Hospital - Confirma tu cuenta",
    //    text: "Comprueba tu cuenta en Mykiu",
    //    html:`<p>Hola: ${nombre} Comprueba tu cuenta en adminpro</p>
    //     <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
    //     <a href = "http://localhost:4200/confirmar/${token}">Comprobar Cuenta</a>       
    //    <p> Si tu no creaste esta cuente, puedes ignorar el mensaje </p>`
    // })
});
exports.emailRegister = emailRegister;
//Datos para la confirmacion del registro
const emailForgetPassword = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    // Estableciendo la api key 
    mail_1.default.setApiKey(process.env.SEND_GRID);
    //extrayendo los datos
    const { email, nombre, token } = datos;
    // Contenido del correo
    const msg = {
        to: email,
        from: 'shub64127@gmail.com',
        subject: 'Social Hub - Verificacion de dos pasos',
        text: "Restablece tu Contraseña en Social Hub",
        html: `<p>Hola: ${nombre} has solicitado restablecer tu password en Social Hub </p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href = "http://localhost:4200/#/auth/change-pass/${token}">Restablecer Password</a>       
        <p> Si tu no solicitaste este email, puedes ignorar el mensaje </p> `
    };
    // Envio del correo
    mail_1.default.send(msg).then(() => {
        console.log('Email sent');
    }).catch((error) => {
        console.error(error);
    });
});
exports.emailForgetPassword = emailForgetPassword;
