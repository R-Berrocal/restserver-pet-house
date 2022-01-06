const {ObjectId}=require("mongoose").Types;
const {Usuario}=require("../models")
const coleccionesPermitidas = [
    "user",
    "publication",
    "role"
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
            
        
        break;

        default:res.status(500).json({
            msg:"se me olvido hacer esta busqueda"
        })
    }
}

module.exports={
    buscar
}