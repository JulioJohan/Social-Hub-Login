import sgMail  from '@sendgrid/mail';

// Doble Autenticación
export const sendDoubleAuthenticacion = (datos:any) => {
    // Estableciendo la api key 
    sgMail.setApiKey(process.env.SEND_GRID!)
    //extrayendo los datos
    const {email, nombre,authenticacionDoble} = datos;
   
    // Contenido del correo
    const msg = {
        to: email,
        from: 'shub64127@gmail.com', 
        subject: 'Social Hub - Verificacion de dos pasos',
        text: 'Comprueba tu cuenta en Social Hub',
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Social Hub</p>
        <p>Tu codigo de verificacion es: ${authenticacionDoble}
        <p> Si tu no pediste el acceso a tu cuenta 
        cambia tu contraseña en la app de Social Hub</p>`
    };

    // Envio del correo
    sgMail.send(msg).then(()=>{
        console.log('Email sent');
    }).catch((error) => {
        console.error(error)
    })
}
