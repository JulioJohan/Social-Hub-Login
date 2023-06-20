// importando el sdk para poder tener comunicacion con aws service
import {S3Client,PutObjectCommand,ListObjectsCommand,GetObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


//configuracion del S3 para AWS S3
const configurationS3:S3Client = new S3Client({
    // Region
    region: process.env.AWS_BUCKET_REGION!,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,        
    }
})


export const uploadFile = async (file:any) => {
    // Leyendo un archivo
    console.log(file)
    // const stream:fs.ReadStream = fs.createReadStream(file.tempFilePath);
    // console.log(file)
    // Especificar donde se guarda el archivo
    const uploadParams = {
        // especificacione del nombre del bucket donde se guardara los archivos
        Bucket: process.env.AWS_BUCKET_NAME,        
        // Nombre del archivo
        Key:`users/${file.name}`,
        // contenido del archivo
        Body: file.data
    }
    // PutObjectCommand es la operacion para subir un archivo
    const command = new PutObjectCommand(uploadParams) 
    // Mandado el put a AWS
    const result = await configurationS3.send(command)
    // Mandando en respuesta el resultado en AWS
    console.log(result)    
}

// Obtener una lista de los archivos
export const getFiles = async() => {

    // Enviando el bucket en el que tendra nuestras imagens     
    const listObject = new ListObjectsCommand({ Bucket:`${process.env.AWS_BUCKET_NAME}`});

    // enviamos la petición 
    const result = await configurationS3.send(listObject);
    // regresa el resultado
    return result;
}


// Obtener Archivo por id
export const getFile = async(fileName:string) => {
    const command = new GetObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        // El nombre del archivo
        Key:fileName
    })
    const result = await configurationS3.send(command);
    // const resultado = Buffer.from(result.Body).toString('utf8');
    return result;
}

export const getFileUrl = async(fileName:string) => {
    const command:any = new GetObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        // El nombre del archivo
        Key:fileName
    })    

    const s3:any = new S3Client( {
    region: process.env.AWS_BUCKET_REGION!,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,        
        }
    })

    
    const result = await getSignedUrl( s3, command, { expiresIn: 3600 });
    return result
}