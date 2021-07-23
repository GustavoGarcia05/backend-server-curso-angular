var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

//======================
//Obtener todos los hospitales
//================================

app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);


    Hospital.find({}, (err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mesnaje: 'Error cargando hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });
            });



        }).populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5);




});

//======================
//Actualizar hospital
//================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesnaje: 'Error al buscar hospital',
                errors: err
            });


        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mesnaje: 'El hospital con el ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });

        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mesnaje: 'Error al actualizar hospital',
                    errors: err
                });


            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });
});

//======================
//Crear un nuevo hospital
//================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mesnaje: 'Error al crear hospital',
                errors: err
            });


        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });


});

//======================
//Borrar hospital por id
//================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mesnaje: 'Error al borrar hospital',
                errors: err
            });


        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mesnaje: 'No existe un hospital con esa ID',
                errors: { message: 'No existe un hospital con esa ID' }
            });


        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });



});

module.exports = app;