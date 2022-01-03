const {Schema, model}=require("mongoose");

const publicationSchema= Schema({
    description:{
        type:String,
        required: [true,"La descripcion no puede estar vacia"]
    },
    condition:{
        type: Boolean,
        default:true,
        required:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    }
    
});

publicationSchema.methods.toJSON=function(){
    const {__v, ...data}=this.toObject();
    return data
}


module.exports = model("AS",publicationSchema);