

const { Router } = require("express");
const { check} = require("express-validator");
const passport = require("passport");
const { login, googleSignIn, facebookSigin } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();

router.post("/login",[
    check("email","El correo es obligatorio").isEmail(),
    check("password","la contraseña es obligatoria").not().isEmpty(),
    validarCampos
], login);


router.post("/google",[
    check("id_token","id_token de google es necesario").not().isEmpty(),
    validarCampos
], googleSignIn);

router.post("/facebook",[
    check("id_token","id_token de facebook es necesario").not().isEmpty(),
    validarCampos
], facebookSigin);


module.exports=router;