const jwt = require('jsonwebtoken');
const conexion = require('../server/server');
const {promisify} = require('util');


//validar inicio de sesión
exports.login = async (req, res) => {
    try {
        const usuario = req.body.nombre;
        const pass = req.body.pass;

        if(usuario == '' || pass == ''){
            res.render('login', {
                alert: true,
                icon: 'info',
                text: '¡Llene todos los campos!',
                title: 'ADVERTENCIA'
              })
        }else{
            conexion.query('SELECT * FROM admin WHERE cedula = ?', [usuario], (error, results) => {
                if(results.length > 0){
                    if(pass == results[0].passw){
                    //Datos correctos - redirecion al index
                        const id = results[0].id;
                        const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA});
                        const cookiesOpciones = {
                        httpOnly: true
                        }

                        res.cookie('jwt', token, cookiesOpciones);
                        res.redirect('/');
    
                    }else{
                        //contraseña incorrecta
                        res.render('login', {
                            alert: true,
                            icon: 'error',
                            text: '¡Usuario o contraseña incorrecto!',
                            title: 'ADVERTENCIA'
                          })
    
                        }
                }else{
                    //usuario incorrecto
                  res.render('login', {
                    alert: true,
                    icon: 'error',
                    text: '¡Usuario o contraseña incorrecto!',
                    title: 'ADVERTENCIA'
                  })
            }
        });
        }
       
    } catch (error) {
        console.log(error);
    }
}

//Validar si existe cookie de inicio de sesión
exports.autenticado = async(req, res, next)=>{
    const token = req.cookies.jwt; 
    if (!token) {
        jwt.verify(token, process.env.JWT_SECRETO, (err, decoded) => {
            if (err) {

        // Consulta para obtener las primeras cuatro imágenes
        const sql = 'SELECT imagen_blob FROM images LIMIT 4';
        // Ejecuta la consulta
        conexion.query(sql, (err, result) => {
            if (err) {
                console.error('Error al recuperar las imágenes:', err);
                return res.status(500).send('Error al recuperar las imágenes de la base de datos');
            }

            // Convertir las imágenes a base64 antes de pasarlas a la plantilla
            result.forEach(image => {
                image.imagen_base64 = image.imagen_blob.toString('base64');
            });
           
            // Realizar consulta a la base de datos para obtener las tres primeras imágenes
            const sql = 'SELECT images_blob, nombre, descripcion FROM cumple ORDER BY id ASC LIMIT 3'; // Suponiendo que tienes una columna 'id' que indica el orden de inserción
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
                res.render('index', { 
                    imagenes: result,
                    users: resultUser
                });
            });
            });
                
            } else {
                console.log(decoded);
                next();
            }
        });
    } else {


     // Consulta para obtener las primeras cuatro imágenes
     const sql = 'SELECT imagen_blob FROM images LIMIT 4';
    // Ejecuta la consulta
    conexion.query(sql, (err, result) => {
        if (err) {
            console.error('Error al recuperar las imágenes:', err);
            return res.status(500).send('Error al recuperar las imágenes de la base de datos');
        }
        // Convertir las imágenes a base64 antes de pasarlas a la plantilla
        result.forEach(image => {
            image.imagen_base64 = image.imagen_blob.toString('base64');
        });
        // Pasa las imágenes convertidas a base64 a la plantilla hbs
        res.render('index', 
        {admin: true,
         imagenes: result,
         alert: true,
         icon: 'success',
         text: '¡Iniciaste como administrador!',
         title: 'Bienvenido'
       })



    }); 
    }
} 

//Eliminar cookie para cerrar sesión
exports.logout = async(req, res)=>{
     res.clearCookie('jwt')
     return res.redirect('/');
}
