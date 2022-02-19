const {Schema, model}=require("mongoose");

const adoptionSchema= Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    publication_id:{
        type: Schema.Types.ObjectId,
        ref:"AS",
        required: true
    },
    name:{
        type:String,
        required:[true,"debe ingresar el nombre de la mascota"]
    },
    condition:{
        type: Boolean,
        default:true,
        required:true
    },
    imgs:{
        type:Array,
        default:[],
        required: [true,"debe tener al menos una imagen"]
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

adoptionSchema.methods.toJSON=function(){
    const {__v, ...data}=this.toObject();
    return data
}


module.exports = model("Adoption",adoptionSchema);