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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../helpers/jwt");
const generateId_1 = require("../helpers/generateId");
const email_1 = require("../helpers/email");
const speakeasy_1 = __importDefault(require("speakeasy"));
const doble_authenticacion_1 = require("../helpers/doble-authenticacion");
const user_1 = require("../models/user");
// Clase Login para todos los metodos que se va a requerir
class Login {
    // Metodo Asincrono para el metodo login
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obteniendo las propiedades del objeto
            const { email, password } = req.body;
            try {
                // Buscamos por correo el usuario
                const userDB = yield user_1.User.findOne({ where: { email: email } });
                //Verificar email si existe
                if (!userDB) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'El email no fue encontrado'
                    });
                }
                // Verificando si la cuenta esta confirmada
                if (!userDB.confirmed) {
                    return res.status(403).json({
                        ok: false,
                        msg: 'Tu cuenta no esta confirmada'
                    });
                }
                //Verificar password
                // password = lo que envia el usuario
                // usuarioDB
                const checkPassword = bcrypt_1.default.compareSync(password, userDB.password);
                //Mandando Mensaje al usuario si la contraseña es valida
                if (!checkPassword) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'La contraseña no es valida',
                    });
                }
                // Generando Key alaeorio para doble autenticacion
                const multiFactorAuthentication = speakeasy_1.default.generateSecret({ length: 5 });
                // Asignando la key para guardarlo a la base de datos
                userDB.multi_factor_authentication = multiFactorAuthentication.base32;
                // Guardando la ket
                yield userDB.save();
                // Enviar Doble Authenticacion por email
                (0, doble_authenticacion_1.enviarDobleAuthenticacion)({
                    id: userDB.id_user,
                    email: userDB.email,
                    nombre: userDB.name,
                    authenticacionDoble: userDB.multi_factor_authentication
                });
                res.json({ msg: 'Hemos enviado un email con tu codigo de verificación', ok: true });
                // this.comprobarDobleAuthenticacion(req,res);
                // const codigo = enviarTokenSMS();
                //Generar el token - JWT
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: "Error inesperado auth"
                });
            }
        });
    }
    // async googleSingIn(req:Request,res:Response){
    //     try {
    //         const googleUser:any = await googleVerify(req.body.token)
    //         const {email,name, picture} = googleUser;
    //         const usuarioDB = await Usuario.findOne({email})
    //         let usuario;
    //         if(!usuarioDB){
    //             usuario = new Usuario({
    //                 nombre: name,
    //                 email,
    //                 password:'@@@',
    //                 img:picture,
    //                 google:true,
    //                 confirmado: true
    //             }) 
    //         }else{
    //             usuario = usuarioDB;
    //             usuario.google = true;
    //             usuario.confirmado = true;
    //         }
    //         //Guardar Usuario
    //         await usuario.save();
    //         //Generar el token - JWT
    //         const token = await generarJWT(usuario.id);
    //         res.status(200).json({
    //             ok:true,
    //             msg:email,name,picture,token,
    //             menu: getMenuFrontEnd (usuario.role)
    //         })
    //     } catch (error) {
    //         console.log(error)
    //         res.status(400).json({
    //             ok:false,
    //             msg: 'No se puedo con google sign'
    //         })
    //     }
    // }
    // async renewToken(req: any, res: Response) {
    //     console.log("entre 2")
    //     //obteniendo el uid
    //     let uid;
    //     console.log("uid" + req.uid.uid)
    //     if (req.uid.uid) {
    //         uid = req.uid.uid;
    //     } else {
    //         uid = req.uid
    //     }
    //     console.log(uid);
    //     //Generar el token - JWT
    //     const token = await generarJWT(uid);
    //     //Buscar por id  
    //     const usuarioDB = await Usuario.findById(uid)
    //     console.log("Renovando Token"+token)
    //     res.json({
    //         ok: true,
    //         token,
    //         usuarioDB,
    //         menu: getMenuFrontEnd (usuarioDB?.role)
    //     })
    // }
    // Metodo para confirmar el email
    confirmEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(req.params.token)
            // obtenermos el parametro
            const { email_verified } = req.params;
            //buscando un usuario con ese token    
            const userConfirmed = yield user_1.User.findOne({ where: { email_verified: email_verified } });
            // Si no existe el token mandamos al usuario que no es valido
            if (!userConfirmed || userConfirmed === null) {
                return res.json({
                    msg: "token no valido",
                    ok: false
                });
            }
            try {
                //Si el usuario tiene el token correctamente se vuelve a true
                userConfirmed.confirmed = true;
                //Modificando el token porque solo se genera una vez para confirmar la cuenta
                userConfirmed.email_verified = "";
                //Almacenando en la base de datos
                yield userConfirmed.save();
                res.json({ ok: true, msg: 'Usuario Confirmado Correctamente' });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // Olvidamos Password
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtenemos el email
            const { email } = req.body;
            // Buscamos en la bse de datos el email
            const user = yield user_1.User.findOne({ where: { email: email } });
            console.log(user);
            // Verificando si el correo o usuario existe
            if (!user || user === null) {
                res.json({
                    msg: "El usuario no existe",
                    ok: false
                });
            }
            try {
                //Generando token
                user.multi_factor_authentication = generateId_1.generateToken.generateTokenMethod();
                yield (user === null || user === void 0 ? void 0 : user.save());
                // Envinado El password
                (0, email_1.emailOlvidePassword)({
                    //Le enviaremos el email
                    email: user.email,
                    //Enviando el nombre 
                    nombre: user.name,
                    //Enviando el token
                    token: user.multi_factor_authentication
                });
                //enviando el mensaje al usuario
                res.json({ msg: 'Hemos enviado un email con las instrucciones' });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    newPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obteniendo el token para validar que el token funcione
            const { tokenPassword } = req.params;
            // Obteniendo el nuevo password
            const { password } = req.body;
            console.log(password + "password");
            console.log(tokenPassword + "tokenPassword");
            // Buscando si realmente existe ese token
            const user = yield user_1.User.findOne({ where: { multi_factor_authentication: tokenPassword } });
            // Enviando si el token realmente existe
            if (!user) {
                res.json({
                    ok: false,
                    msg: 'El token no es valido',
                });
            }
            try {
                //Encriptar password
                const salt = bcrypt_1.default.genSaltSync();
                user.password = bcrypt_1.default.hashSync(password, salt);
                user.multi_factor_authentication = "";
                yield user.save();
                res.json({
                    msg: 'La Contraseña se actualizo correctamente',
                    ok: false
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // Verificando el token del password
    checkTokenPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obteniendo el token de los parametros
            const { tokenPassword } = req.params;
            // Buscando en la base de datos
            const tokenValidar = yield user_1.User.findOne({ where: { multi_factor_authentication: tokenPassword } });
            // Si el token no existe mandamos mensjae al usuario
            if (!tokenValidar) {
                res.json({
                    msg: 'Token no valido',
                    ok: false
                });
            }
            // Si el token existe continuemos con el proceso del nuevo password
            if (tokenValidar) {
                res.json({
                    msg: 'Token Valido el Usuario existe',
                    ok: true
                });
            }
        });
    }
    // async comprobarIdUsuario(req:Request, res:Response){
    //     const idParam = req.params.uid;
    //     const usuarioDB = Usuario.findById(idParam);
    //     if(!usuarioDB){
    //         res.status(403).json({
    //             msg:'El usuario no existe',
    //             ok:false
    //         })
    //     }           
    // }
    // async verificarTiempoSesion(req:any,res:Response){
    //     const token:string = req.get('x-token');
    //     if(!token){
    //         res.status(400).json({
    //             ok:false,
    //             msg:'El token no es valido'
    //         })
    //     }
    //     const fechaToken = await verificarToken(token);
    //     res.json({
    //         ok:true,
    //         fechaToken
    //     })
    // }
    // Doble autenticacion
    checkDoubleAuthentication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            // Obtenemos el email de lo que envia el usuario
            const { email } = user;
            console.log("checkDoubleAuthentication");
            console.log(user);
            try {
                // Buscamos si realmente existe eL usuario
                const userDB = yield user_1.User.findOne({ where: { email: email } });
                if (!userDB) {
                    return res.status(403).json({
                        ok: false,
                        msg: 'No existe este usuario'
                    });
                }
                //Verificando si realmente existe doble autenticacion 
                if (user.multi_factor_authentication !== userDB.multi_factor_authentication) {
                    return res.status(403).json({
                        ok: false,
                        msg: 'El codigo de verificacion es incorrecto'
                    });
                }
                // Enviando el token para el inicio de sesion 
                const token = yield (0, jwt_1.generateJWT)(userDB.id_user);
                console.log("token expiracion");
                console.log(token.exp);
                res.json({
                    ok: true,
                    msg: token,
                    // menu: getMenuFrontEnd (userDB.role)
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error
                });
            }
        });
    }
}
exports.login = new Login();
