
const {Publication} = require("../models");


// obtener publicaciones - paginado - total - populate

const obtenerPublications=async(req,res)=>{
    const {limite=10, desde=0}= req.query;
    const query = {condition:true};

    const [total,publications]= await Promise.all([
        Publication.countDocuments(query),
        Publication.find(query)
        .populate("user","name")
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        publications
    })
}

const obtenerPublicationsUser=async(req,res)=>{

    const {limite=10, desde=0}= req.query;
    const {id}=req.params;
    const query = {id};

    const [total,publications]= await Promise.all([
        Publication.countDocuments(query),
        Publication.find(query)
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        publications
    })
}
const obtenerPublication=async(req,res)=>{
    const {id}=req.params;
    const publication= await Publication.findById(id);
    res.json({
        publication
    })
}

const crearPublication=async(req,res)=>{
    const {condition,user, ...resto} = req.body;
    const data={
        ...resto,
        user: req.user._id
    }
    const publication_AS = new Publication(data);

    //guardar en dv
    await publication_AS.save();

    res.status(201).json({
        publication_AS
    })
}

const actualizarPublication = async(req, res )=>{
    const {id}=req.params;
    const {user, ...data}=req.body;

    data.user=req.user_id;
    data.updated_In=new Date();
    const publication = await Publication.findByIdAndUpdate(id,data,{new:true});
    res.json(publication);
}

const borrarPublication=async(req,res)=>{
    const {id}=req.params;
    const publicationDelete= await Publication.findByIdAndUpdate(id,{condition:false},{new: true});
    res.json({
        publicationDelete
    })
}

module.exports={
    crearPublication,
    obtenerPublications,
    obtenerPublicationsUser,
    obtenerPublication,
    actualizarPublication,
    borrarPublication,
}