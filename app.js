require('dotenv').config
const express = require("express")
const conection = require("./database/conexion")
const cors = require("cors")
const fileUpload = require('express-fileupload')
const mercadopago = require('mercadopago') 




var merchantOrder1


const PORT = process.env.PORT || 3000

const app = express()

app.options('*', cors()); // Habilita CORS para todas las solicitudes OPTIONS

// app.use(cors())



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
  });

conection()


app.use(express.urlencoded({extended: true}))
app.use(express.json())



// carga de archivos

// Note that this option available for versions 1.0.0 and newer. 
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// ruta de prueba 

app.use('/api/generar', (req , res ) => {

    const {request, params, body} = req

    console.log( body);
    console.log( params );
    console.log( request);

return

    let preference = {
        items: [
            {
                id: 123456778,
                title: "mi producto",
                unit_price: 3000,
                quantity: 1,
                currency_id: 'COP'
            },
        ],

        back_urls: 
        {
            // "failure": "",
            // "pending": "",
            success: "http://localhost:3000/success"
        },

        notification_url: "https://50a0-2800-e2-1f80-25be-8030-3faa-cd0e-fcb.ngrok-free.app/notificar"
    }

    mercadopago.preferences
    .create(preference)
    .then( function (response) {
        // aqui la respuesta
        console.log(response.body.init_point);


        return res.send(
            `<a href= ${response.body.init_point} >Pagar</a>`
        )
            
        

    })

    .catch( function (err) {
        console.log(err);
    })


    // return res.json({
    //     response
       
    // })

})



app.use('/success', (req, res) =>{

    res.send('todo ha ido bien')


})

app.post('/notificar', async (req, res) =>{
    // console.log('notificar');


    try {

    const { query } = req;
    const body =  req.body;
    
    const { params } = req;
    // console.log({ query });
    const topic = req.body.topic || req.body.type;
    // console.log({ params });
   

    console.log(" este es el topic ", topic );
    console.log( "este es el query", query );


    // if (topic === 'merchant_order') {

    //   const data = await mercadopago.merchant_orders.findById(query.id)
    //   console.log("esta es la data de merchant", data);
    // }

    if (topic === 'payment') {

      data = await mercadopago.payment.findById(query['data.id'])

      const idPayment = query['data.id']
      console.log("status", data.status, "id:", idPayment);
      console.log("detalle", data.status_detail);


      if (data.body.status == 'approved' && data.body.status_detail == 'accredited') {
        
        console.log("el pago se ha realizado");
        console.log("status", data.body.status);
        console.log("detalles", data.body.status_detail);


      }else {
        console.log("el pago no se hizo");
        console.log({status: data.body.status, detalles: data.body.status_detail});
      }


      // console.log("esta es la data de payment", data.body);
      
    }

    res.send()

  
        
    } catch (error) {

        console.error("Error en la ruta /notificar:", error);
        res.status(500).send("Error interno del servidor");
        
    }
    


})


mercadopago.configure({
    // access_token: "TEST-2487199746571596-071015-8c487db0f88b64b98280425b2b5c4cb4-1417896816"
    // access_token: "TEST-3203328979306807-112011-88f3c142ac0a3db60259281d0affe6a4-495972662"
    // access_token: "APP_USR-3203328979306807-112011-f189ba74bb9a946746f68740d92ddfdb-495972662"
    access_token: "APP_USR-5882533135666350-112100-f7ec242c7445ece7fa406373cd880abc-1557707795"
})


// ruta Util
const PubliRoutes = require("./routes/publicacion.routes")
const ComprasRoutes = require('./routes/compras.routes')
const UploadsRoutes = require('./routes/uploads.routes')
const AuthRoutes = require('./routes/auth.routes')
const OpenRoutes = require('./routes/openPay.routes')
// const mercadopago = require('mercadopago')




app.use("/api", PubliRoutes)
app.use("/api", ComprasRoutes)
app.use('/api/uploads', UploadsRoutes)
app.use('/api/', AuthRoutes)
app.use('/api/', OpenRoutes)




app.listen( PORT, ( )=>{
    console.log(`ESCUCHANDO A EXPRESS EN EL PUERTO: ${PORT}`)
})