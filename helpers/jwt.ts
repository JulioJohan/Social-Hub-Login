import jwt from 'jsonwebtoken';

//
export const generateJWT = (uid:string) =>{
    //
    return new Promise((resolve, reject)=>{
        //lo que enviaremos para certificar
    const payload ={
        uid,
    }

    //firmar el payload, el token y duracion de lo que dura el token
    jwt.sign(payload,`${process.env.JWT_SECRET}`,{
        expiresIn: '5m',
    },(error,token) =>{
        if(error){
            console.log(error);
            reject('No se pudo generar el JWT')
        }else{
            resolve(token);
        }
    });

    });
    
}

export const verificarToken = (token:string)=>{

    return new Promise((resolve, reject)=>{
        jwt.verify(token,`${process.env.JWT_SECRET}`,(error:any,decode:any) =>{
            if(error){
                console.log(error);
                reject('No se pudo generar el JWT')
            }else{
                const fechaExpiracionLocal = new Date(decode.exp * 1000).toLocaleString()
                const fechaInicalLocal = new Date(decode.iat * 1000).toLocaleString()
                const fechaInicial:Date = new Date(fechaInicalLocal);
                const fechaExpiracion:Date = new Date(fechaExpiracionLocal);
                const fechas = {
                    fechaInicial,
                    fechaExpiracion
                }
                resolve(fechas)
            }
        })

    }); 
}