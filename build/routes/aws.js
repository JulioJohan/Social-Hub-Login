"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const awsController_1 = require("../controllers/awsController");
const router = (0, express_1.Router)();
router.get('/getFileAws/:keyImage', awsController_1.awsController.getFile);
router.post('/saveFile', awsController_1.awsController.uploadFiles);
module.exports = router;
