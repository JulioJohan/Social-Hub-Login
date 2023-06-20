import { FirebaseOptions, initializeApp } from 'firebase/app';
import {StorageReference, UploadResult, getDownloadURL, getStorage,ref,uploadBytes} from 'firebase/storage';

// Claves de la configuracion de 
const firebaseConfig:FirebaseOptions = {
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: process.env.AUTH_DOMAIN_FIREBASE,
  projectId: process.env.PROJECT_ID_FIREBASE,
  storageBucket: process.env.STORAGE_BUCKET_FIREBASE,
  messagingSenderId: process.env.MESSAGING_SENDER_ID_FIREBASE,
  appId: process.env.APP_ID_FIREBASE
}

// inicializar firebase aplicacion con nuestras credenciales
initializeApp(firebaseConfig);
// obteniendo nuestro storage
const storage = getStorage();

// Subir una iamgen 
export const uploadFileFirebase = async(file:any) => {
    // 
    const storageRef: StorageReference = ref(storage,`users/${file.name}`);
    
    const snapshot: UploadResult = await uploadBytes(storageRef,file.data);

    const url:string = await getDownloadURL(snapshot.ref);

    return url;
  }