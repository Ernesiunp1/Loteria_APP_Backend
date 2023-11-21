require("dotenv").config();
const { request, response } = require("express");
const mercadopago = require("mercadopago");
const { comprar, comprarBoletasnew} = require("../controller/compras.controller");
const { lock } = require("../routes/preferencia.routes");


var paymentID


const notificacion = async (req = request, res = response) => {
   console.log('entrando a notificacion');
  const body = req.body  
  // const { query } = req;
  const params = req.params
  
  // console.log('BODY: ', body);

  const payment = req.query

  
  console.log("esta es la req.query", payment);
  // console.log('esta el la payment.type', payment.type);
  
  // const topic = req.body.topic || req.body.type;
  

  const idAnuncio =  params.productoId
  const cantidadBoletas = params.cantidad

  const datosUsuarios = {
    nombre: params.nombre,
    apellidos: params.apellido,
    documento: params.documento,
    email: params.email,
    telefono: params.telefono,
  }
    try {
      
      if (payment.type === "payment") {

        console.log('entrando al if');
        

        const data = await mercadopago.payment.findById(payment['data.id'])

        // console.log('esta es la data del pago'  ,data);
        if (data.body.status === 'approved') {

          paymentID = payment['data.id']

          const comprandoBoletas =  await  comprarBoletasnew(paymentID ,idAnuncio, cantidadBoletas, datosUsuarios)
          
          console.log('este es el resultado de comprarBoletas', comprandoBoletas);

          console.log();
          res.send()

          return res.status(200).json({
            status: 'success',
            message: "Notificación recibida correctamente.",
            payment,
            comprandoBoletas
          });

        }   
        
        // console.log('ESTE ES EL DATA.BODY.STATUS',data.body.status);
        // console.log('ESTE ES EL DATA.BODY.STATUS',payment['data.id']);
        // console.log('ESTE ES EL DATA.BODY.STATUS',data.body.payer.id);
      }else {
        console.log("El pago no se hizo correctamente");      
        
      }



    } catch (error) {
      console.log(error);
      throw new Error("ERROR EN NOTIFICATIO URL", error)

    }


  
};

module.exports = { notificacion };
