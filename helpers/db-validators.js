const { Publication,Usuario,Role } = require("../models");


const esRoleValido=async(rol="")=>{
    const existeRol= await Role.findOne({rol});
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

const publicationIdExiste= async(id)=>{
  const publicationExiste = await Publication.findById(id);
  if(!publicationExiste){
    throw new Error(`El id de la publicacion no existe, ${id}`);
  }
}
module.exports={
    esRoleValido,
    emailExiste,
    usuarioIdExiste,
    publicationIdExiste
}