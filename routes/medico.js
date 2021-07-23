var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

//======================
//Obtener todos los medicos
//================================

app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    Medico.find({}, (err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mesnaje: 'Error cargando medico',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medico: medico,
                    total: conteo
                });

            });



        }).populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5);




});

//======================
//Actualizar Medico
//================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesnaje: 'Error al buscar medico',
                errors: err
            });


        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mesnaje: 'El medico con el ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });

        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mesnaje: 'Error al actualizar medico',
                    errors: err
                });


            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });
});

//======================
//Crear un nuevo medico
//================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario,
        hospital: body.hospital

    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mesnaje: 'Error al crear medico',
                errors: err
            });


        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });


});

//======================
//Borrar medico por id
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesnaje: 'Error al borrar medico',
                errors: err
            });


        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mesnaje: 'No existe un medico con esa ID',
                errors: { message: 'No existe un medico con esa ID' }
            });


        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });



});

module.exports = app;