import {Request,Response} from 'express';
import {uploadFileFirebase} from '../databases/firebase'


export const uploadFile = async (req:any,res:Response)=> {
    const file = req.files!.multimedia;
    try {
        console.log(file)
        const response = await uploadFileFirebase(file);
        console.log(response)
    } catch (error) {
        console.log("Error Inesperado");
        return res.json({
           ok:false,
           msg:'Error insesperado en subir el archivo' 
        })
    }
    return res.json({
        ok:true,
        msg:'El archivo se subio correctamente'
    })

}   