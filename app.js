// Requires (impportacion de librerias personalizadas o the terceros que ocupamos para que funcione algo)
var express = require('express');
var mongoose = require('mongoose');

//Inicializar Variables

var app = express();


//Conexión a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');

});


//Rutas (req = request, res= response, next)
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mesnaje: 'Peticion realizada completamiente'
    });
});


//Escuchar peticiones

app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});