import { Request,Response } from 'express';
import bcrypt from 'bcrypt';
import { generateJWT, verificarToken } from '../helpers/jwt';
import { googleVerify } from '../helpers/google-verify';
import { getMenuFrontEnd } from '../helpers/menu-frontend';
import { generateToken } from '../helpers/generateId';
import { emailOlvidePassword } from '../helpers/email';
import speakeasy from 'speakeasy';
import { enviarDobleAuthenticacion } from '../helpers/doble-authenticacion';
import { User } from '../models/user';

// Clase Login para todos los metodos que se va a requerir
class Login{

    // Metodo Asincrono para el metodo login
    async login(req:Request,res:Response) {

        // Obteniendo las propiedades del objeto
        const {email,password} = req.body;
        
        try {
            // Buscamos por correo el usuario
            const userDB = await User.findOne({where:{email:email}});

            //Verificar email si existe
            if(!userDB){
                return res.status(404).json({
                    ok:false,
                    msg:'El email no fue encontrado'
                }) 
            }

            // Verificando si la cuenta esta confirmada
            if (!userDB.confirmed) {
                return res.status(403).json({
                    ok: false,
                    msg: 'Tu cuenta no esta confirmada'
                })
            }

            //Verificar password
            // password = lo que envia el usuario
            // usuarioDB
            const checkPassword = bcrypt.compareSync(password,userDB.password);
            //Mandando Mensaje al usuario si la contraseña es valida
            if(!checkPassword){
                return res.status(400).json({
                    ok:false,
                    msg:'La contraseña no es valida',
                })
            }
           
            // Generando Key alaeorio para doble autenticacion
            const multiFactorAuthentication  = speakeasy.generateSecret({length:5});
            // Asignando la key para guardarlo a la base de datos
            userDB.multi_factor_authentication = multiFactorAuthentication.base32;
            
            // Guardando la ket
            await userDB.save();

            // Enviar Doble Authenticacion por email
            enviarDobleAuthenticacion({
                id:userDB.id_user,
                email:userDB.email,
                nombre:userDB.name,
                authenticacionDoble:userDB.multi_factor_authentication                            
            })
                      
            res.json({msg: 'Hemos enviado un email con tu codigo de verificación',ok:true})

            // this.comprobarDobleAuthenticacion(req,res);
            // const codigo = enviarTokenSMS();
            //Generar el token - JWT
           
        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok:false,
                msg:"Error inesperado auth"
            })
        }

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
    async confirmEmail(req: Request, res: Response) {
        // console.log(req.params.token)
        // obtenermos el parametro
        const { email_verified } = req.params;
        //buscando un usuario con ese token    
        const userConfirmed = await User.findOne({where:{email_verified:email_verified}});
        // Si no existe el token mandamos al usuario que no es valido
        if (!userConfirmed || userConfirmed === null) {
            return res.json({
                msg: "token no valido",
                ok: false
            })
        }
        try {
            //Si el usuario tiene el token correctamente se vuelve a true
            userConfirmed!.confirmed = true;
            //Modificando el token porque solo se genera una vez para confirmar la cuenta
            userConfirmed!.email_verified = "";
            //Almacenando en la base de datos
            await userConfirmed!.save();        
            res.json({ok:true, msg: 'Usuario Confirmado Correctamente' })
        } catch (error) {
            console.log(error)
        }
    }

    // Olvidamos Password
    async forgetPassword(req: Request, res: Response) {

        // Obtenemos el email
        const {email}  = req.body;
 
        // Buscamos en la bse de datos el email
        const user = await User.findOne({where:{email:email}});
        console.log(user)

        // Verificando si el correo o usuario existe
        if (!user || user === null) {
            res.json({
                msg: "El usuario no existe",
                ok: false
            })
        }
        try {
            //Generando token
            user!.multi_factor_authentication = generateToken.generateTokenMethod();
            await user?.save();

            // Envinado El password
            emailOlvidePassword({
                //Le enviaremos el email
                email: user!.email,
                //Enviando el nombre 
                nombre: user!.name,
                //Enviando el token
                token: user!.multi_factor_authentication
            })

            //enviando el mensaje al usuario
            res.json({msg: 'Hemos enviado un email con las instrucciones'})
        } catch (error) {
            console.log(error)
        }
    }

    async newPassword(req:Request,res:Response){
        // Obteniendo el token para validar que el token funcione
        const {tokenPassword} = req.params;
        // Obteniendo el nuevo password
        const {password} = req.body;
        console.log(password+ "password");
        console.log(tokenPassword+ "tokenPassword");

        // Buscando si realmente existe ese token
        const user = await User.findOne({where:{multi_factor_authentication:tokenPassword}});

        // Enviando si el token realmente existe
        if(!user){
            res.json({
                ok:false,
                msg:'El token no es valido',    
            })
        }
        try{
           //Encriptar password
            const salt = bcrypt.genSaltSync();
            user!.password =  bcrypt.hashSync(password, salt);
            user!.multi_factor_authentication = "";
            await user!.save();
            res.json({
                msg:'La Contraseña se actualizo correctamente',
                ok:false
            })
        }catch(error){
            console.log(error);
        }
    }

    // Verificando el token del password
    async checkTokenPassword(req:Request, res:Response){
        // Obteniendo el token de los parametros
        const {tokenPassword} = req.params;        
        // Buscando en la base de datos
        const tokenValidar = await User.findOne({where:{multi_factor_authentication:tokenPassword}});

        // Si el token no existe mandamos mensjae al usuario
        if(!tokenValidar){
            res.json({
                msg:'Token no valido',
                ok:false
            })
        }
    // Si el token existe continuemos con el proceso del nuevo password
        if(tokenValidar){
            res.json({
                msg:'Token Valido el Usuario existe',
                ok:true
            })
        }
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
    async checkDoubleAuthentication(req:Request, res:Response){
        const user = req.body;
        // Obtenemos el email de lo que envia el usuario
        const {email } =user;
        console.log("checkDoubleAuthentication")
        console.log(user)
        
        try {

            // Buscamos si realmente existe eL usuario
            const userDB = await User.findOne({where:{email:email}});        

            
            if(!userDB){
                return res.status(403).json({
                    ok:false,
                    msg:'No existe este usuario'
                })
            }

            //Verificando si realmente existe doble autenticacion 
            if(user.multi_factor_authentication !== userDB.multi_factor_authentication){
                return res.status(403).json({
                    ok:false,
                    msg:'El codigo de verificacion es incorrecto'
                })
            }                  
    
            // Enviando el token para el inicio de sesion 
            const token:any = await generateJWT(userDB.id_user);
            console.log("token expiracion")
            console.log(token.exp)
            res.json({
                ok:true,
                msg:token,
                // menu: getMenuFrontEnd (userDB.role)
            });
           
            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error
            })
        }
    }


}

export const login = new Login();