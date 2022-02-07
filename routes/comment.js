const { Router } = require("express");
const { check } = require("express-validator");
const { crearComment,
        obtenerComments,
        obtenerCommentsUser,
        obtenerCommentsPublication,
        obtenerComment,
        actualizarComment, 
        borrarComment,
        } = require("../controllers/comment");

const {validarJWT,validarCampos, esAdminRole}=require("../middlewares");
const {usuarioIdExiste,publicationIdExiste, commentIdExiste}=require("../helpers/db-validators")
const router = Router();

//obtener todos los comentarios - publico
router.get("/", obtenerComments);

//obtener comentarios de usuario por id - publico
router.get("/user/:id",[
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(usuarioIdExiste),
  validarCampos
], obtenerCommentsUser);

//obtener todos los comentarios de publicacion por id - publico
router.get("/publication/:id",[
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(publicationIdExiste),
  validarCampos
], obtenerCommentsPublication);

//obtener comentario por id
router.get("/:id",[
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(commentIdExiste),
  validarCampos
],obtenerComment );


//crear un comentario - privado -  cualquier persona con un token valido
router.post("/",[
  validarJWT,
  check("description","la descripcion es obligatoria").not().isEmpty(),
  check("publication_id","No es un id de mongo valido").isMongoId(),
  check("publication_id").custom(publicationIdExiste),
  validarCampos
], crearComment);

//Actualizar comentario - privado - cualquiera con token valido
router.put("/:id", [
  validarJWT,
  check("description","la descripcion es obligatoria").not().isEmpty(),
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(commentIdExiste),
  validarCampos
],actualizarComment);


//Borrar publicacion - privado - Admin
router.delete("/:id",[
  validarJWT,
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(commentIdExiste),
  validarCampos
],borrarComment);

module.exports = router;