const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

//obtener todas las publicaciones - publico
router.get("/", (req, res) => {
  res.json({
    msg: "todo melo",
  });
});

//obtener una publicacion por id - publico
router.get("/:id", (req, res) => {
  res.json({
    msg: "get - id",
  });
});


//crear una publicacion - privado -  cualquier persona con un token valido
router.post("/", (req, res) => {
  res.json({
    msg: "post",
  });
});

//Actualizar - privado - cualquiera con token valido
router.put("/:id", (req, res) => {
  res.json({
    msg: "put",
  });
});


//Actualizar - privado - cualquiera con token valido
router.delete("/:id", (req, res) => {
  res.json({
    msg: "delete",
  });
});

module.exports = router;
