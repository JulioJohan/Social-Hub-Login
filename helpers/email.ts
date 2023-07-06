//Importando dependencia para poder recibir email
import sgMail  from '@sendgrid/mail';

//Datos para la confirmacion del registro
export const emailRegister = async(datos:any) =>{
    // Estableciendo la api key 
    sgMail.setApiKey(process.env.SEND_GRID!)
    // Extrayendo los datos del objeto
    const {email, nombre, token } = datos;
    
    // Contenido del correo
    const msg = {
        to: email,
        from: 'zeyjohan@gmail.com',
        subject: 'Social Hub - Verificacion de dos pasos',
        text: 'Comprueba tu cuenta en Social Hub',
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Social Hub</p>
        <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
        <a href = "http://localhost:4200/confirmar/${token}">Comprobar Cuenta</a>       
        <p> Si tu no creaste esta cuente, puedes ignorar el mensaje </p>`
    };

    // Envio del correo
    await sgMail.send(msg).then(()=>{
        console.log('Email Enviado');
    }).catch((error) => {
        console.error(error)
    })

    // const info = await transport.sendMail({
    //     //Informacion de quien lo envio   
    //     from:'"Hospital -  Administracion de Hospitales" <hospital@adminpro.com>',
    //       //Email del usuario
    //    to: email,
    //    subject: "Hospital - Confirma tu cuenta",
    //    text: "Comprueba tu cuenta en Mykiu",
    //    html:`<p>Hola: ${nombre} Comprueba tu cuenta en adminpro</p>
    //     <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
    //     <a href = "http://localhost:4200/confirmar/${token}">Comprobar Cuenta</a>       
    //    <p> Si tu no creaste esta cuente, puedes ignorar el mensaje </p>`
    // })
}

//Datos para la confirmacion del registro
export const emailForgetPassword = async(datos:any) => {
    // Estableciendo la api key 
    sgMail.setApiKey(process.env.SEND_GRID!)
    //extrayendo los datos
    const {email, nombre, token} = datos;   
    // Contenido del correo
    const msg  = {        
        to: email,
        from: 'zeyjohan@gmail.com', 
        subject: 'Social Hub - Verificacion de dos pasos',
        text: "Restablece tu Contraseña en Social Hub",
        html:`<p>Hola: ${nombre} has solicitado restablecer tu password en Social Hub </p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href = "http://localhost:4200/nuevo-password/${token}">Restablecer Password</a>       
        <p> Si tu no solicitaste este email, puedes ignorar el mensaje </p>`
    };

    // Envio del correo
    sgMail.send(msg).then(()=>{
        console.log('Email sent');
    }).catch((error) => {
        console.error(error)
    })
}

