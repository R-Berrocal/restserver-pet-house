const express = require("express");
const cors = require("cors");
const fileUpload=require("express-fileupload");
const { dbConnection } = require("../database/config");
const passport = require("passport");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.path = {
      adoption:"/api/adoption",
      auth: "/api/auth",
      buscar: "/api/buscar",
      comment: "/api/comments",
      publication: "/api/publication",
      uploads: "/api/uploads",
      user: "/api/users",
    };

    //conectar a base de datos
    this.conectarDB();
    //Middlewares
    this.middlewares();
    //rutas de mi aplicacion
    this.routes();
  }
  async conectarDB() {
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

    // Note that this option available for versions 1.0.0 and newer.
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath:true
      })
    );
  }

  routes() {
    this.app.use(this.path.adoption, require("../routes/adoption"));
    this.app.use(this.path.auth, require("../routes/auth"));
    this.app.use(this.path.buscar, require("../routes/buscar"));
    this.app.use(this.path.comment, require("../routes/comment"));
    this.app.use(this.path.publication, require("../routes/publication"));
    this.app.use(this.path.uploads, require("../routes/uploads"));
    this.app.use(this.path.user, require("../routes/user"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`escuchando en el puerto ${this.port}`);
    });
  }
}

module.exports = Server;
