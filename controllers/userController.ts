import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateJWT } from '../helpers/jwt';
import { emailRegister } from '../helpers/email';
import { User } from '../models/user';
import {generateToken} from '../helpers/generateId';
import { where } from 'sequelize';
import { getFileUrl } from '../databases/aws';
import { uploadFileFirebase} from '../databases/firebase';


// Asignando la imagen estatica
// cuando el usuario creara la cuenta tendra esta foto de perfil por defecto
const IMG_USER_NEW:string = 'https://firebasestorage.googleapis.com/v0/b/socialhub-30934.appspot.com/o/users%2Ffacebook-user-icon-19.jpg?alt=media&token=9d260fe4-3942-4a47-a5fc-8e7c04ee40a6';
class UserController {

    //Busqueda por Id si se requiere
    async findById(req:Request,res:Response){
        // obteniendo el parametro id para la busqueda por id
        const id = req.params.id;
        // Creando una variable donde almacenaria el usuario
        let user:User | null;
        try {
            user = await User.findByPk(id);
        } catch (error) {
            console.log(error);                        
            return res.json({
                ok: false,
                msg: 'Error inesperado '
            }).status(500);
        }
        if(!user){
            return res.json({
                ok: false,
                msg: 'El usuario no existe en la base de datos'
                
            }).status(404);
        }    

        res.json({
            ok: true,
            msg: 'Busqueda por id se consulto correctamente',
            data: user
        }).status(200)
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

    async createUser(req: Request, res: Response) {
        const { password, email, name } = req.body;
        const user = req.body;
        let token: any;

        // res.send(guardarUsuario);
        try {
            //Busqueda por email con el where con el orm bycript 
            const existeEmail = await User.findOne({where:{email: email}})

            if (existeEmail) {     
                return res.json({
                    ok: false,
                    msg: 'El correo ya esta registrado'
                }).status(400);
            }

            //Encriptar password
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);

            // Genera un token de numero y letras aleotorio para mandarlo al usuario
            user.email_verified = generateToken.generateTokenMethod();
            user.avatar = IMG_USER_NEW;
            //Guardar usuario
            const userNew:any = await User.create(user);
            console.log(`IUsuario ${userNew}`)
            // token = await generateJWT(userNew.id_user);
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
            res.json({
                ok: false,
                msg: 'Error inesperado '
            }).status(500);
        }
        res.json({
            ok: true,
            msg: 'Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta',
            user,
            token
        }).status(200);

    }

    async updateUser(req: any, res: Response) {
        // Extraer la informacion que el usuario puede actualizar
        const {name,email,age,date_birth,password,father_last_name,mother_last_name,avatar} = req.body;
        // Obteniendo el archvo para guardar
        const file = req.files?.avatar;
        // creando un objeto y asignando información de lo que recibimos
        const userNew = {
            name: name,
            email:email,
            age: age,
            date_birth:date_birth,
            father_last_name:father_last_name,
            mother_last_name:mother_last_name,
            avatar:avatar           
        }

        try {
            //tomando el id que nos manda el usuario
            const uid = req.params.id;

            //buscamos si existe el usuario
            const usuarioDB = await User.findByPk(uid);
            console.log(usuarioDB?.age)

            //si el usuario no esta
            if (!usuarioDB) {
                return res.json({
                    ok: false,
                    msg: 'No existe un usuario con ese id'
                }).status(404);
            }

            //si el usuario manda un diferente correo 
            if (usuarioDB.email !== email) {
                // delete campos.email;
                //bucamos si ya existe
                const existeEmail = await User.findOne({where:{email:email}})
                //si existe mandamos un error
                if (existeEmail) {
                    return res.json({
                        ok: false,
                        msg: 'Ya existe un usuario con ese email'
                    }).status(400);
                }
            }


            //Si el usuario actualiza su contraseña
            // if(usuarioDB.password !== password ){
            //     //Encriptar password
            //     const salt = bcrypt.genSaltSync();
            //     // generando aleatoriamento la contraseña
            //     userNew.password = bcrypt.hashSync(password, salt);
            // }

            // si el usuario desea actualizar la imagen subira la imagen a firevase
            if(file !== undefined){
                const newAvater:string = await uploadFileFirebase(file);
                // Asignar la url
                userNew.avatar = newAvater;
            }
            if(file === undefined){
                userNew.avatar = usuarioDB.avatar;
            }

            
            // Actualizando información
            const usuarioActualizado = await User.update(userNew,{
                // Poniendo condicion donde se actualizara
                where:{
                    id_user:uid
                }
            });
            // Si todo sale correcto 
            return res.json({
                ok: true,
                usuarioActualizado,
                msg:'La información se actualizó correctamente'
            }).status(200);

        } catch (error) {
            return res.json({
                ok: false,
                msg: 'Error inesperado '
            }).status(500);
        }

    }

    // Eliminar el usuario 
    async deleteUser(req: Request, res: Response) {
        try {
            // Obtenemos el id del parametro
            const uid: string = req.params.id;

            // buscamos si existe el usuario
            const usuarioDB = await User.findByPk(uid);        

            // si el usuario no esta
            if (!usuarioDB) {
                return res.json({
                    ok: false,
                    msg: 'No existe un usuario'
                }).status(404)
            }

            // Eliminando donde esta el id
            await User.destroy({
                where:{
                    id_user:uid
                }
            });

            // Si todo sale correcto se manda el mensaje
            res.json({  
                ok: true,
                msg: "Usuario Eliminado"
            }).status(200);

        } catch (error) {
            // console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado '
            })
        }
    }

    
}
export const userController = new UserController();


