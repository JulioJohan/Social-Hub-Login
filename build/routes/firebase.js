"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebaseController_1 = require("../controllers/firebaseController");
const routes = (0, express_1.Router)();
routes.post('/uploadFile', firebaseController_1.uploadFile);
module.exports = routes;
