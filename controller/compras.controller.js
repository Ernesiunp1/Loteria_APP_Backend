const express = require('express')
const Compra = require('../models/compras.model')
const Boletas = require('../helpers/boletas.helpers')

const  sendMail  = require('../helpers/mail.helper')




const compraPrueba = async (req, res) => {
    return res.json({
        msg: 'Prueba de Compra'
    })
}


const comprar = async (req, res) => {

    console.log("ENTRANDO A COMPRAR EN BACKEND");
    console.log(req.body);
    
    
    const idAnuncio = req.body.producto.id
    const cantidadBoletas = req.body.producto.cantidad
    const body = req.body

    const requisitos = ["nombre", "apellidos", "documento", "telefono", "email"]

    if (!idAnuncio) {
        return res.status(400).json({
            status: "Bad Request",
            msg: "No hay Id en la Request"
        })
    }                    

    const faltanDatos = requisitos.some(prop => !body.usuario.hasOwnProperty(prop));

    if (faltanDatos) {

        return res.status(400).json({
            status: "bad request",
            msg: "Faltan datos en el formulario"
        })

    }

    req.body.usuario.idPublicacion = idAnuncio

    try {

        // se llama al helper que genera las boletas, 
        // se les pasa la cantidad y el id de la publicacion
        const nuevasBoletas = await Boletas( cantidadBoletas , body.idPublicacion)     

        // Se guardan las Boletas en el body para poder guardar en la base de datos
        req.body.usuario.boletas = nuevasBoletas        

        // todo: generar cobro de las boletas antes de guardar en base de datos

        // const compraMP =  await generar()

        console.log('este es el resultado de MP desde compraControlloer');

        // se pasa el formulario con boletas en el objeto body
        const newCompra = Compra(body.usuario)
        const resultado = await newCompra.save()


        // todo: enviar correo electronico con las boletas compradas req.body.boletas

        // boletas, name, email, phone, message,

        const payload = {
            name: newCompra.nombre, 
            email: newCompra.email,
            publicacionId: newCompra.idPublicacion,
            boletas: newCompra.boletas,
            phone: newCompra.telefono,
            total: body.total,
            message: " Muchas Gracias por tu compra, te deseamos mucha suerte. Recuerda que debes confirmar tu pago y en después de hacerlo estaras listo para ganar, de no hacerlo tus boletas seran eliminadas"
        }

        sendMail(payload)
          
        return res.status(200).json({
            newCompra,
            resultado,
            // enviandoMAil
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "Internal Server Error",
            msg: "Error al comprar publicacion",
            error: error.message
        })
        
    }


}


const getBoletasBy = async (req, res) => {

    let boletasCompradas = []
    let numeros = []

    // recogemos el id de la publicacion
    const idPublicacion = req.params.id


    try {

        const boletas = await Compra.find({idPublicacion : idPublicacion}, 'boletas')

        if (boletas.length === 0) {
            return res.status(200).json({
                status: 'success',
                msg:' No hay boletas vendidas',
                total: 0,
                faltan: 9999,
                vendidas: []
            })
        }   

        // extrayendo las compras de boletas por documento
        boletas.forEach(element => {
            boletasCompradas.push(element.boletas)
            
        });

        // extrayendo los numeros en cada compra
        boletasCompradas.forEach(element => {            
           for (let elements of element)
           numeros.push(elements)
        })

        // copiando el array numeros para ordenarlo
        const numerosOrdenados = [...numeros]

        // ordenando numeros
        numerosOrdenados.sort((a, b) => a - b)

   
       const total = numerosOrdenados.length
             boletasFaltantes = 9999- total

        res.json({
            total,
            faltan: boletasFaltantes,
            vendidas:numerosOrdenados,
            
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "Internal Server Error",
            msg: "Error al buscar publicacion",
            error: console.log(error.message)
        })
    }


}


const getWinner = async (req, res) => {

    console.log("entrando a winner");


    const winner = req.body.winner
    const idPublicacion = req.params.id

    
    console.log(winner);
    console.log(idPublicacion);

  


    if (!winner) {
        res.status(200).json({
            status: "success",
            msg: 'Ingrese el numero a consultar'
        })
    }


    try {

        const ganador = await Compra.find({idPublicacion: idPublicacion , boletas: winner})

        if (ganador.length === 0 ) return res.status(200).json({msg: 'NO HAY GANADOR'})

        return res.json({
            msg: 'Winner',           
            ganador,
            
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Internal Server Error',
            error: 'Error al Buscar Ganador',
            error: error.message
        })
    }



   


}


const removeBoletas = async (req, res) => {

    const idPublicacion = req.params.id

    try {

        const boletas = await Compra.deleteMany({idPublicacion: idPublicacion})

        if (boletas.deletedCount === 0) {
            return  res.json({
                status: 'Not Found',
                msg: 'No Hay Boletas para borrar',               
            })

        }

        

        res.json({            
            idPublicacion: idPublicacion,
            boletas
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Internal Server Error',
            msg: 'Error en borrar boletas',
            error: error.message
        })
    }

    



}


const comprarBoletasnew = async ( paymentId ,idAnuncion, cantBoletas, datosUsuario) => {


    console.log('ENTRANDO A GENERAR BOLETAS');
    console.log('idAnunci:', idAnuncion);
    console.log('cant:', cantBoletas);
    console.log('datosUsuarios:', datosUsuario);

    const idAnuncio = idAnuncion
    const cantidadBoletas = cantBoletas
    const body = datosUsuario

    body.paymentID = paymentId
    console.log(paymentId);

    console.log(body);
    const requisitos = ["nombre", "apellidos", "documento", "telefono", "email"]


    if (!idAnuncio) {

        const respuesta = {
            status: "Bad Request",
            msg: "No hay Id en la Request"
        }

       throw new Error( 'NO SE CONSIGUIE EL ID AL INTENTAR CREAR COMPRA' , respuesta)
    }                    

    const faltanDatos = requisitos.some(prop => !body.hasOwnProperty(prop));

    if (faltanDatos) {

        const respuesta = {
            status: "bad request",
            msg: "Faltan datos en el formulario"
        }

       throw new Error( 'FALTAN DATOS DE USUARIO' , respuesta)
       
    }

    body.idPublicacion = idAnuncio

    try {

        const checkPayment = await Compra.find({paymentID: paymentId})

        if (checkPayment.length > 0) {
            console.log('ya estaba creada la publicacion');
            return
        }


        console.log("ENTRANDO EN EL TRY");
        // se llama al helper que genera las boletas, 
        // se les pasa la cantidad y el id de la publicacion
        const nuevasBoletas = await Boletas( cantidadBoletas , body.idPublicacion)     


        // Se guardan las Boletas en el body para poder guardar en la base de datos
        body.boletas = nuevasBoletas
        

        // todo: generar cobro de las boletas antes de guardar en base de datos

        // const compraMP =  await generar()

        console.log('este es el resultado de MP desde compraControlloer');

        // se pasa el formulario con boletas en el objeto body
        const newCompra = Compra(body)
        const resultado = await newCompra.save()


        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
              user:process.env.EMAIL,
              pass:process.env.EMAIL_PASSWORD,
            },
          });

          
        //   let datostransporter = {

        //     from: process.env.EMAIL,
        //     to: `${body.email}`,
        //     text: ` Muchas gracias por tu compra, te deseamos mucha suerte. 
        //      te recordamos que para reclamar tu premio debes tener el número
        //       de factura que te envio mercado pago a tu correo junto con el 
        //       número de la entrada que compraste. 
              
        //       Tus entradas son las siguientes: ${body.titulo} :  ${body.boletas}
              
        //       Número de contacto whatsapp: 312-747-21-60`

              

        //   }


        const  enviandoMAil = await  transporter.sendMail({
            from: ` DS EVENTOS ${process.env.EMAIL}`,
            to: `${body.email}`,
            subject: 'ENTRADAS DE SORTEO (DS EVENTOS)',
            text: `Muchas gracias por tu compra, te deseamos mucha suerte. 
            te recordamos que para reclamar tu premio debes tener el número
             de factura que te envio mercado pago a tu correo junto con el 
             número de la entrada que compraste. 
             
             Tus entradas son las siguientes:  ${body.boletas}
             
             Número de contacto whatsapp: 312-747-21-60`
        })
       
        // console.log( datostransporter, enviandoMAil );

        // todo: enviar correo electronico con las boletas compradas req.body.boletas

        
        return resultado
        



    } catch (error) {
        console.log(error);

        throw new Error("Internal server error", "Error al comprar Boletas", error)

        // return res.status(500).json({
        //     status: "Internal Server Error",
        //     msg: "Error al comprar publicacion",
        //     error: error.message
        // })
        
    }

}




module.exports = {
    compraPrueba,
    comprar,
    getBoletasBy,
    getWinner,
    removeBoletas,
    comprarBoletasnew
}




// const express = require('express')
// const Compra = require('../models/compras.model')
// const Boletas = require('../helpers/boletas.helpers')
// // const { generar } = require('../controller/preferencia.controllers')
// // const { transporter } = require('../helpers/mail.helper')
// const nodemailer = require("nodemailer")



// const compraPrueba = async (req, res) => {
//     return res.json({
//         msg: 'Prueba de Compra'
//     })
// }


// const comprar = async (req, res) => {

//     console.log("ENTRANDO A COMPRAR EN BACKEND");
//     console.log(req.body);
    

    
    
//     const idAnuncio = req.body.producto.id
//     const cantidadBoletas = req.body.producto.cantidad
//     const body = req.body

//     const requisitos = ["nombre", "apellidos", "documento", "telefono", "email"]

//     if (!idAnuncio) {
//         return res.status(400).json({
//             status: "Bad Request",
//             msg: "No hay Id en la Request"
//         })
//     }                    

//     const faltanDatos = requisitos.some(prop => !body.usuario.hasOwnProperty(prop));

//     if (faltanDatos) {

//         return res.status(400).json({
//             status: "bad request",
//             msg: "Faltan datos en el formulario"
//         })

//     }

//     req.body.usuario.idPublicacion = idAnuncio

//     try {

//         // se llama al helper que genera las boletas, 
//         // se les pasa la cantidad y el id de la publicacion
//         const nuevasBoletas = await Boletas( cantidadBoletas , body.idPublicacion)     

//         // Se guardan las Boletas en el body para poder guardar en la base de datos
//         req.body.usuario.boletas = nuevasBoletas        

//         // todo: generar cobro de las boletas antes de guardar en base de datos

//         // const compraMP =  await generar()

//         console.log('este es el resultado de MP desde compraControlloer');

//         // se pasa el formulario con boletas en el objeto body
//         const newCompra = Compra(body.usuario)
//         const resultado = await newCompra.save()


//         // todo: enviar correo electronico con las boletas compradas req.body.boletas

        
     
//         const transporter = nodemailer.createTransport({
//             host: "smtp.office365.com",
//             port: 587,
//             secure: false, // upgrade later with STARTTLS
//             auth: {
//               user:"vivas.ernesto@outlook.com",
//               pass:"Libertad2013,",
//             },
//           });

        

//           const  enviandoMAil = await  transporter.sendMail({
//             from: `vivas.ernesto@outlook.com  DS EVENTOS `,            
//             to: `${body.usuario.email}`,
//             subject: 'ENTRADAS DE SORTEO (DS EVENTOS)',
//             text: `Muchas gracias por tu compra, te deseamos mucha suerte. 
//             te recordamos que para reclamar tu premio debes tener el número
//              de factura que te envio mercado pago a tu correo junto con el 
//              número de la entrada que compraste.              
             
//              Tus entradas son las siguientes: 
                          
//              ${req.body.usuario.boletas}              
             
//              Número de contacto whatsapp: 312-747-21-60`
//         })


          
//         return res.status(200).json({
//             newCompra,
//             resultado,
//             enviandoMAil
//         });



//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             status: "Internal Server Error",
//             msg: "Error al comprar publicacion",
//             error: error.message
//         })
        
//     }


// }


// const getBoletasBy = async (req, res) => {

//     let boletasCompradas = []
//     let numeros = []

//     // recogemos el id de la publicacion
//     const idPublicacion = req.params.id


//     try {

//         const boletas = await Compra.find({idPublicacion : idPublicacion}, 'boletas')

//         if (boletas.length === 0) {
//             return res.status(200).json({
//                 status: 'success',
//                 msg:' No hay boletas vendidas',
//                 total: 0,
//                 faltan: 9999,
//                 vendidas: []
//             })
//         }   

//         // extrayendo las compras de boletas por documento
//         boletas.forEach(element => {
//             boletasCompradas.push(element.boletas)
            
//         });

//         // extrayendo los numeros en cada compra
//         boletasCompradas.forEach(element => {            
//            for (let elements of element)
//            numeros.push(elements)
//         })

//         // copiando el array numeros para ordenarlo
//         const numerosOrdenados = [...numeros]

//         // ordenando numeros
//         numerosOrdenados.sort((a, b) => a - b)

   
//        const total = numerosOrdenados.length
//              boletasFaltantes = 9999- total

//         res.json({
//             total,
//             faltan: boletasFaltantes,
//             vendidas:numerosOrdenados,
            
//         })

        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             status: "Internal Server Error",
//             msg: "Error al buscar publicacion",
//             error: console.log(error.message)
//         })
//     }


// }


// const getWinner = async (req, res) => {

//     console.log("entrando a winner");


//     const winner = req.body.winner
//     const idPublicacion = req.params.id

    
//     console.log(winner);
//     console.log(idPublicacion);

  


//     if (!winner) {
//         res.status(200).json({
//             status: "success",
//             msg: 'Ingrese el numero a consultar'
//         })
//     }


//     try {

//         const ganador = await Compra.find({idPublicacion: idPublicacion , boletas: winner})

//         if (ganador.length === 0 ) return res.status(200).json({msg: 'NO HAY GANADOR'})

//         return res.json({
//             msg: 'Winner',           
//             ganador,
            
//         })
        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             status: 'Internal Server Error',
//             error: 'Error al Buscar Ganador',
//             error: error.message
//         })
//     }



   


// }


// const removeBoletas = async (req, res) => {

//     const idPublicacion = req.params.id

//     try {

//         const boletas = await Compra.deleteMany({idPublicacion: idPublicacion})

//         if (boletas.deletedCount === 0) {
//             return  res.json({
//                 status: 'Not Found',
//                 msg: 'No Hay Boletas para borrar',               
//             })

//         }

        

//         res.json({            
//             idPublicacion: idPublicacion,
//             boletas
//         })

        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             status: 'Internal Server Error',
//             msg: 'Error en borrar boletas',
//             error: error.message
//         })
//     }

    



// }


// const comprarBoletasnew = async ( paymentId ,idAnuncion, cantBoletas, datosUsuario) => {


//     console.log('ENTRANDO A GENERAR BOLETAS');
//     console.log('idAnunci:', idAnuncion);
//     console.log('cant:', cantBoletas);
//     console.log('datosUsuarios:', datosUsuario);

//     const idAnuncio = idAnuncion
//     const cantidadBoletas = cantBoletas
//     const body = datosUsuario

//     body.paymentID = paymentId
//     console.log(paymentId);

//     console.log(body);
//     const requisitos = ["nombre", "apellidos", "documento", "telefono", "email"]


//     if (!idAnuncio) {

//         const respuesta = {
//             status: "Bad Request",
//             msg: "No hay Id en la Request"
//         }

//        throw new Error( 'NO SE CONSIGUIE EL ID AL INTENTAR CREAR COMPRA' , respuesta)
//     }                    

//     const faltanDatos = requisitos.some(prop => !body.hasOwnProperty(prop));

//     if (faltanDatos) {

//         const respuesta = {
//             status: "bad request",
//             msg: "Faltan datos en el formulario"
//         }

//        throw new Error( 'FALTAN DATOS DE USUARIO' , respuesta)
       
//     }

//     body.idPublicacion = idAnuncio

//     try {

//         const checkPayment = await Compra.find({paymentID: paymentId})

//         if (checkPayment.length > 0) {
//             console.log('ya estaba creada la publicacion');
//             return
//         }


//         console.log("ENTRANDO EN EL TRY");
//         // se llama al helper que genera las boletas, 
//         // se les pasa la cantidad y el id de la publicacion
//         const nuevasBoletas = await Boletas( cantidadBoletas , body.idPublicacion)     


//         // Se guardan las Boletas en el body para poder guardar en la base de datos
//         body.boletas = nuevasBoletas
        

//         // todo: generar cobro de las boletas antes de guardar en base de datos

//         // const compraMP =  await generar()

//         console.log('este es el resultado de MP desde compraControlloer');

//         // se pasa el formulario con boletas en el objeto body
//         const newCompra = Compra(body)
//         const resultado = await newCompra.save()


//         const transporter = nodemailer.createTransport({
//             host: "smtp.office365.com",
//             port: 587,
//             secure: false, // upgrade later with STARTTLS
//             auth: {
//               user:process.env.EMAIL,
//               pass:process.env.EMAIL_PASSWORD,
//             },
//           });

          
//         //   let datostransporter = {

//         //     from: process.env.EMAIL,
//         //     to: `${body.email}`,
//         //     text: ` Muchas gracias por tu compra, te deseamos mucha suerte. 
//         //      te recordamos que para reclamar tu premio debes tener el número
//         //       de factura que te envio mercado pago a tu correo junto con el 
//         //       número de la entrada que compraste. 
              
//         //       Tus entradas son las siguientes: ${body.titulo} :  ${body.boletas}
              
//         //       Número de contacto whatsapp: 312-747-21-60`

              

//         //   }


//         const  enviandoMAil = await  transporter.sendMail({
//             from: ` DS EVENTOS ${process.env.EMAIL}`,
//             to: `${body.email}`,
//             subject: 'ENTRADAS DE SORTEO (DS EVENTOS)',
//             text: `Muchas gracias por tu compra, te deseamos mucha suerte. 
//             te recordamos que para reclamar tu premio debes tener el número
//              de factura que te envio mercado pago a tu correo junto con el 
//              número de la entrada que compraste. 
             
//              Tus entradas son las siguientes:  ${body.boletas}
             
//              Número de contacto whatsapp: 312-747-21-60`
//         })
       
//         // console.log( datostransporter, enviandoMAil );

//         // todo: enviar correo electronico con las boletas compradas req.body.boletas

        
//         return resultado
        



//     } catch (error) {
//         console.log(error);

//         throw new Error("Internal server error", "Error al comprar Boletas", error)

//         // return res.status(500).json({
//         //     status: "Internal Server Error",
//         //     msg: "Error al comprar publicacion",
//         //     error: error.message
//         // })
        
//     }

// }




// module.exports = {
//     compraPrueba,
//     comprar,
//     getBoletasBy,
//     getWinner,
//     removeBoletas,
//     comprarBoletasnew
// }