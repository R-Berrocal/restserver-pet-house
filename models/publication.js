const {Schema, model}=require("mongoose");

const publicationSchema= Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    title:{
        type:String
    },
    description:{
        type:String,
        required: [true,"La descripcion no puede estar vacia"]
    },
    condition:{
        type: Boolean,
        default:true,
        required:true
    },
    animal_type:{
        type: String    
    },
    imgs:{
        type:Array,
        default:[],
        required: [true,"debe tener al menos una imagen"]
    },
    publication_type:{
        type:String,
        default: "AS"
    },
    localization:{
        coordinates:{
            type: Array,
            default: [],
            required:[true,"las coordenadas deben venir"]
        }
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

publicationSchema.methods.toJSON=function(){
    const {__v, ...data}=this.toObject();
    return data
}


module.exports = model("AS",publicationSchema);