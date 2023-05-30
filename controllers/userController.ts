import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateJWT } from '../helpers/jwt';
import { emailRegister } from '../helpers/email';
import { User } from '../models/user';
import {generateToken} from '../helpers/generateId';
import { where } from 'sequelize';
// const bcrypt =  require('bcryptjs')

class UsuarioController {


 

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

    async createUser(req: Request, res: Response) {
        const { password, email, name } = req.body;
        const user = req.body
        let token: any;

        // res.send(guardarUsuario);
        try {
            //Busqueda por email con el where con el orm bycript 
            const existeEmail = await User.findOne({where:{email: email}})

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya esta registrado'
                })
            }

            //Encriptar password
            const salt = bcrypt.genSaltSync();
            user.password = await bcrypt.hashSync(password, salt);

            // Genera un token de numero y letras aleotorio para mandarlo al usuario
            user.email_verified = generateToken.generateTokenMethod();

            //Guardar usuario
            const userNew:any = await User.create(user);
            console.log(`IUsuario ${userNew}`)
            token = await generateJWT(userNew.id_user);
            emailRegister({
                //Le enviaremos el email
                email: user.email,
                //Enviando el nombre 
                nombre: user.name,
                //Enviando el token
                token: user.email_verified
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado '
            })
        }
        res.json({
            ok: true,
            msg: 'Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta',
            user,
            token
        })

    }

    async actualizarUsuario(req: Request, res: Response) {
        const {email} = req.body;

        try {
            //tomando el id que nos manda el usuario
            const uid = req.params.id;

            //buscamos si existe el usuario
            const usuarioDB = await User.findByPk(uid);
            // console.log(usuarioDB?._id)

            //si el usuario no esta
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese id'
                })
            }

            //si el usuario manda un diferente correo 
            if (usuarioDB.email !== req.body.email) {
                // delete campos.email;
                //bucamos si ya existe
                const existeEmail = await User.findOne({where:{email:email}})
                //si existe mandamos un error
                if (existeEmail) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un usuario con ese email'
                    })
                }
            }
           
            // const usuarioActualizado = await User.update(uid, campos, { new: true });
            // console.log(usuarioActualizado)

            res.json({
                ok: true,
                // usuarioActualizado
            })

        } catch (error) {
            console.log(error);
        }

    }

    async eliminarUsuario(req: Request, res: Response) {
        // try {
        //     const uid: string = req.params.id;

            //buscamos si existe el usuario
            // const usuarioDB = await User.findById(uid);
            // console.log(usuarioDB?._id)

            //si el usuario no esta
        //     if (!usuarioDB) {
        //         return res.status(404).json({
        //             ok: false,
        //             msg: 'No existe un usuario'
        //         })
        //     }
        //     await Usuario.findByIdAndDelete(uid);


        //     res.json({
        //         ok: true,
        //         msg: "Usuario Eliminado"
        //     });

        // } catch (error) {
        //     // console.log(error);
        //     res.json({
        //         ok: false,
        //         msg: "Error inesperado"
        //     })
        // }
    // }

    }
}
export const userController = new UsuarioController();


