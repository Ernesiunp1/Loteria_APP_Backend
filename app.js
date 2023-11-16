require('dotenv').config
const express = require("express")
const conection = require("./database/conexion")
const cors = require("cors")
const fileUpload = require('express-fileupload')


const PORT = process.env.PORT || 3000

const app = express()

conection()

app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())



// carga de archivos

// Note that this option available for versions 1.0.0 and newer. 
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// ruta de prueba 

app.get('/prueba', (req , res ) => {

    return res.json({
        status: "ok",
        msg: 'Acción de la ruta de prueba'
    })

})


// ruta Util
const PubliRoutes = require("./routes/publicacion.routes")
const ComprasRoutes = require('./routes/compras.routes')
const UploadsRoutes = require('./routes/uploads.routes')
const RouterPref = require("./routes/preferencia.routes");
const RouterBacksUrls = require("./routes/backsurls.routes");
const RouterNotification = require("./routes/notificationUrl.routes");
const AuthRoutes = require('./routes/auth.routes')



app.use("/api", PubliRoutes)
app.use("/api", ComprasRoutes)
app.use('/api/uploads', UploadsRoutes)
app.use('/api/', AuthRoutes)



app.use("/api", RouterPref);
app.use("/api", RouterBacksUrls);
app.use("/api", RouterNotification);



app.listen( PORT, ( )=>{
    console.log(`ESCUCHANDO A EXPRESS EN EL PUERTO: ${PORT}`)
})