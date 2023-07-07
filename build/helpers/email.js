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
exports.emailOlvidePassword = exports.emailRegister = void 0;
//Importando dependencia para poder recibir email
const nodemailer_1 = __importDefault(require("nodemailer"));
//Datos para la confirmacion del registro
const emailRegister = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, nombre, token } = datos;
    //Obtenido de Mailtrap
    const transport = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const info = yield transport.sendMail({
        //Informacion de quien lo envio   
        from: '"Hospital -  Administracion de Hospitales" <hospital@adminpro.com>',
        //Email del usuario
        to: email,
        subject: "Hospital - Confirma tu cuenta",
        text: "Comprueba tu cuenta en Mykiu",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en adminpro</p>
        <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
        <a href = "https://ubiquitous-bublanina-fa06e5.netlify.app/confirmar/${token}">Comprobar Cuenta</a>       
       <p> Si tu no creaste esta cuente, puedes ignorar el mensaje </p>`
    });
});
exports.emailRegister = emailRegister;
//Datos para la confirmacion del registro
const emailOlvidePassword = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    //extrayendo llos datos
    const { email, nombre, token } = datos;
    //Obtenido de Mailtrap
    const transport = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    //   Informacion del Email
    const info = yield transport.sendMail({
        //Informacion de quien lo envio   
        from: '"Hospital -  Administrador de Proyecto" <hospital@adminPro.com>',
        //Email del usuario
        to: email,
        subject: "Hospital - Restablece tu password en AdminPro",
        text: "Restablece tu password en adminPro",
        html: `<p>Hola: ${nombre} has solicitado restablecer tu password en adminPro </p>
            <p>Sigue el siguiente enlace para generar un nuevo password:
            <a href = "https://ubiquitous-bublanina-fa06e5.netlify.app/nuevo-password/${token}">Restablecer Password</a>       
           <p> Si tu no solicitaste este email, puedes ignorar el mensaje </p>
            `
    });
});
exports.emailOlvidePassword = emailOlvidePassword;
