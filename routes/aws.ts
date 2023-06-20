import { Router } from "express";
import {awsController} from '../controllers/awsController';

const router:Router = Router();

router.get('/getFileAws/:keyImage',awsController.getFile);
router.post('/saveFile',awsController.uploadFiles);


module.exports = router;