var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
const path = require('path');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de coleeción
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mesnaje: 'Tipo de coleccioón no es valida',
            errors: { message: 'Tipo de coleccioón no es valida' }
        });

    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mesnaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });

    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mesnaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });

    }

    //Nombre de archivo personalizado
    //123456789123-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //Mover el archivo del temporal al path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mesnaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mesnaje: 'Archivo movido',
        //     nombreCortado: nombreCortado,
        //     extensionArchivo: extensionArchivo
        // });

    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mesnaje: 'Usuario no esxite',
                    errors: { message: 'Usuario no existe' }
                });

            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {

                });
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mesnaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });



        });



    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mesnaje: 'Medico no esxite',
                    errors: { message: 'Medico no existe' }
                });

            }

            var pathViejo = './uploads/medicos/' + medico.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {

                });
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mesnaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });

            });

        });


    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mesnaje: 'hospital no esxite',
                    errors: { message: 'hospital no existe' }
                });

            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {

                });
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mesnaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            });

        });


    }

}

module.exports = app;