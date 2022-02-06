

const {Schema, model}=require("mongoose");


const usuariosSchema=Schema({
    name:{
        type:String,
        required: [true, "el nombre es obligatorio"]
    },
    email:{
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "la contraseña es obligatoria"]
    },
    img:{
        type: String
    },
    rol:{
        type:String,
        required: true,
        enum: ["ADMIN_ROLE","USER_ROLE"],
    },
    condition:{
        type: Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default: false
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


usuariosSchema.methods.toJSON=function(){
    const {__v,password,_id, ...usuario}= this.toObject();
    
    usuario.uid=_id;
    return usuario;
}


module.exports = model("Usuario",usuariosSchema);
