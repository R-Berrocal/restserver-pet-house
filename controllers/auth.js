const bcryptjs = require("bcryptjs");
const {request,response} = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const {googleVerify}=require("../helpers/google-verify")
const Usuario =  require("../models/usurio")


const login = async (req=request,res= response)=>{
    const {correo, password}=req.body;

    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            })
        }
        //Si el usuario está activo 
        if(!usuario.estado){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado: false"
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - password"
            })
        }

        //Generar el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
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

        const  {nombre,correo,img} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            //si no existe el usuario tengo que crearlo
            const data={
                nombre,
                correo,
                rol:"USER_ROLE",
                password:":p",
                img,
                google:true,
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en db tiene el estado en false

        if(!usuario.estado){
            return res.status(401).json({
                msg:"hable con el administrador usuario bloqueado"
            })
        }

        //Generar el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:"El token no se pudo verificar"
        })
    }
}


module.exports= {
    login,
    googleSignIn
}