const { Router } = require("express");
const { check } = require("express-validator");
const { obtenerAdoptions,crearAdoption} = require("../controllers/adoption");

const {validarJWT,validarCampos}=require("../middlewares");
const {publicationIdExiste}=require("../helpers/db-validators")
const router = Router();

//obtener todas las adopciones - publico
router.get("/", obtenerAdoptions);



//crear una adopcion - privado -  cualquier persona con un token valido
router.post("/",[
  validarJWT,
  check("name","el nombre es obligatoria").not().isEmpty(),
  check("publication_id","No es un id de mongo valido").isMongoId(),
  check("publication_id").custom(publicationIdExiste),
  validarCampos
], crearAdoption);



module.exports = router;