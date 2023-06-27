import { Response,Request} from 'express';
import {getFile,uploadFile,getFileUrl} from '../databases/aws';


// Prubas para AWS
class AwsController{

    // Controller para probar y subir archivos
    async uploadFiles(req:any,res:Response){
        const file = req.files.multimedia;
        console.log(file)
        let response; 
        try {
            // response = await uploadFile(file);
        } catch (error) {
            console.log(error);
            return res.json({
                ok:false,
                msg:'No se puedo subir el archivo, error inesperado'
            })
        }
        res.json({
            response,
            ok:true,
            msg:'El archivo a AWS se subió correctamente'
        })
        
    }

  

    async getFile(req:Request,res:Response){
        const keyImage:string = req.params.keyImage;
        console.log(keyImage)
        let response;
        try {
            response = await getFileUrl(keyImage);
            console.log(response)
        } catch (error) {
            console.log(error);
            return res.json({
                ok:false,
                msg:'No se puedo obtener el archivo, error inesperado'
            })
        }
        res.status(200).json(response)
        // res.json({
        //     response:response,
        //     ok:true,
        //     msg:'Se consultó correctamente'
        // })
    }

}

export const awsController = new AwsController();