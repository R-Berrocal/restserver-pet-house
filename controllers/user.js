const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usurio");

const usuariosGet = async (req = request, res = response) => {
  // const {q,nombre, edad}=  req.query;
  const { limite = 5, desde = 0 } = req.query;

  //usamos el query para solo contar y mostrar los usuarios que tengan como estado:true
  const query = { estado: true };

  // const usuarios = await Usuario.find()
  // .skip(Number(desde))
  // .limit(Number(limite));
  // const total = await Usuario.countDocuments();

  //promise.all nos permite mandar todas las promesas que queremos que se ejecuten en un arreglo
  //usamos una desesctructuracion de arreglos para mostrar el total y los usuarios

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //guardar en DB
  await usuario.save();
  res.json({
    usuario,
  });
};
const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //Todo validar contra la base de datos

  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json(usuario);
};


  const usuariosDelete = async(req, res) => {
  
  const {id}=req.params;

  // const uid= req.uid;
  
  //Fisicamente lo borramos
  // const usuario= await Usuario.findByIdAndDelete(id)

  //Eliminamos al usuario extrayendo el id del req.params y cambiamos su estado de true a false
  const usuarioEliminado = await Usuario.findByIdAndUpdate(id, {estado:false});


  //acá almacenamos el usuario autenticado que viene en la request
  const usuarioAutenticado = req.usuario;


  //y mandamos en la respuesta el usuario eliminado y el usuario autenticado que lo elimino
  res.status(400).json({
    usuarioEliminado,
    usuarioAutenticado
  });
};
const usuariosPatch = (req, res) => {
  res.json({
    msg: "patch API-Controlador",
  });
};
module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
