const conexion = require('../server/server');
//Validar si existe cookie
exports.galery = async(req, res)=>{
         // Realizar consulta a la base de datos para obtener las tres primeras imágenes
         const sql = 'SELECT imagen_blob FROM images'; // Suponiendo que tienes una columna 'id' que indica el orden de inserción
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
                 admin: true
             });
         });

} 
