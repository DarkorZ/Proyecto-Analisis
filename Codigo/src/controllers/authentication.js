const express = require('express');
const passport = require('passport');

// Crear el enrutador
const router = express.Router();

// Ruta para cerrar sesión
router.get('/logout', (req, res, next) => {
    req.logout((err) => {  // Asegúrate de usar el callback aquí
        if (err) {
            return next(err);  // Manejo de errores
        }
        res.redirect('/');  // Redirige a la página principal o donde lo necesites
    });
});

module.exports = router;
