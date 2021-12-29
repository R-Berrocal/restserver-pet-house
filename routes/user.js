const { Router } = require("express");
const { check } = require("express-validator");

// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");
const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");
const {
  esRoleValido,
  emailExiste,
  usuarioIdExiste,
} = require("../helpers/db-validators");
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
} = require("../controllers/user");

const router = Router();

router.get("/",[
  validarJWT,
  esAdminRole], usuariosGet);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "Esto no es un correo valido").isEmail(),
    check("correo").custom(emailExiste),
    check(
      "password",
      "El password debe ser de mas de seis caracteres"
    ).isLength({ min: 6 }),
    // check("rol","No es un rol valido").isIn(["ADMIN_ROLE","USER_ROLE"]),
    check("rol").custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE","USER_ROLE"),
    check("id", "No es un id valido de mongo").isMongoId(),
    check("id").custom(usuarioIdExiste),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    // tieneRole("ADMIN_ROLE"),
    check("id", "No es un id valido de mongo").isMongoId(),
    check("id").custom(usuarioIdExiste),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
