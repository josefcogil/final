const jwt = require('jsonwebtoken');
const conexion = require('../server/server');


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
            // Consulta para obtener todas las imágenes
            const sql = 'SELECT * FROM images ORDER BY id DESC LIMIT 4';
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
             
                const sqlUser = 'SELECT * FROM cumple ORDER BY id DESC LIMIT 6';
                conexion.query(sqlUser, (err, rows) => {
                    if (err) {
                        console.error('Error al obtener los registros de la base de datos:', err);
                    return res.status(500).send('Error al obtener los registros de la base de datos');
                            }
                            rows.forEach(image => {
                                image.imagen_base64 = image.images_blob.toString('base64');
                            });
                    // Si la consulta se realizó con éxito, envía los registros como respuesta
                    res.render('index', { 
                        users: rows, 
                        imagenes: result
                    });
        });

            });
                
            } else {
                console.log(decoded);
                next();
            }
        });
    } else {
          // Consulta para obtener todas las imágenes
          const sqlImages = 'SELECT * FROM images ORDER BY id DESC LIMIT 4';
          // Ejecuta la consulta para obtener las imágenes
          conexion.query(sqlImages, (err, result) => {
              if (err) {
                  console.error('Error al recuperar las imágenes:', err);
                  return res.status(500).send('Error al recuperar las imágenes de la base de datos');
              }
              // Convertir las imágenes a base64 antes de pasarlas a la plantilla
              result.forEach(image => {
                  image.imagen_base64 = image.imagen_blob.toString('base64');
              });
          
              const sqlCumple = 'SELECT * FROM cumple ORDER BY id DESC LIMIT 6';
              // Ejecuta la consulta para obtener los registros de cumple
              conexion.query(sqlCumple, (err, rows) => {
                  if (err) {
                      console.error('Error al obtener los registros de la base de datos:', err);
                      return res.status(500).send('Error al obtener los registros de la base de datos');
                  }
                  // Convertir las imágenes a base64 antes de pasarlas a la plantilla
                  rows.forEach(row => {
                      row.imagen_base64 = row.images_blob.toString('base64');
                  });
                  // Si la consulta se realizó con éxito, envía los registros como respuesta
                  res.render('index', { 
                      users: rows,
                      imagenes: result,
                      admin: true 
                  });
              });
          });
    }
} 

//Eliminar cookie para cerrar sesión
exports.logout = async(req, res)=>{
     res.clearCookie('jwt')
     return res.redirect('/');
}

exports.verificar = async (req, res, next) => {
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
       // Llamando a next() para pasar el control al siguiente middleware
       next();
    }
};