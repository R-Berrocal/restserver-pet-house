const {Router}=require("express");
const {check}=require("express-validator");
const { cargarArchivo,
        mostrarImagen,
        actualizarImagenCloudinary,
        eliminarImgCloudinay, 
        actualizarImgPublication} = require("../controllers/uploads");

const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validarArchivo } = require("../middlewares/validar-archivo");

const {validarCampos}=require("../middlewares/validar-campos")

const router = Router();

router.post("/",validarArchivo,cargarArchivo);

router.post("/:coleccion/:id",[
    check("id","no es un id de mongo").isMongoId(),
    validarArchivo,
    check("coleccion").custom(c=> coleccionesPermitidas(c,["users","publications"])),
    validarCampos
],actualizarImagenCloudinary);

router.put("/publication/:id/:index",[
    check("id","no es un id de mongo").isMongoId(),
    validarArchivo,
    validarCampos
],actualizarImgPublication)

router.delete("/:coleccion/:id",[
    check("id","no es un id de mongo").isMongoId(),
    check("coleccion").custom(c=> coleccionesPermitidas(c,["users","publications"])),
    validarCampos
],eliminarImgCloudinay);


router.get("/:coleccion/:id",[
    check("id","no es un id de mongo").isMongoId(),
    check("coleccion").custom(c=> coleccionesPermitidas(c,["users","publications"])),
    validarCampos
],mostrarImagen)

module.exports=router;