import { Router } from "express";
import { uploadFile} from '../controllers/firebaseController';


const routes:Router = Router();

routes.post('/uploadFile',uploadFile);


module.exports = routes