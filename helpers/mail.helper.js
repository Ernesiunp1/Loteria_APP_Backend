const express = require('express');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');

  


const sendMail = (payload) =>{

    console.log("Entrando al helpper");

      const { boletas, name, email, phone, message, total} =  payload


    function createTable(boletas) {

        if (!boletas || boletas.length === 0) {
            return '';  // No hay boletas, retorna una cadena vacía
        }
    
        // Encabezado de la tabla
        let tableHtml = '<h1>Boletas</h1><table border="1"><tr><th>Boleta</th></tr>';
    
        // Filas de la tabla con cada boleta
        boletas.forEach((boleta, index) => {
            tableHtml += `<tr><td>${index + 1}</td><td>${boleta}</td></tr>`;
        });
    
        // Cierre de la tabla
        tableHtml += '</table>';
        return tableHtml;
    }



    const Html = `
    <h1> Tus Boletas han sido reservadas exitosamente</h1>
    <h1> Debes pagar Inmediatamente y confirmar el pago</h1>
    <ul>
        <li> name: ${name}       </li>
        <li> email: ${email}     </li>
        <li> celular: ${phone}   </li>
        
        
    </ul>

    <h1> Medios de pago</h1>

    <ul>
        <li> PSE: duvan172126@hotmail.com  </li>
        <li> NEQUI: 3127472160    </li>        
    
    </ul>

    <h1>Contacto Whatsapp</h1>

        <li> 312-747-2160 </li>

        <p> mensaje: ${message} <p>


        ${createTable(boletas)}
        
    `

    // const CLIENT_ID ="719889471463-aqjtjd784ovnrrst73oe1oo95har6f21.apps.googleusercontent.com"
    // const CLIENT_SERCRET="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"
    // const REDIRECT_URL ="https://developers.google.com/oauthplayground"   
    // const REFRESH_TOKEN="1//04qg61yp1rpvbCgYIARAAGAQSNwF-L9Iro3QQx_aIzf57QuVJTn_PZFWGLDDq7Cht0RCj-i4LPfNSXvmVpI2PjBbS9DHdg44smDM"
   
    const CLIENT_ID ="533437542492-cec47jqpe9fieeb4qi1h2blha665i4q4.apps.googleusercontent.com"
    const CLIENT_SERCRET="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"
    const REDIRECT_URL ="https://developers.google.com/oauthplayground"   
    const REFRESH_TOKEN="1//04sdoP6aKsutxCgYIARAAGAQSNwF-L9IrEctwuu1XFmG42qwP2d672zgWFvwVAfGr1M5317Zv1eSZwUYxwegNiZy8BI3OBH661ys"
    
     
    
    
    const oAuth2Client=new google.auth.OAuth2(CLIENT_ID, CLIENT_SERCRET, REDIRECT_URL)

    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    

     const sendMail = async () => {

        try {
            const accessToken = await oAuth2Client.getAccessToken() 
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user:"vivas.ernesto@gmail.com",
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SERCRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });

            const mailOptions = {
                
                from: "DS EVENTOS <vivas.ernesto@gmail.com>",
                to:`${email}`,
                subject:"DS Eventos",
                                html:`
                    <h1> Tus Boletas han sido reservadas con éxito</h1>
                    <h1> Debes pagar Inmediatamente y confirmar el pago.</h1>
                    
                    
                    <h3> Estos son tus datos: </h3> 
                        <ul>
                            <li> name: ${name}       </li>
                            <li> email: ${email}     </li>
                            <li> celular: ${phone}   </li>
                            
                            
                        </ul>

                    <h1>1.- Total a pagar : ${total}  </h1>

                    <h1>2.- Copia la cuenta Nequi aquí:  3127472160 </h1>
                    
                    <h1>2.- Entra a tu banco </h1>

                    transfiere a la cuenta nequi:  3127472160

                    <h1>4.- Envía la foto del pago y sigue las instrucciones aquí: </h1>

                    <p> <a href="https://wa.me/573127472160/?text=Agrega%20la%20imagen%20de%20tu%20pago%20aqui%20con%20tus%20datos%20personales%20(nombre%20completo,%20número,%20de%20identificación,%20y%20correo%20)%20y%20en%20unos%20momentos%20confirmaremos%20el%20pago" > Click aquí para confirmar tu pago en Whatsapp ...</a> </p>

                    <h1>6.- Listo campeon ya terminaste!  </h1>

                    <h1>Contacto Whatsapp</h1>

                        <li><link> 312-747-2160</link> </li>

                        <p> mensaje: ${message} <p>


                        ${createTable(boletas)}    `
            };

           const result =  await transporter.sendMail(mailOptions)

            return result



        } catch (error) {
            console.log("Este es el error de mailhelper", error);
        }

     }

     sendMail()




}



module.exports= sendMail