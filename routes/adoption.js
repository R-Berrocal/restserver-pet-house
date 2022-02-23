const { Router } = require("express");
const { check } = require("express-validator");
const { obtenerAdoptions,crearAdoption, borrarAdoption} = require("../controllers/adoption");

const {validarJWT,validarCampos}=require("../middlewares");
const {publicationIdExiste, adoptionIdExiste}=require("../helpers/db-validators");
const { validarArchivo } = require("../middlewares/validar-archivo");
const router = Router();

//obtener todas las adopciones - publico
router.get("/", obtenerAdoptions);



//crear una adopcion - privado -  cualquier persona con un token valido
router.post("/",[
  validarJWT,
  check("name","el nombre es obligatoria").not().isEmpty(),
  check("publication_id","No es un id de mongo valido").isMongoId(),
  check("publication_id").custom(publicationIdExiste),
  validarArchivo,
  validarCampos
], crearAdoption);

router.delete("/:id",[
  validarJWT,
  check("id","No es un id de mongo").isMongoId(),
  check("id").custom(adoptionIdExiste),
  validarCampos
],borrarAdoption);



module.exports = router;