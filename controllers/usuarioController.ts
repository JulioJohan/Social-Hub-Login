import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import { generarJWT } from '../helpers/jwt';
import { generarToken } from '../helpers/generarId';
import { emailRegistro } from '../helpers/email';
// const bcrypt =  require('bcryptjs')

class UsuarioController {

    async getUsuarios(req: Request, res: Response) {
        const desde = Number(req.query.desde) || 0;

        //colleccion de promesas para que lo haga mas rapido
        // hace que hago todo a la vez
        // se desestructura los resultados el primero son los usuarios obtenidos y el otro el total
        const [usuarios, total] = await Promise.all([
            Usuario
                .find({}, 'nombre email role google img')
                .skip(desde)
                .limit(5),
            Usuario.countDocuments()
        ])
        res.json({
            ok: true,
            usuarios,
            total
        })
    }

    async guardarUsuario(req: Request, res: Response) {
        const { password, email, nombre } = req.body;
        const usuario = new Usuario(req.body);
        let token: any;

        // res.send(guardarUsuario);
        try {

            const existeEmail = await Usuario.findOne({ email })

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya esta registrado'
                })
            }

            //Encriptar password
            const salt = bcrypt.genSaltSync();
            usuario.password = await bcrypt.hashSync(password, salt);

            usuario.tokenDoble = generarToken.generarIdMetodo();

            //Guardar usuario
            await usuario.save();
            token = await generarJWT(usuario.id);
            emailRegistro({
                //Le enviaremos el email
                email: usuario.email,
                //Enviando el nombre 
                nombre: usuario.nombre,
                //Enviando el token
                token: usuario.tokenDoble
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
            usuario,
            token
        })

    }

    async actualizarUsuario(req: Request, res: Response) {
        // const {email} = req.body;

        try {
            //tomando el id que nos manda el usuario
            const uid = req.params.id;

            //buscamos si existe el usuario
            const usuarioDB = await Usuario.findById(uid);
            // console.log(usuarioDB?._id)

            //si el usuario no esta
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario con ese id'
                })
            }

            // usuario si existe actualiz
            const { password, google, email, ...campos } = req.body;
            //si el usuario manda un diferente correo 
            if (usuarioDB.email !== req.body.email) {
                // delete campos.email;
                //bucamos si ya existe
                const existeEmail = await Usuario.findOne({ email })
                //si existe mandamos un error
                if (existeEmail) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un usuario con ese email'
                    })
                }
            }

            if (!usuarioDB.google) {
                campos.email = email;
            } else if (usuarioDB.email !== email) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuarios de google no pueden cambiar su correo'
                })
            }
            const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });
            console.log(usuarioActualizado)

            res.json({
                ok: true,
                usuarioActualizado
            })

        } catch (error) {
            console.log(error);
        }

    }

    async eliminarUsuario(req: Request, res: Response) {
        try {
            const uid: string = req.params.id;

            //buscamos si existe el usuario
            const usuarioDB = await Usuario.findById(uid);
            // console.log(usuarioDB?._id)

            //si el usuario no esta
            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un usuario'
                })
            }
            await Usuario.findByIdAndDelete(uid);


            res.json({
                ok: true,
                msg: "Usuario Eliminado"
            });

        } catch (error) {
            // console.log(error);
            res.json({
                ok: false,
                msg: "Error inesperado"
            })
        }
    }

}
export const usuarioController = new UsuarioController();


