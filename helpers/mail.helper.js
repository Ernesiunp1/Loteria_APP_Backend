const express = require('express');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');




const sendMail = (payload) =>{

    const { boletas, name, email, phone, message,} =  payload


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

    const CLIENT_ID ="533437542492-cec47jqpe9fieeb4qi1h2blha665i4q4.apps.googleusercontent.com"
    const CLIENT_SERCRET="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"
    const REDIRECT_URL ="https://developers.google.com/oauthplayground" 
    const REFRESH_TOKEN="1//04qbwoNzcIaNwCgYIARAAGAQSNwF-L9Irvas_ZNrcpY1zq-przX2P-ny1nehwf8ACLk4tnbTPGMpKhxQ0GDG5YWpU7aUMsy3iM8Q"

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