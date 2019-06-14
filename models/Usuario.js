const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = mongoose.Schema({
    usuario: {
        type: String,
        require: true
    },
    nome: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    adm :{

        type: Number,
        default:0

    },

    senha: {
        type: Number,
        require: true
    },

    nascimento: {
        type: Number,
        require: true
    }

    
})

mongoose.model("usuarios", Usuario)