//Paquetes necesarios
const express = require('express');
const routes = express.Router();
const fs = require('fs');

//importaciones necesarias
const conexion = require('../server/server')
const controlRutas = require('../controllers/controlRutas');
const upload = require('../controllers/control-images');
const galery = require('../controllers/controlGalery');
const deletes = require('../server/eliminar');

//Rutas de las pantallas
routes.get('/login', (req, res)=>{
    res.render('login');
});
routes.get('/registrar', (req, res)=>{
    res.render('register');
});
routes.get('/aac', (req, res)=>{
    res.render('atencion-ciudadano');
});
routes.get('/register', (req, res)=>{
    res.render('register');
});
routes.get('/', controlRutas.autenticado, (req, res)=>{
    res.render('index');
});
routes.get('/images', controlRutas.verificar ,(req, res) => {
    res.render('imgAdd', { admin: true })
});
routes.get('/users',  controlRutas.verificar, (req, res) => {
    res.render('users', { admin: true })
});

routes.get('/galery', galery.galery,);
routes.get('/galery/users', galery.galeryUser,);
routes.get('/eliminar/:id', deletes.eliminarHomeImg);
routes.get('/eliminar/galery/images/:id', deletes.eliminarImages);
routes.get('/eliminar/card/users/:id', deletes.eliminarCard);
routes.get('/eliminar/home/card/:id', deletes.eliminarHomeCard);
routes.get('/cerrar', controlRutas.logout);
routes.post('/login', controlRutas.login);
routes.post('/images', upload.single('imagen'), (req, res) => {
    // Verifica si alguno de los campos está vacío
    if (!req.file) {
        return  res.render('imgAdd', {
            alert: true,
            icon: 'info',
            text: '¡Llene el campo!',
            title: 'ADVERTENCIA'
          })
    }
    
    const imagenPath = req.file.path; // Ruta temporal de la imagen
        // Supongamos que ya tienes la imagen en formato binario (por ejemplo, desde un formulario de carga)
    const binaryImage = fs.readFileSync(imagenPath); // Lee la imagen desde el archivo
    
    // Inserta la imagen en la base de datos
    const sql = 'INSERT INTO images (imagen_blob) VALUES (?)';
    conexion.query(sql, [binaryImage], (err, result) => {
        if (err) {
            console.error('Error al insertar la imagen:', err);
            return res.status(500).send('Error al guardar la imagen en la base de datos');
        }
        console.log('Imagen guardada correctamente en la base de datos');
        res.redirect('/images'); // Redirige a la página de galería
    });
    
});
routes.post('/users',upload.single('imagen'), (req, res) => {
        // Verifica si alguno de los campos está vacío
        if (!req.file || !req.body.nombre || !req.body.descrip) {
            return  res.render('users', {
                alert: true,
                icon: 'info',
                text: '¡Llene todos los campos!',
                title: 'ADVERTENCIA'
              })
        }
    
        const imagenPath = req.file.path; 
        const {nombre, descrip} = req.body;
    
        // Supongamos que ya tienes la imagen en formato binario (por ejemplo, desde un formulario de carga)
        const binaryImage = fs.readFileSync(imagenPath); // Lee la imagen desde el archivo
    
        // Inserta la imagen en la base de datos
        const sql = 'INSERT INTO cumple (images_blob, nombre, descripcion) VALUES (?,?,?)';
        conexion.query(sql, [binaryImage, nombre, descrip], (err, result) => {
            if (err) {
                console.error('Error al insertar la imagen:', err);
                return res.status(500).send('Error al guardar la imagen en la base de datos');
            }
            console.log('Imagen guardada correctamente en la base de datos');
            res.redirect('/users'); // Redirige
        });
});

//Exportar routes
module.exports = routes;