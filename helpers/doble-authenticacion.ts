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
        from:'"Social Hub - Redes Sociales" <socialhub@support.com>',
        //Email del usuario
        to: email,
        subject: "Social Hub - Verificacion de dos pasos",
        text: "Comprueba tu cuenta en Social Hub",
        html:`<p>Hola: ${nombre} Comprueba tu cuenta en Social Hub</p>
        <p>Tu codigo de verificacion es: ${authenticacionDoble}
       <p> Si tu no pediste el acceso a tu cuenta 
        cambia tu contraseña en la app de Social Hub</p>`
    })

}
