const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const passport = require("passport");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.path={
      auth:"/api/auth",
      buscar:"/api/buscar",
      publication:"/api/publication",
      user:"/api/users",

    }
    
    //conectar a base de datos
    this.conectarDB();
    //Middlewares
    this.middlewares();
    //rutas de mi aplicacion
    this.routes();

    
  }
  async conectarDB(){
      await dbConnection();
  }
  middlewares() {
    //cors
    this.app.use(cors());
    
    //inicializando passport
    this.app.use(passport.initialize());

    //lectura y parseo del body
    this.app.use(express.json());

    //directorio publico
    this.app.use(express.static("public"));

  }

  routes() {
    this.app.use(this.path.auth,require("../routes/auth"));
    this.app.use(this.path.buscar,require("../routes/buscar"));
    this.app.use(this.path.publication, require("../routes/publication"));
    this.app.use(this.path.user, require("../routes/user"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`escuchando en el puerto ${this.port}`);
    });
  }
}

module.exports = Server;
