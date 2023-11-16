const mongoose = require('mongoose');


const conexion = async ()=>{

    mongoose.set('strictPopulate', false);

    let url_conection = "mongodb+srv://sorteoUser:libertad2013@sorteo.v7dqq5d.mongodb.net/sorteo"

    try {
        await mongoose.connect(url_conection);
        console.log("Conectdo a la BBDD");
        
    } catch (error) {
        console.log(error);
        console.log("Error al conectar a la BBDD");
        
    }


}


module.exports= conexion