const path =require("path");
const fs = require("fs");
const cloudinary=require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require("../helpers/subir-archivo");
const {Usuario,Publication}=require("../models")

const cargarArchivo=async(req,res)=>{

    try {
        const name=await subirArchivo(req.files);
        res.json({
            name
        })
    } catch (error) {
        
    }
}

const actualizarImagen = async(req,res)=>{
    const {coleccion,id}=req.params
    switch (coleccion) {
        case "users":
         const  user= await Usuario.findById(id);
            if(!user){
                return res.status(400).json({
                    msg: `no existe usuario con el id: ${id}`
                })
            }
            //limpiar imagenes previas
            if(user.img){
            //hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname,"../uploads",coleccion,user.img);    
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen)
            }
            }
            const img_User = await subirArchivo(req.files,undefined, coleccion);
            user.img=img_User;
            await user.save();

            res.json(user);
        break;

        case "publications":
           const publication= await Publication.findById(id);
            if(!publication){
                return res.status(400).json({
                    msg: `no existe publicacion con el id: ${id}`
                })
            }
            const imgs_Publications = await subirArchivo(req.files,undefined, coleccion);
            publication.imgs.push(imgs_Publications);
            
            //para actualizar una imagen en una posicion dada
            // const imgActualizada =publication.imgs.splice(1,1,imgs_Publications);
            // const pathImagen = path.join(__dirname,"../uploads",coleccion,imgActualizada[0]);    
            // if(fs.existsSync(pathImagen)){
            //     fs.unlinkSync(pathImagen)
            // }
            //para eliminar una posicion
            // const imgELiminada=publication.imgs.splice(1,1);
            // const pathImagen = path.join(__dirname,"../uploads",coleccion,imgELiminada[0]);    
            // if(fs.existsSync(pathImagen)){
            //     fs.unlinkSync(pathImagen)
            // }
            
            await publication.save();

            res.json(publication);
        break;
    
        default:
            return res.status(500).json({
                msg: "se me olvido validar esto"
            })
    }
    
}
const mostrarImagen=async(req,res=response)=>{

    const {coleccion,id}=req.params
    switch (coleccion) {
        case "users":
         const  user= await Usuario.findById(id);
            if(!user){
                return res.status(400).json({
                    msg: `no existe usuario con el id: ${id}`
                })
            }
            const img= user.img;
            if(img){
                return res.json({
                    img
                })   
            }
        res.status(404).json({msg:"No se encontraron imagenes"})
        break;

        case "publications":
           const publication= await Publication.findById(id);
            if(!publication){
                return res.status(400).json({
                    msg: `no existe publicacion con el id: ${id}`
                })
            }
            const imgs=publication.imgs;
            if(imgs.length>0){     
                return res.json({
                    imgs
                })    
            }

            res.status(404).json({msg:"No se encontraron imagenes"})
        break;
    
        default:
            return res.status(500).json({
                msg: "se me olvido validar esto"
            })
    }
}

const actualizarImagenCloudinary = async(req,res)=>{
    const {coleccion,id}=req.params
    switch (coleccion) {
        case "users":
         const  user= await Usuario.findById(id);
            if(!user){
                return res.status(400).json({
                    msg: `no existe usuario con el id: ${id}`
                })
            }
            //limpiar imagenes previas
            if(user.img){
                const  nombreArr= user.img.split("/");
                const nombre = nombreArr[nombreArr.length-1];
                const [public_id]= nombre.split(".")
                cloudinary.uploader.destroy("Users/"+public_id);
            }
            const {tempFilePath}=req.files.archivo;
            const {secure_url}= await cloudinary.uploader.upload(tempFilePath,{
                folder:"Users"
            })
            
            user.img=secure_url;
            await user.save();

            res.json(user);
        break;

        case "publications":
           const publication= await Publication.findById(id);
            if(!publication){
                return res.status(400).json({
                    msg: `no existe publicacion con el id: ${id}`
                })
            }
            const array=req.files.archivo;
            if(Array.isArray(array)){
                const tempPath=array.map(({tempFilePath})=>tempFilePath);
                tempPath.forEach(async (element) => {
                    link= await cloudinary.uploader.upload(element,{
                        folder:"Publications"
                    })
                    publication.imgs.push(link.secure_url);
                    await publication.save();
                });

            }else{
                const {tempFilePath}=array;
                const {secure_url}= await cloudinary.uploader.upload(tempFilePath,{
                    folder:"Publications"
                })
                publication.imgs.push(secure_url);
                await publication.save();
            }


            await res.json(publication);
        break;
    
        default:
            return res.status(500).json({
                msg: "se me olvido validar esto"
            })
    }
    
}
const eliminarImgCloudinay=async(req,res)=>{
    const {coleccion,id}=req.params;
    const {index}=req.body
    switch (coleccion) {
        case "users":
         const  user= await Usuario.findById(id);
            if(!user){
                return res.status(400).json({
                    msg: `no existe usuario con el id: ${id}`
                })
            }
            //limpiar imagenes previas
            if(user.img){
                const  nombreArr= user.img.split("/");
                const nombre = nombreArr[nombreArr.length-1];
                const [public_id]= nombre.split(".")
                cloudinary.uploader.destroy("Users/"+public_id);
            }
            user.img="";
            await user.save();

            res.json(user);
        break;

        case "publications":
           const publication= await Publication.findById(id);
            if(!publication){
                return res.status(400).json({
                    msg: `no existe publicacion con el id: ${id}`
                })
            }
            //para eliminar una posicion
            if(!index){
                return res.status(400).json({
                    msg: "Debe mandar el indice"
                })
            }
            if(!publication.imgs[index]){
                return res.status(400).json({
                    msg: "no existe imagen con este indice"
                })
            }
            const imgELiminada=publication.imgs.splice(index,1);
            const nombreArr= imgELiminada[0].split("/");
            const nombre = nombreArr[nombreArr.length-1];
            const [public_id]= nombre.split(".")
            cloudinary.uploader.destroy("Publications/"+public_id);   
            await publication.save();
            res.json(publication);
        break;
    
        default:
            return res.status(500).json({
                msg: "se me olvido validar esto"
            })
    }
}
const actualizarImgPublication=async(req, res)=>{
    const {id,index}=req.params;
    const publication= await Publication.findById(id);
            if(!publication){
                return res.status(400).json({
                    msg: `no existe publicacion con el id: ${id}`
                })
            }
            //para eliminar una posicion
            if(!index){
                return res.status(400).json({
                    msg: "Debe mandar el indice"
                })
            }
            if(!publication.imgs[index]){
                return res.status(400).json({
                    msg: "no existe imagen con este indice"
                })
            }
            const {tempFilePath}=req.files.archivo;
            const {secure_url}= await cloudinary.uploader.upload(tempFilePath,{
                folder:"Publications"
            })

            const imgActualizada=publication.imgs.splice(index,1,secure_url);
            const nombreArr= imgActualizada[0].split("/");
            const nombre = nombreArr[nombreArr.length-1];
            const [public_id]= nombre.split(".")
            cloudinary.uploader.destroy("Publications/"+public_id);   
            await publication.save();
            res.json(publication);
}
module.exports={
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    actualizarImgPublication,
    eliminarImgCloudinay,
    mostrarImagen
}