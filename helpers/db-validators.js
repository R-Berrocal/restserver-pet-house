const { Publication,Usuario,Role,Comment, Adoption } = require("../models");


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

const commentIdExiste= async(id)=>{
  const commentExiste = await Comment.findById(id);
  if(!commentExiste){
    throw new Error(`El id del comentario no existe, ${id}`);
  }
}
const adoptionIdExiste= async(id)=>{
  const adoptionExiste = await Adoption.findById(id);
  if(!adoptionExiste){
    throw new Error(`El id del comentario no existe, ${id}`);
  }
}

const coleccionesPermitidas=(coleccion="",colecciones=[])=>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
      throw new Error(`la coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}
module.exports={
    adoptionIdExiste,
    commentIdExiste,
    coleccionesPermitidas,
    esRoleValido,
    emailExiste,
    usuarioIdExiste,
    publicationIdExiste
}