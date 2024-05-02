const mysql = require('mysql');


const conexion = mysql.createConnection({
    user: 'root',
    password: '',
    database: 'contraloria',
    host: 'localhost'
});


conexion.connect((err)=>{
    if(err){
        console.log('Error al conectar a la bd' + err);
    }else{
        console.log('Conexion a la base de datos exitosa');
    }
})

module.exports = conexion;