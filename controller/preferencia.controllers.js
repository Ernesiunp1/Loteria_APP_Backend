require("dotenv").config()
const {request, response} = require("express")
const mercadopago = require("mercadopago")


const TOKEN = process.env.ACCESS_TOKEN
const NGROK_TOKEN = process.env.NGROK_TOKEN

const producto = {
    id: "132465798",
    title: "apto Ernesto",
    cantidad: 1,  
    precio: 10,
  
  }

mercadopago.configure({
    access_token: TOKEN
});


const generar = async (req = request, res = response) => {

  console.log("entrando a generar en backend");


    // const params = req.params.data 
    // const { producto, usuario } = req.body
    const body  = await req.body
    const usuario = await req.body.usuario
    const producto = await req.body.producto


    console.log('esta es el usuarui en',usuario);
    // console.log('producto', producto);
    // const user_info = {
    const  nombre = usuario.nombre
    const  apellido = usuario.apellidos
    const  documento = usuario.documento
    const  email = usuario.email
    const  telefono = usuario.telefono
    const  productoId = producto.id
    const cantidad = producto.cantidad
    
    // }
    console.log("despues del objeto");

    // const user_info = "ernesto"

    // const serializedData = user_info

    // console.log(body.producto);
    // console.log("product desde el backend", producto, usuario);

    //  res.json({
    //   msg: "desde el backend",
    //   id: body.producto.id,
    //   titulo: body.titulo,
    //   cantidad: body.cantidad,
    //   precio: body.producto.precio,
    //   usuario: body.usuario,
    // })

    // return
    console.log(" antes del items");
    var preference = {
        items: [
            {            
                id: body.producto.id,
                title: body.titulo,
                quantity: body.cantidad,
                currency_id: "COP",
                unit_price: body.producto.precio,
              } 
        ],
        back_urls: {
            success: 'http://localhost:3000/api/success/',
            failure: 'http://localhost:3000/api/failure/'
        },

        // notification_url : `https://65569c8149504018b92bfc8e--starlit-cupcake-12ccb8.netlify.app/api/noti/${nombre}/${apellido}/${documento}/${email}/${telefono}/${productoId}/${cantidad}`,
        notification_url : `${NGROK_TOKEN}/api/noti/${nombre}/${apellido}/${documento}/${email}/${telefono}/${productoId}/${cantidad}`,


        // user_info: user_info
        // dataUsuario: req.usuario ,
        // idPublicacion: body.producto.id

    }

    console.log("despues de item");


    mercadopago.preferences
      .create(preference)
      .then((respuesta) => {
        console.log(respuesta.body.init_point);
        return res.json({status: 'success', url: respuesta.body.init_point})
        // res.send(`<a href ="${respuesta.body.init_point}">PAGAR</a>`);
      })
      .catch((error) => {
        
        console.log(error.message);
      });
   
}




module.exports = {
    generar
}