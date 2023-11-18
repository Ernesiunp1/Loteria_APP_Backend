const {model, Schema} = require('mongoose')



const publicacionSchema = Schema({

  titulo: {
    type: String,
    required: true,
   
  },

  subTitulo: {
    type: String,
    required: true
  },

  texto: {
    type: String,
    required: true
  },

  precio: {
    type: Number,
    required: true
  },

  minimoCant: {
    type: Number,
    default: 6
  },

  img: {
    type: [
      {
        type: String,
        required: true,
        default: "no-image.png"
      }
    ]
  },

  password: {
    type: String,
    required: true
  },

  created_at:{
    type: Date,
    default: Date.now()
  },


})


module.exports = model("Publicacion", publicacionSchema, "publicaciones")