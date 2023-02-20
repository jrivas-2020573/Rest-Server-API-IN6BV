const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { obtenerCategorias, obtenerCategoriaPorID, agregarCategoria, editarCategoria, eliminarCategoria } = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Obtener todas las categorias - Public 
router.get('/', obtenerCategorias);

//Obtener una categoria por ID -Public
router.get('/:id',[
    check('id', 'No es un id valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoriaPorID);

//Crear categoria - Private - Cualquiera con token valido
router.post('/agregar',[
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], agregarCategoria);

//Actualizar categoria - Private - se require ID y un token valido
router.put('/editar/:id',[
    validarJWT,
    check('id', 'No es un id valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], editarCategoria);

//Borrar una categoria - Private - Se requiere ID y token valido - Solo el admin puede borrar
router.delete('/eliminar/:id', eliminarCategoria);

module.exports = router;