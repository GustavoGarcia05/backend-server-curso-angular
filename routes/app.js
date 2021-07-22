//Rutas (req = request, res= response, next)

var express = require('express');

var app = express();


app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mesnaje: 'Peticion realizada correctamente'
    });
});

module.exports = app;