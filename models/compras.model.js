const {model, Schema} = require('mongoose')




const ComprasSchema = Schema({

    idPublicacion: {
        type: Schema.Types.ObjectId,
        ref:'Publicacion'
    },

    nombre: {
        type: String,
        required: true
    },

    apellidos: {
        type: String,
        required: true
    },

    documento: {
        type: Number,
        required: true
    },

    // pais: {
    //     type: String,
    //     default: 'Colombia'
    // },

    // direccion: {
    //     type:String,
    //     required: true
    // },

    // apto: {
    //     type: String,
    //     required: true
    // },

    // ciudad: {
    //     type: String,
    //     required: true
    // },

    // departamento: {
    //     type: String,
    //     required: true
    // },

    // zip: {
    //     type: Number
    // },

    paymentID: {
        type: Number,
        default: 1234
    },
    telefono: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true  
    },

    descripcion: {
        type: String,

    },

    boletas: {
        type: [
          {
            type: Number
          }
        ]
      },


    created_at: {
        type: Date,
        default: Date.now()
    }


})


module.exports = model('Compra', ComprasSchema, 'compras')