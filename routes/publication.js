const { Router } = require("express");
const { check } = require("express-validator");
const { crearPublication,
        obtenerPublications,
        obtenerPublicationsUser,
        obtenerPublication,
        actualizarPublication, 
        borrarPublication,
        obtenerPublicationsType,
        confirmarAdoption,
        cancelarAdoption,
        } = require("../controllers/publication");

const {validarJWT,validarCampos, esAdminRole}=require("../middlewares");
const {usuarioIdExiste,publicationIdExiste}=require("../helpers/db-validators");
const { validarArchivo } = require("../middlewares/validar-archivo");
const router = Router();

//obtener todas las publicaciones - publico
router.get("/", obtenerPublications);

router.get("/animal_Type/:type", obtenerPublicationsType);

//obtener publicaciones de usuario por id - publico
router.get("/user/:id",[
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(usuarioIdExiste),
  validarCampos
], obtenerPublicationsUser);


//obtener una publicacion por id - publico
router.get("/:id",[
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(publicationIdExiste),
  validarCampos
],obtenerPublication );


//crear una publicacion - privado -  cualquier persona con un token valido
router.post("/",[
  validarJWT,
  check("description","la descripcion es obligatoria").not().isEmpty(),
  validarArchivo,
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

//confirmar adopcion y eliminar publicacion
router.put("/adopt/:id",[
  validarJWT,
  esAdminRole,
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(publicationIdExiste),
  validarCampos
],confirmarAdoption);
router.put("/cancelAdopt/:id",[
  validarJWT,
  esAdminRole,
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(publicationIdExiste),
  validarCampos
],cancelarAdoption);

module.exports = router;
