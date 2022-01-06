const bcryptjs = require("bcryptjs");
const {request,response} = require("express");
const { facebookVerify } = require("../helpers/facebook-verify");
const { generarJWT } = require("../helpers/generar-jwt");
const {googleVerify}=require("../helpers/google-verify")
const Usuario =  require("../models/usurio");

const login = async (req=request,res= response)=>{
    const {email, password}=req.body;

    try {
        //Verificar si el email existe
        const user = await Usuario.findOne({email});
        if(!user){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            })
        }
        //Si el usuario está activo 
        if(!user.condition){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado: false"
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - password"
            })
        }

        //Generar el jwt
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }
}

const googleSignIn=async(req,res=response)=>{
    const {id_token}=req.body;
    try {

        const  {name,email,img} = await googleVerify(id_token);
        
        let user = await Usuario.findOne({email});
        if(!user){
            //si no existe el usuario tengo que crearlo
            const data={
                name,
                email,
                rol:"USER_ROLE",
                password:":p",
                img,
                google:true,
            };

            user = new Usuario(data);
            await user.save();
        }

        //si el usuario en db tiene el estado en false

        if(!user.condition){
            return res.status(401).json({
                msg:"hable con el administrador usuario bloqueado"
            })
        }

        //Generar el jwt
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:"El token no se pudo verificar"
        })
    }
}

const renovar_o_validarJwt=async(req,res)=>{
    const userAuthenticated = req.user;
    const token = await generarJWT(userAuthenticated.id);

    res.json({
        userAuthenticated,
        token
    })
}



module.exports= {
    login,
    googleSignIn,
    renovar_o_validarJwt
}