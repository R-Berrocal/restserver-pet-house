

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

router.get("/facebook",passport.authenticate("facebook",{scope:["email"]}));

router.get("/callback",passport.authenticate("facebook", {
    successRedirect: "https://localhost:3000/home",
    failureRedirect: "http://localhost:3000/api/auth/error",
    session : false 
    }),(req,res)=>{
        res.json({
          token: req.user.jwtoken
        })
      }
);
   

router.get('/error', (req,res) => {
    res.send("Error");
});

module.exports=router;