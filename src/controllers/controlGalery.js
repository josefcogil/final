const conexion = require('../server/server');
const jwt = require('jsonwebtoken');
//Validar si existe cookie
exports.galery = async(req, res, next)=>{
    const token = req.cookies.jwt; 
    if (!token) {
        jwt.verify(token, process.env.JWT_SECRETO, (err, decoded) => {
            if (err) {
                res.redirect('/');       
            } else {
                console.log(decoded);    
                next();
            }
        });
    } else {

         // Realizar consulta a la base de datos para obtener las tres primeras imágenes
         const sql = 'SELECT images_blob FROM cumple'; // Suponiendo que tienes una columna 'id' que indica el orden de inserción
         conexion.query(sql, (err, resultUser) => {
             if (err) {
                 console.error('Error al recuperar las imágenes:', err);
                 return res.status(500).send('Error al recuperar las imágenes de la base de datos');
             }
             // Convertir las imágenes a formato base64
             resultUser.forEach(image => {
                 image.imagen_base64 = image.images_blob.toString('base64');
             });
             // Renderizar la plantilla index.hbs con los datos de las tres primeras imágenes
             res.render('galerys', {
                 users: resultUser,
                 admin: true
             });
         });

    }
} 
