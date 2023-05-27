import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import bodyParser from 'body-parser';

import {dataBaseConnection} from './databases/config';


require('dotenv').config();
//Crear el servidor de express
const app = express();

//configurar cors
app.use(cors());

dataBaseConnection();

//Lectura y parseo del body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

//Rutas
//requiero la rutas
// app.use('/api/usuarios',require('./routes/usuarios'));
// app.use('/api/login',require('./routes/auth'));


// req lo que se solicita
// res va a responder al cliente
app.listen(process.env.PORT,()=>{
    console.log('servidor corriendo en puerto ' + process.env.PORT)
})