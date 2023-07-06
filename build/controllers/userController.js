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
exports.userController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_1 = require("../helpers/email");
const user_1 = require("../models/user");
const generateId_1 = require("../helpers/generateId");
const firebase_1 = require("../databases/firebase");
// Asignando la imagen estatica
// cuando el usuario creara la cuenta tendra esta foto de perfil por defecto
const IMG_USER_NEW = 'https://firebasestorage.googleapis.com/v0/b/socialhub-30934.appspot.com/o/users%2Ffacebook-user-icon-19.jpg?alt=media&token=9d260fe4-3942-4a47-a5fc-8e7c04ee40a6';
class UserController {
    //Busqueda por Id si se requiere
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // obteniendo el parametro id para la busqueda por id
            const id = req.params.id;
            // Creando una variable donde almacenaria el usuario
            let user;
            try {
                user = yield user_1.User.findByPk(id);
            }
            catch (error) {
                console.log(error);
                return res.json({
                    ok: false,
                    msg: 'Error en conexión de base de datos'
                });
            }
            if (!user) {
                return res.json({
                    ok: false,
                    msg: 'El usuario no existe en la base de datos'
                });
            }
            res.json({
                ok: true,
                msg: 'Busqueda por id se consulto correctamente'
            });
        });
    }
    // async getUsuarios(req: Request, res: Response) {
    //     const desde = Number(req.query.desde) || 0;
    //     //colleccion de promesas para que lo haga mas rapido
    //     // hace que hago todo a la vez
    //     // se desestructura los resultados el primero son los usuarios obtenidos y el otro el total
    //     const [usuarios, total] = await Promise.all([
    //         Usuario
    //             .find({}, 'nombre email role google img')
    //             .skip(desde)
    //             .limit(5),
    //         Usuario.countDocuments()
    //     ])
    //     res.json({
    //         ok: true,
    //         usuarios,
    //         total
    //     })
    // }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, name } = req.body;
            const user = req.body;
            let token;
            // res.send(guardarUsuario);
            try {
                //Busqueda por email con el where con el orm bycript 
                const existeEmail = yield user_1.User.findOne({ where: { email: email } });
                if (existeEmail) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El correo ya esta registrado'
                    });
                }
                //Encriptar password
                const salt = bcrypt_1.default.genSaltSync();
                user.password = bcrypt_1.default.hashSync(password, salt);
                // Genera un token de numero y letras aleotorio para mandarlo al usuario
                user.email_verified = generateId_1.generateToken.generateTokenMethod();
                user.avatar = IMG_USER_NEW;
                //Guardar usuario
                const userNew = yield user_1.User.create(user);
                console.log(`IUsuario ${userNew}`);
                // token = await generateJWT(userNew.id_user);
                (0, email_1.emailRegister)({
                    //Le enviaremos el email
                    email: user.email,
                    //Enviando el nombre 
                    nombre: user.name,
                    //Enviando el token
                    token: user.email_verified
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Error inesperado '
                });
            }
            res.json({
                ok: true,
                msg: 'Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta',
                user,
                token
            });
        });
    }
    updateUser(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Extraer la informacion que el usuario puede actualizar
            const { name, email, password, age, dateBirth, fatherLastName, avatar } = req.body;
            // Obteniendo el archvo para guardar
            const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.multimedia;
            // creando un objeto y asignando información de lo que recibimos
            const userNew = {
                name: name,
                email: email,
                password: password,
                age: age,
                date_birth: dateBirth,
                father_last_name: fatherLastName,
                avatar: avatar
            };
            try {
                //tomando el id que nos manda el usuario
                const uid = req.params.id;
                //buscamos si existe el usuario
                const usuarioDB = yield user_1.User.findByPk(uid);
                // console.log(usuarioDB?._id)
                //si el usuario no esta
                if (!usuarioDB) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'No existe un usuario con ese id'
                    });
                }
                //si el usuario manda un diferente correo 
                if (usuarioDB.email !== email) {
                    // delete campos.email;
                    //bucamos si ya existe
                    const existeEmail = yield user_1.User.findOne({ where: { email: email } });
                    //si existe mandamos un error
                    if (existeEmail) {
                        return res.status(400).json({
                            ok: false,
                            msg: 'Ya existe un usuario con ese email'
                        });
                    }
                }
                // Si el usuario actualiza su contraseña
                if (usuarioDB.password !== password) {
                    //Encriptar password
                    const salt = bcrypt_1.default.genSaltSync();
                    // generando aleatoriamento la contraseña
                    userNew.password = bcrypt_1.default.hashSync(password, salt);
                }
                // si el usuario desea actualizar la imagen subira la imagen a firevase
                if (file != undefined) {
                    const newAvater = yield (0, firebase_1.uploadFileFirebase)(file);
                    // Asignar la url
                    userNew.avatar = newAvater;
                }
                // Actualizando información
                const usuarioActualizado = yield user_1.User.update(userNew, {
                    // Poniendo condicion donde se actualizara
                    where: {
                        id_user: uid
                    }
                });
                // console.log(usuarioActualizado)
                // Si todo sale correcto 
                res.json({
                    ok: true,
                    usuarioActualizado,
                    msg: 'La información se actualizó correctamente'
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // Eliminar el usuario 
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtenemos el id del parametro
                const uid = req.params.id;
                // buscamos si existe el usuario
                const usuarioDB = yield user_1.User.findByPk(uid);
                // si el usuario no esta
                if (!usuarioDB) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'No existe un usuario'
                    });
                }
                // Eliminando donde esta el id
                yield user_1.User.destroy({
                    where: {
                        id_user: uid
                    }
                });
                // Si todo sale correcto se manda el mensaje
                res.json({
                    ok: true,
                    msg: "Usuario Eliminado"
                });
            }
            catch (error) {
                // console.log(error);
                res.json({
                    ok: false,
                    msg: "Error inesperado"
                });
            }
        });
    }
}
exports.userController = new UserController();
