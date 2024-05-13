const conexion = require('../server/server');
const jwt = require('jsonwebtoken');
const upload = require('../controllers/control-images');

exports.galery = (req, res) => {
    const token = req.cookies.jwt; 
    if (token) {
        jwt.verify(token, process.env.JWT_SECRETO, (err, decoded) => {
            if (err) {

                // Si hay un error al verificar el token
                console.error('Error al verificar el token:', err);
                res.redirect('/');

            } else {

        // Realizar consulta a la base de datos para obtener las tres primeras imágenes
         const sql = 'SELECT * FROM images';
         conexion.query(sql, (err, resultUser) => {
             if (err) {
                 console.error('Error al recuperar las imágenes:', err);
                 return res.status(500).send('Error al recuperar las imágenes de la base de datos');
             }

             // Convertir las imágenes a formato base64
             resultUser.forEach(image => {
            image.imagen_base64 = image.imagen_blob.toString('base64');
             });

             // Renderizar la plantilla index.hbs con los datos de las tres primeras imágenes
             res.render('galerys', {
                 images: resultUser,
                 admin:true
             });

         });


            }

        });

    } else {
         // Realizar consulta a la base de datos para obtener las tres primeras imágenes
         const sql = 'SELECT imagen_blob FROM images';
         conexion.query(sql, (err, resultUser) => {
             if (err) {
                 console.error('Error al recuperar las imágenes:', err);
                 return res.status(500).send('Error al recuperar las imágenes de la base de datos');
             }

             // Convertir las imágenes a formato base64
            resultUser.forEach(image => {
            image.imagen_base64 = image.imagen_blob.toString('base64');

             });

             // Renderizar la plantilla index.hbs con los datos de las tres primeras imágenes
             res.render('galerys', {
                 images: resultUser
             });

         });

    }
};

exports.galeryUser = (req, res) => {
    const token = req.cookies.jwt; 
    if (token) {
        jwt.verify(token, process.env.JWT_SECRETO, (err, decoded) => {
            if (err) {

                // Si hay un error al verificar el token
                console.error('Error al verificar el token:', err);
                res.redirect('/galery/users');

            } else {

                // Si el token es válido, continúa con la lógica para obtener y renderizar la galería de usuarios
                const sqlUser = 'SELECT * FROM cumple';
                conexion.query(sqlUser, (err, info) => {
                    if (err) {
                        console.error('Error al recuperar las imágenes:', err);
                        return res.status(500).send('Error al recuperar las imágenes de la base de datos');
                    }

                    // Convertir las imágenes a formato base64
                    info.forEach(image => {
                        image.imagen_base64 = image.images_blob.toString('base64');
                    });

                    // Renderizar la plantilla galeryUsers.hbs con los datos de las imágenes
                    res.render('users-galery', {
                        imagen: info,
                        admin: true
                    });

                });

            }
        });
    } else {

        // Si no hay token, ejecuta la lógica para obtener y renderizar la galería de usuarios sin el marcador admin
        const sqlUser = 'SELECT * FROM cumple'; 

        conexion.query(sqlUser, (err, info) => {
            if (err) {
                console.error('Error al recuperar las imágenes:', err);
                return res.status(500).send('Error al recuperar las imágenes de la base de datos');
            }

            // Convertir las imágenes a formato base64
            info.forEach(image => {
                image.imagen_base64 = image.images_blob.toString('base64');
            });

            // Renderizar la plantilla galeryUsers.hbs con los datos de las imágenes
            res.render('users-galery', {
 imagen: info});

        });
    }
};
