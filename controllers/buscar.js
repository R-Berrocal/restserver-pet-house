const {ObjectId}=require("mongoose").Types;
const {Usuario, Publication,Comment}=require("../models");
const coleccionesPermitidas = [
    "user",
    "publication",
    "comment"
]


const buscarUsuarios= async (ended="",res)=>{
    const esMongId=ObjectId.isValid(ended);
    if(esMongId){
        const user=await Usuario.findById(ended);
        return res.json({
            results:(user)?[user]:[],
        });
    }
    const regex=new RegExp(ended,"i");
    const users= await Usuario.find({
        $or: [{name:regex},{correo:regex}],
        $and: [{condition:true}]
    })

    res.json({
        results:users
    });
}

const buscarPublication= async (ended="",res)=>{
    const esMongId=ObjectId.isValid(ended);
    if(esMongId){
        const publication=await Publication.findById(ended);
        return res.json({
            results:(publication)?[publication]:[],
        });
    }
    const regex=new RegExp(ended,"i");
    const publication= await Publication.find({
        $or: [{title:regex},{description:regex}],
        $and: [{condition:true}]
    })

    res.json({
        results:publication
    });
}

const buscarComment= async (ended="",res)=>{
    const esMongId=ObjectId.isValid(ended);
    if(esMongId){
        const comment =await Comment.findById(ended);
        return res.json({
            results:(comment)?[comment]:[],
        });
    }
    const regex=new RegExp(ended,"i");
    const comment= await Comment.find({
        $or: [{description:regex}],
        $and: [{condition:true}]
    })

    res.json({
        results:comment
    });
}

const buscar=(req,res)=>{
    const {collection,ended}=req.params
    if(!coleccionesPermitidas.includes(collection)){
        return res.status(400).json({
            msg:`las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    
    switch(collection){
        case "user":
            buscarUsuarios(ended,res);
        
        break;

        case "publication":
            buscarPublication(ended,res);
        break;
        
        case "comment":
            buscarComment(ended,res);
        break;

        default:res.status(500).json({
            msg:"se me olvido hacer esta busqueda"
        })
    }
}

module.exports={
    buscar
}