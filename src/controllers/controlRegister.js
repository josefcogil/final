const conexion = require('../server/server');

exports.register = (req, res)=>{
    const { nombre, apellido, cedula, pass1, pass2 } = req.body;

   console.log(nombre);
   console.log(apellido);
   console.log(cedula);
   console.log(pass1);
   console.log(pass2);

//    if(nombre == '' || apellido == '' || cedula == '' || pass1 == '' || pass2 == '' ){
//     res.render('login', {
//         alert: true,
//         icon: 'info',
//         text: '¡Llene todos los campos!',
//         title: 'ADVERTENCIA'
//       })
// }else if(pass1 !== pass2){
//     res.render('login', {
//         alert: true,
//         icon: 'error',
//         text: '¡Las contraseñas no son iguales!',
//         title: 'ADVERTENCIA'
//       })
// }
// // Ejecutar la consulta SQL para insertar los datos del formulario en la base de datos
// const sql = 'INSERT INTO admin (nombre, apellido, cedula, passw) VALUES (?, ?, ?, ?)';
// conexion.query(sql, [nombre, apellido, cedula, pass1], (err, result) => {
//     if (err) {
//         console.error('Error al insertar los datos en la base de datos:', err);
//         return res.status(500).send('Error al registrar el usuario');
//     }
//     console.log('Usuario registrado correctamente.');
//     // Redirigir o enviar una respuesta de éxito
//     res.redirect('/login.html'); // Redirige a la página de inicio de sesión después de registrar el usuario
// });
}