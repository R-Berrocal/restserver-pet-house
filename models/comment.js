const {Schema, model}=require("mongoose");


const comentarioSchema=Schema({
    description:{
        type:String,
        required: [true, "la descripcion  es obligatoria"]
    },
    condition:{
        type: Boolean,
        default:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"Usuario",
        required: true
    },
    publication_id:{
        type: Schema.Types.ObjectId,
        ref:"AS",
        required: true
    },
    created_In:{
        type: Date,
        default: Date.now
    },
    updated_In:{
        type:Date,
        default: Date.now
    },
    
    
});


comentarioSchema.methods.toJSON=function(){
    const {__v,condition, ...data}= this.toObject();
    return data;
}


module.exports = model("Comentario",comentarioSchema);