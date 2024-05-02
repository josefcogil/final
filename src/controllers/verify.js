//Validar si existe cookie de inicio de sesión
const jwt = require('jsonwebtoken');


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