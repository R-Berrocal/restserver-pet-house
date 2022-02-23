const {Adoption,Publication} = require("../models");
const cloudinary=require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// obtener comentarios - paginado - total - populate

const obtenerAdoptions=async(req,res)=>{
    const {limite=10, desde=0}= req.query;
    const query = {condition:true};
    const [total,adoptions]= await Promise.all([
        Adoption.countDocuments(query),
        Adoption.find(query)
        .populate("user",["name","img"])
        .populate("publication_id",["title","imgs"])
        .sort({"created_In":-1})
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        adoptions
    })
}
const crearAdoption=async(req,res)=>{
    const {condition,user, ...resto} = req.body;

    const data ={
        ...resto,
        user:req.user._id
    }
    
    const adoption = new Adoption(data);
    await Publication.findByIdAndUpdate(adoption.publication_id,{"isAdopt":false});
    const array = req.files.imgs;
    console.log(array);
    if (Array.isArray(array)) {
        const tempPath = array.map(({ tempFilePath }) => tempFilePath);
        tempPath.forEach(async (element) => {
        link = await cloudinary.uploader.upload(element, {
            folder: "Adoptions",
        });
        adoption.imgs.push(link.secure_url);
        await adoption.save();
        });
    } else {
        const { tempFilePath } = array;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
        folder: "Adoptions",
        });
        adoption.imgs.push(secure_url);
        await adoption.save();
    }

    res.status(201).json({
        adoption
    })
}

module.exports={
    obtenerAdoptions,
    crearAdoption
}