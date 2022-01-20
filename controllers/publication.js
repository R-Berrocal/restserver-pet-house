const { Publication } = require("../models");
const cloudinary=require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
// obtener publicaciones - paginado - total - populate

const obtenerPublications = async (req, res) => {
  const { limite = 10, desde = 0 } = req.query;
  const query = { condition: true };

  const [total, publications] = await Promise.all([
    Publication.countDocuments(query),
    Publication.find(query)
      .populate("user", "name")
      .sort({ created_In: -1 })
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    publications,
  });
};

const obtenerPublicationsType = async (req, res) => {
  const { limite = 10, desde = 0 } = req.query;
  const { type } = req.params;
  const regex = new RegExp(type, "i");
  const query = { animal_type: regex };

  const [total, publications] = await Promise.all([
    Publication.countDocuments(query),
    Publication.find(query)
      .sort({ created_In: -1 })
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    publications,
  });
};
const obtenerPublicationsUser = async (req, res) => {
  const { limite = 10, desde = 0 } = req.query;
  const { id } = req.params;
  const query = { user: id };

  const [total, publications] = await Promise.all([
    Publication.countDocuments(query),
    Publication.find(query)
      .sort({ created_In: -1 })
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    publications,
  });
};
const obtenerPublication = async (req, res) => {
  const { id } = req.params;
  const publication = await Publication.findById(id);
  res.json({
    publication,
  });
};

const crearPublication = async (req, res) => {
  const { condition, user, ...resto } = req.body;
  const data = {
    ...resto,
    user: req.user._id,
  };

  const publication_AS = new Publication(data);
  const array = req.files.imgs;
  console.log(array);
  if (Array.isArray(array)) {
    const tempPath = array.map(({ tempFilePath }) => tempFilePath);
    tempPath.forEach(async (element) => {
      link = await cloudinary.uploader.upload(element, {
        folder: "Publications",
      });
      publication_AS.imgs.push(link.secure_url);
      await publication_AS.save();
    });
  } else {
    const { tempFilePath } = array;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
      folder: "Publications",
    });
    publication_AS.imgs.push(secure_url);
    await publication_AS.save();
  }
  //guardar en dv
  

  res.status(201).json({
    publication_AS,
  });
};

const actualizarPublication = async (req, res) => {
  const { id } = req.params;
  const { user, ...data } = req.body;

  data.user = req.user_id;
  data.updated_In = new Date();
  const publication = await Publication.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.json(publication);
};

const borrarPublication = async (req, res) => {
  const { id } = req.params;
  const publicationDelete = await Publication.findByIdAndUpdate(
    id,
    { condition: false },
    { new: true }
  );
  res.json({
    publicationDelete,
  });
};

module.exports = {
  crearPublication,
  obtenerPublications,
  obtenerPublicationsUser,
  obtenerPublicationsType,
  obtenerPublication,
  actualizarPublication,
  borrarPublication,
};
