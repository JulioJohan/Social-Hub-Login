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


class Login{

    async login(req:Request,res:Response) {

        const {email,password} = req.body;
        
        console.log(req.body);
        try {

            const userDB = await User.findOne({where:{email:email}});

            //Verificar email
            if(!userDB){
                return res.status(404).json({
                    ok:false,
                    msg:'El email no fue encontrado'
                }) 
            }

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

            if(!checkPassword){
                return res.status(400).json({
                    ok:false,
                    msg:'El password no valida',
                })
            }
           
            const multiFactorAuthentication  = speakeasy.generateSecret({length:5});
            userDB.multi_factor_authentication = multiFactorAuthentication.base32;
            
            await userDB.save();

            enviarDobleAuthenticacion({
                id:userDB.id_user,
                email:userDB.email,
                nombre:userDB.name,
                authenticacionDoble:userDB.multi_factor_authentication                            
            })
                      
            res.json({msg: 'Hemos enviado un email con tu codigo de verificacion',ok:true})

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

    // async confirmar(req: Request, res: Response) {
    //     // console.log(req.params.token)
    //     const { tokenDoble } = req.params;
    //     //buscando un usuario con ese token
    //     const usuarioConfirmado = await Usuario.findOne({ tokenDoble });
    //     console.log(usuarioConfirmado)
    //     if (!usuarioConfirmado || usuarioConfirmado === null) {
    //         return res.json({
    //             msg: "token no valido",
    //             ok: false
    //         })
    //     }
    //     try {
    //         //Si el usuario tiene el token correctamente se vuelve a true
    //         usuarioConfirmado!.confirmado = true;
    //         //Modificando el token porque solo se genera una vez para confirmar la cuenta
    //         usuarioConfirmado!.tokenDoble = "";
    //         //Almacenando en la base de datos
    //         await usuarioConfirmado!.save();
    //         res.json({ok:true, msg: 'Usuario Confirmado Correctamente' })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // async olvidePassword(req: Request, res: Response) {

    //     const {email}  = req.body;
 
    //     const usuario = await Usuario.findOne({ email });
    //     console.log(usuario)

    //     if (!usuario || usuario === null) {
    //         res.json({
    //             msg: "El usuario no existe",
    //             ok: false
    //         })
    //     }
    //     try {
    //         //Generando token
    //         usuario!.tokenDoble = generarToken.generarIdMetodo();
    //         await usuario?.save();

    //         emailOlvidePassword({
    //             //Le enviaremos el email
    //             email: usuario!.email,
    //             //Enviando el nombre 
    //             nombre: usuario!.nombre,
    //             //Enviando el token
    //             token: usuario!.tokenDoble
    //         })

    //         //enviando el mensaje al usuario
    //         res.json({msg: 'Hemos enviado un email con las instrucciones'})
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // async nuevoPassword(req:Request,res:Response){
    //     const {tokenDoble} = req.params;
    //     const {password} = req.body;
    //     console.log(password+ "password");
    //     console.log(tokenDoble+ "tokenDoble");

    //     const usuario = await Usuario.findOne({tokenDoble});

    //     if(!usuario){
    //         res.json({
    //             ok:false,
    //             msg:'El token no es valido',    
    //         })
    //     }
    //     try{
    //        //Encriptar password
    //         const salt = bcrypt.genSaltSync();
    //         usuario!.password = await bcrypt.hashSync(password, salt);
    //         usuario!.tokenDoble = "";
    //         await usuario!.save();
    //         res.json({
    //             msg:'La Contraseña se actualizo correctamente',
    //             ok:false
    //         })
    //     }catch(error){
    //         console.log(error);
    //     }
    // }

    // async comprobarTokenValidacion(req:Request, res:Response){
    //     const {tokenDoble} = req.params;
    //     console.log(tokenDoble)
    //     const tokenValidar = await Usuario.findOne({tokenDoble});

    //     if(!tokenValidar){
    //         res.json({
    //             msg:'Token no valido',
    //             ok:false
    //         })
    //     }
    //     if(tokenValidar){
    //         res.json({
    //             msg:'Token Valido el Usuario existe',
    //             ok:true
    //         })
    //     }
    // }

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


    // async comprobarDobleAuthenticacion(req:Request, res:Response){
    //     const usuario = req.body;
    //     const {email } =usuario;
    //     console.log("comprobarDobleAuthenticacion")
    //     console.log(usuario)
        
    //     try {

    //         const usuarioDB = await Usuario.findOne({email});        

    //         if(!usuarioDB){
    //             return res.status(403).json({
    //                 ok:false,
    //                 msg:'No existe este usuario'
    //             })
    //         }

    //         if(usuario.authenticacionDoble !== usuarioDB.authenticacionDoble){
    //             return res.status(403).json({
    //                 ok:false,
    //                 msg:'El codigo de verificacion es incorrecto'
    //             })
    //         }                  
    
    //         const token:any = await generarJWT(usuarioDB.id);
    //         console.log("token expiracion")
    //         console.log(token.exp)
    //         res.json({
    //             ok:true,
    //             msg:token,
    //             menu: getMenuFrontEnd (usuarioDB.role)
    //         });
           
            
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({
    //             error
    //         })
    //     }
    // }


}

export const login = new Login();