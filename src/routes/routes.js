//Paquetes necesarios
const express = require('express');
const routes = express.Router();
const controlRutas = require('../controllers/controlRutas')

//Rutas de las pantallas
routes.get('/', controlRutas.autenticado, (req, res)=>{
    res.render('index');
});
routes.get('/login', (req, res)=>{
    res.render('login');
});


//Control de rutas 
routes.post('/login', controlRutas.login);
routes.get('/cerrar', controlRutas.logout);
module.exports = routes;