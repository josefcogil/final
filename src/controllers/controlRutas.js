const jwt = require("jsonwebtoken");
const conexion = require("../server/server");
const util = require("util");

// Convierte conexion.query en una función que devuelve una promesa
const query = util.promisify(conexion.query).bind(conexion);

//validar inicio de sesión
exports.login = async (req, res) => {
  try {
    const usuario = req.body.nombre;
    const pass = req.body.pass;

    if (usuario == "" || pass == "") {
      res.render("login", {
        alert: true,
        icon: "info",
        text: "¡Llene todos los campos!",
        title: "ADVERTENCIA",
      });
    } else {
      conexion.query(
        "SELECT * FROM admin WHERE cedula = ?",
        [usuario],
        (error, results) => {
          if (results.length > 0) {
            if (pass == results[0].passw) {
              //Datos correctos - redirecion al index
              const id = results[0].id;
              const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                expiresIn: process.env.JWT_TIEMPO_EXPIRA,
              });
              const cookiesOpciones = {
                httpOnly: true,
              };

              res.cookie("jwt", token, cookiesOpciones);
              res.redirect("/");
            } else {
              //contraseña incorrecta
              res.render("login", {
                alert: true,
                icon: "error",
                text: "¡Usuario o contraseña incorrecto!",
                title: "ADVERTENCIA",
              });
            }
          } else {
            //usuario incorrecto
            res.render("login", {
              alert: true,
              icon: "error",
              text: "¡Usuario o contraseña incorrecto!",
              title: "ADVERTENCIA",
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

//Validar si existe cookie de inicio de sesión
exports.autenticado = async (req, res) => {
  try {
    // Consulta las imágenes de la base de datos
    const images = await query("SELECT * FROM images ORDER BY id DESC LIMIT 4");

    // Convierte las imágenes a base64
    images.forEach((image) => {
      image.imagen_base64 = image.imagen_blob.toString("base64");
    });

    const users = await query("SELECT * FROM cumple ORDER BY id DESC LIMIT 6");

    users.forEach((image) => {
      image.imagen_base64 = image.images_blob.toString("base64");
    });

    const token = req.cookies.jwt;

    // Renderiza la plantilla con los datos recuperados de la base de datos
    res.render("index", { admin: token, imagenes: images, users });
  } catch (error) {
    console.error("Error al recuperar imágenes de la base de datos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

//Eliminar cookie para cerrar sesión
exports.logout = async (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/");
};

exports.verificar = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    jwt.verify(token, process.env.JWT_SECRETO, (err, decoded) => {
      if (err) {
        res.redirect("/");
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
