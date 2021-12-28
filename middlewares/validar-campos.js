
const { validationResult } = require("express-validator");

const validarCampos=(req,res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors); 
    }
    //si llegas  a este punto por favor sigue, esto es lo que significa el next en nuestro 
    //middleware
    next();
}

module.exports={
    validarCampos
}