const {Comment} = require("../models");


// obtener comentarios - paginado - total - populate

const obtenerComments=async(req,res)=>{
    const {limite=10, desde=0}= req.query;
    const query = {condition:true};

    const [total,comments]= await Promise.all([
        Comment.countDocuments(query),
        Comment.find(query)
        .populate("user","name")
        .populate("publication","title")
        .sort({"created_In":-1})
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        comments
    })
}

const obtenerCommentsUser=async(req,res)=>{

    const {limite=10, desde=0}= req.query;
    const {id}=req.params;
    const query = {id,condition:true};

    const [total,comments]= await Promise.all([
        Comment.countDocuments(query),
        Comment.find(query)
        .populate("publication","title")
        .sort({"created_In":-1})
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        comments
    })
}

const obtenerCommentsPublication=async(req,res)=>{

    const {limite=10, desde=0}= req.query;
    const {id}=req.params;
    const query = {id,condition:true};

    const [total,comments]= await Promise.all([
        Comment.countDocuments(query),
        Comment.find(query)
        .populate("user","name")
        .sort({"created_In":-1})
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        comments
    })
}


const obtenerComment=async(req,res)=>{
    const {id}=req.params;
    const comment= await Comment.findById(id)
                                .populate("user","name")
                                .populate("publication","name");
    res.json({
        comment
    })
}

const crearComment=async(req,res)=>{
    const {condition,user, ...resto} = req.body;

    const data ={
        ...resto,
        user:req.user._id
    }
    
    const comment = new Comment(data);

    //guardar en dv
    await comment.save();

    res.status(201).json({
        comment
    })
}

const actualizarComment = async(req, res )=>{
    const {id}=req.params;
    const {condition, user, ...data}=req.body;

    data.user=req.user_id;
    data.updated_In=new Date();
    const comment = await Comment.findByIdAndUpdate(id,data,{new:true});
    res.json({
        comment
    });
}

const borrarComment=async(req,res)=>{
    const {id}=req.params;
    const commentDelete= await Comment.findByIdAndUpdate(id,{condition:false},{new: true});
    res.json({
        commentDelete
    })
}

module.exports={
    obtenerComments,
    obtenerCommentsUser,
    obtenerCommentsPublication,
    obtenerComment,
    crearComment,
    actualizarComment,
    borrarComment,
}