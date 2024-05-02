//Paquetes necesarios
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookiesParser = require('cookie-parser');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
//Motor de plantillas


//Carpeta public para archivos estaticos
app.use(express.static(path.join(__dirname, 'public'))); 
hbs.registerPartials(path.join(__dirname, './src/views', 'partials')); 
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Para procesar datos enviados desde los froms
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//para trabajar con las cookies
app.use(cookiesParser());

//Variables de entorno 
dotenv.config({path: '.env'});


//Rutas
app.use('/', require('./src/routes/routes'));



app.listen(3000, ()=>{
    console.log('host iniciado desde el puerto 3000');
})