const { Router } = require("express");
const { check, checkSchema } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { esRoleValido, emailExiste, usuarioIdExiste } = require("../helpers/db-validators");
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
} = require("../controllers/user");


const router = Router();

router.get("/", usuariosGet);

router.post("/",[
  check("nombre","El nombre es obligatorio").not().isEmpty(),
  check("correo","Esto no es un correo valido").isEmail(),
  check("correo").custom(emailExiste),
  check("password","El password debe ser de mas de seis caracteres").isLength({min:6}),
  // check("rol","No es un rol valido").isIn(["ADMIN_ROLE","USER_ROLE"]),
  check("rol").custom((rol)=>esRoleValido(rol)),
  validarCampos
],usuariosPost);

router.put("/:id",[
  check("id","No es un id valido de mongo").isMongoId(),
  check("id").custom(usuarioIdExiste),
  check("rol").custom(esRoleValido),
  validarCampos
],usuariosPut);

router.delete("/:id",[
  check("id","No es un id valido de mongo").isMongoId(),
  check("id").custom(usuarioIdExiste),
  validarCampos
] ,usuariosDelete);
router.patch("/", usuariosPatch);


module.exports = router;
