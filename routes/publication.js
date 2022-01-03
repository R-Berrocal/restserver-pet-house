const { Router } = require("express");
const { check } = require("express-validator");
const { crearPublication,
        obtenerPublitions,
        obtenerPublicationsUser,
        actualizarPublication, 
        borrarPublication} = require("../controllers/publication");

const {validarJWT,validarCampos, esAdminRole}=require("../middlewares");
const {usuarioIdExiste,publicationIdExiste}=require("../helpers/db-validators")
const router = Router();

//obtener todas las publicaciones - publico
router.get("/", obtenerPublitions);

//obtener una publicacion por id - publico
router.get("/:id",[
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(usuarioIdExiste),
  validarCampos
], obtenerPublicationsUser);


//crear una publicacion - privado -  cualquier persona con un token valido
router.post("/",[
  validarJWT,
  check("description","la descripcion es obligatoria").not().isEmpty(),
  validarCampos
], crearPublication);

//Actualizar - privado - cualquiera con token valido
router.put("/:id", [
  validarJWT,
  check("description","la descripcion es obligatoria").not().isEmpty(),
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(publicationIdExiste),
  validarCampos
],actualizarPublication);


//Borrar publicacion - privado - Admin
router.delete("/:id",[
  validarJWT,
  esAdminRole,
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(publicationIdExiste),
  validarCampos
],borrarPublication);

module.exports = router;
