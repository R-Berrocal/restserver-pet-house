const role = require("../models/role");
const Usuario=require("../models/usurio");


const esRoleValido=async(rol="")=>{
    const existeRol= await role.findOne({rol});
    if(!existeRol){
      throw new Error(`El rol ${rol} no existe en la base de datos`);
    }
}
const emailExiste= async(email="")=>{

    //verificar si el correo existe
    const correoExiste= await Usuario.findOne({email});
    if(correoExiste){
      throw new Error(`EL correo ${email}, ya existe en la DB`)
    }
}
const usuarioIdExiste= async(id)=>{

    //verificar si el usuario con id existe
    const idExiste= await Usuario.findById(id);
    if(!idExiste){
      throw new Error(`EL usuario con ${id}, no existe en la DB`)
    }
}
module.exports={
    esRoleValido,
    emailExiste,
    usuarioIdExiste
}