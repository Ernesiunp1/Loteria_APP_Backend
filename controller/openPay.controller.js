const express = require('express');
var Openpay = require('openpay');

// const isProduction = false

// const id = "mebctgxefhtloddxgsdt"
// const llavePrivada = "sk_1a7c5302062f4f739b25cee53cae5040"
// const llavePublica = "pk_4a5de2dfdfe24af2901213e20fc13a77"

// var openpay = new Openpay('mebctgxefhtloddxgsdt', 'sk_1a7c5302062f4f739b25cee53cae5040', 'co', false);
// openpay.setTimeout(30000);


const open = async (req, res) => {   

    const id = "mebctgxefhtloddxgsdt"
    const llavePrivada = "sk_1a7c5302062f4f739b25cee53cae5040"
    
    try {        

        var chargeRequest = {
            "method" : "card",
            "amount" : 100,
            "description" : "Cargo inicial a mi cuenta",
            "order_id" : "oid-00051",
            "customer" : {
                 "name" : "Juan",
                 "last_name" : "Vazquez Juarez",
                 "phone_number" : "4423456723",
                 "email" : "juan.vazquez@empresa.com.mx"
            },
           "send_email" : false,
           "confirm" : false,
           "redirect_url" : "http://www.openpay.mx/index.html"
         }

        var openpay =  new Openpay(id , llavePrivada)
        

        openpay.charges.create(chargeRequest, function(error, charge) {

                 if (error) {
                console.error(error);
                return res.status(500).json({
                    status: 500,
                    message: 'Error creating charge',
                    error
                });
            } else {
                return res.json({
                    status: 200,
                    message: 'Charge created successfully',
                    charge: charge
                });
            }

            
          });

          return res.json({
            openpay
        });
       
          
    
    } catch (error) {
        console.log("este es el error",error);
        return res.status(500).json({
            status: "Internal server error",
            msg: "Error en open",
            error: error.description
        })
        
    }

  
  
}



const crearToken = async (req, res) => {

    Openpay.token.create({
        "card_number":"4111111111111111",
        "holder_name":"Juan Perez Ramirez",
        "expiration_year":"20",
        "expiration_month":"12",
        "cvv2":"110",
        "address":{
           "city":"Bogotá",
           "line3":"Bogotá",
           "postal_code":"76900",
           "line1":"Carrera Bulnes No. 1027",
           "line2":"Roble 207",
           "state":"Bogotá",
           "country_code":"CO"
        }
  }, onSuccess, onError);








}


module.exports = open


 // var chargeRequest = {
        //     'method' : 'card',
        //     'amount' : 100,
        //     'description' : 'Cargo inicial a mi cuenta',
        //     'order_id' : 'oid-00051',
        //     'customer' : {
        //          'name' : 'Juan',
        //          'last_name' : 'Vazquez Juarez',
        //          'phone_number' : '4423456723',
        //          'email' : 'juan.vazquez@empresa.com.mx'
        //     },
        //    'send_email' : false,
        //    'confirm' : false,
        //    'redirect_url' : 'http://www.openpay.mx/index.html'
        //  }

        //  openpay.charges.create(chargeRequest, function(error, charge) {

        //     if (error) {
        //         console.error(error);
        //         res.status(500).json({
        //             status: 500,
        //             message: 'Error creating charge'
        //         });
        //     } else {
        //         res.json({
        //             status: 200,
        //             message: 'Charge created successfully',
        //             charge: charge
        //         });
        //     }
            
        //   });