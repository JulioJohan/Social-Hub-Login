import nodemailer from 'nodemailer';


export const enviarDobleAuthenticacion = (datos:any) => {
    const {email, nombre,authenticacionDoble} = datos;

    const trasnsportarEmail = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const informacion = trasnsportarEmail.sendMail({
        from:'"Hospital -  Administracion de Hospitales" <hospital@adminpro.com>',
        //Email del usuario
        to: email,
        subject: "Hospital - Verificacion de dos pasos",
        text: "Comprueba tu cuenta en Hospital",
        html:`<p>Hola: ${nombre} Comprueba tu cuenta en adminpro</p>
        <p>Tu codigo de verificacion es: ${authenticacionDoble}
       <p> Si tu no pediste el acceso a tu cuenta 
        cambia tu contraseña en la app de Hosptal</p>`
    })

}
