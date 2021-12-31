const jwt = require("jsonwebtoken");
const Usuario = require("../models/usurio");



const validarJWT=async(req,res,next)=>{
    const token = req.header("x-token");
    if(!token){
        return res.status(401).json({
            msg: " No hay token en la peticion"
        })
    }


    try {
        //extraemos el uid del usuario al que pertenece el token 
        const {uid} =jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        // req.uid=uid;

        //Leemos el usuario al que corresponde al uid
        const user = await Usuario.findById(uid);

        //verificar si el usuario tiene estado en true  
        if(!user){
            return res.status(401).json({
                msg:"Token no valido - usuario no existe en DB"
            })
        }
        if(!user.condition){
            return res.status(401).json({
                msg:"Token no valido - usuario con estado: false"
            })
        }

        req.user=user;


        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no valido"
        })
    }
    
   
}

module.exports={
    validarJWT
}