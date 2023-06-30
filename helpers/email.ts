//Importando dependencia para poder recibir email
import nodemailer from 'nodemailer';

//Datos para la confirmacion del registro
export const emailRegister = async(datos:any) =>{
    const {email, nombre, token } = datos;
    
    //Obtenido de Mailtrap
    const transport = nodemailer.createTransport({
        
        host:process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const info = await transport.sendMail({
        //Informacion de quien lo envio   
        from:'"Hospital -  Administracion de Hospitales" <hospital@adminpro.com>',
          //Email del usuario
       to: email,
       subject: "Hospital - Confirma tu cuenta",
       text: "Comprueba tu cuenta en Mykiu",
       html:`<p>Hola: ${nombre} Comprueba tu cuenta en adminpro</p>
        <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
        <a href = "http://localhost:4200/confirmar/${token}">Comprobar Cuenta</a>       
       <p> Si tu no creaste esta cuente, puedes ignorar el mensaje </p>`
    })
}

//Datos para la confirmacion del registro
export const emailOlvidePassword = async(datos:any) => {
    //extrayendo llos datos
        const {email, nombre, token} = datos;
       //Obtenido de Mailtrap
  
        const transport = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
          });
    
       //   Informacion del Email
    
       const info  = await  transport.sendMail({
        //Informacion de quien lo envio   
        from:'"Hospital -  Administrador de Proyecto" <hospital@adminPro.com>',
           //Email del usuario
           to: email,
           subject: "Hospital - Restablece tu password en AdminPro",
           text: "Restablece tu password en adminPro",
           html:`<p>Hola: ${nombre} has solicitado restablecer tu password en adminPro </p>
            <p>Sigue el siguiente enlace para generar un nuevo password:
            <a href = "http://localhost:4200/nuevo-password/${token}">Restablecer Password</a>       
           <p> Si tu no solicitaste este email, puedes ignorar el mensaje </p>
            `
       })
    }

