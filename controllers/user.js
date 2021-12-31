const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usurio");

const usuariosGet = async (req = request, res = response) => {
  // const {q,nombre, edad}=  req.query;
  const { limite = 10, desde = 0 } = req.query;

  //usamos el query para solo contar y mostrar los usuarios que tengan como estado:true
  const query = { condition: true };

  // const usuarios = await Usuario.find()
  // .skip(Number(desde))
  // .limit(Number(limite));
  // const total = await Usuario.countDocuments();

  //promise.all nos permite mandar todas las promesas que queremos que se ejecuten en un arreglo
  //usamos una desesctructuracion de arreglos para mostrar el total y los usuarios

  const [total, users] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({
    total,
    users,
  });
};

const usuariosPost = async (req, res) => {
  const { name, email, password, rol } = req.body;
  const user = new Usuario({ name, email, password, rol });

  //encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  //guardar en DB
  await user.save();

  
  res.json({
    user,
    
  });
};
const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...resto } = req.body;

  //Todo validar contra la base de datos

  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const user = await Usuario.findByIdAndUpdate(id, resto);
  const userAuthenticated  = req.user;
  res.json({
    user,
    userAuthenticated
  });
};


  const usuariosDelete = async(req, res) => {
  
  const {id}=req.params;

  // const uid= req.uid;
  
  //Fisicamente lo borramos
  // const usuario= await Usuario.findByIdAndDelete(id)

  //Eliminamos al usuario extrayendo el id del req.params y cambiamos su estado de true a false
  const userDeleted = await Usuario.findByIdAndUpdate(id, {condition:false});


  //acá almacenamos el usuario autenticado que viene en la request
  const userAuthenticated = req.user;


  //y mandamos en la respuesta el usuario eliminado y el usuario autenticado que lo elimino
  res.status(400).json({
    userDeleted,
    userAuthenticated
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
