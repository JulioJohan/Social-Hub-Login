"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import Usuario from '../models/usuario';
const validarJWT = (req, res, next) => {
    //Leer el token en los headers
    const token = req.header('x-token');
    if (!token) {
        return res.status(404).json({
            ok: false,
            msg: "No hay token en la peticion"
        });
    }
    /* tslint:disable:no-unused-variable */
    try {
        //verificar el token 
        const uid = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        //obtengo el uid del usuario
        req.uid = uid;
        next();
    }
    catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "token no valido"
        });
    }
};
exports.validarJWT = validarJWT;
// export const validarAdminRole = async (req:any,res:Response,next:any) =>{
//     const uid = req.uid;
//     try {
//         const usuarioDB = await Usuario.findById(uid);
//         if(!usuarioDB){
//             return res.status(404).json({
//                 ok:false,
//                 msg:'Usuario no existe '
//             })
//         }
//         if(usuarioDB.role !== "ADMIN_ROLE"){
//             return res.status(403).json({
//                 ok:false,
//                 msg:'No tiene previlegios para hacer esto '
//             })
//         }
//         next();
//     } catch (error) {
//         res.status(500).json({
//             ok:false,
//             msg:"Error de validacion"
//         })
//     }
// }
// export const validarAdminRoleOUsuarios = async (req:any,res:Response,next:any) =>{
//     const uid = req.uid.uid;
//     //id del usuario que se quiere actualizar
//     const id = req.params.id;
//     console.log(req.uid)
//     console.log(id)
//     console.log(uid)
//     try {
//         const usuarioDB = await Usuario.findById(uid);
//         console.log(usuarioDB)
//         if(!usuarioDB){
//             return res.status(404).json({
//                 ok:false,
//                 msg:'Usuario no existe '
//             })
//         }
//         if(usuarioDB.role !== "ADMIN_ROLE" && uid !== id){
//             return res.status(403).json({
//                 ok:false,
//                 msg:'No tiene previlegios para hacer esto '
//             })
//         }
//         next();
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             ok:false,
//             msg:"Error de validacion"
//         })
//     }
// }
