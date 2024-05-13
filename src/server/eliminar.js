const conexion = require('../server/server');

exports.eliminarHomeImg = (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM images WHERE id = ?';

    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la imagen:', err);
            return res.status(500).send('Error al eliminar la imagen de la base de datos');
        }
        console.log('Imagen eliminada correctamente');
        res.redirect('/'); // Redirecciona a la página principal 
    });
};

exports.eliminarImages = (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM images WHERE id = ?';

    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la imagen:', err);
            return res.status(500).send('Error al eliminar la imagen de la base de datos');
        }
        console.log('Imagen eliminada correctamente');
        res.redirect('/galery'); // Redirecciona a la página principal 
    });
};

exports.eliminarCard = (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM cumple WHERE id = ?';

    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la imagen:', err);
            return res.status(500).send('Error al eliminar la imagen de la base de datos');
        }
        console.log('Imagen eliminada correctamente');
        res.redirect('/galery/users'); // Redirecciona a la página principal 
    });
};

exports.eliminarHomeCard = (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM cumple WHERE id = ?';

    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la imagen:', err);
            return res.status(500).send('Error al eliminar la imagen de la base de datos');
        }
        console.log('Imagen eliminada correctamente');
        res.redirect('/'); // Redirecciona a la página principal 
    });
};