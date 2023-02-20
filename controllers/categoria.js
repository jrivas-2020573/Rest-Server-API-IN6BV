const { response, request } = require('express');

const Categoria = require('../models/categoria');

const obtenerCategorias = async(req = request, res = response) => {
    const query = { estado: true };

    const listaCategorias = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'nombre')
    ]);

    res.json({
        listaCategorias
    });
}

const obtenerCategoriaPorID = async(req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        msg: 'Categoria por ID',
        categoria
    });
}

const agregarCategoria = async (req = request, res = response) => {
    const nombre  = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe en la DB`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const CategoriaAgregada = new Categoria(data);

    await CategoriaAgregada.save();


    res.status(201).json({
        msg: 'Post Categoria',
        CategoriaAgregada
    });
}

const editarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...Data} = req.body;

    Data.nombre = Data.nombre.toUpperCase();
    Data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, Data, {new: true});

    res.json({
        msg: 'Put categoria',
        categoria
    });

}

const eliminarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'Delete categoria',
        id
    });

}

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorID,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria
}