const jwt = require("jwt-simple");
const User = require("../models/user.model")



const Auth = async ( req = request, res = response, next ) =>{

    const authHeaders = req.headers.authorization    

    if (!authHeaders) {
        return res.status(401).json({
            status: "Error",
            msg: "Unauthorized |No hay token en la request"
        })
    };     
    
         
    try {
        
        let token = authHeaders.replace(/['"]+/g, "")
        token = token.replace(/^Bearer\s*"?|"?$/g, "")
        const checkToken  = await jwt.decode(token, process.env.JWTSECRET)  
        req.user = checkToken

        console.log(req.user);

        const checkActive = await User.findById(req.user.id)


        if (!checkActive) {
            return res.status(401).json({
                status: "Error",
                msg: "Unauthorized |el usuario no existe",
                
            })
        }
        next()
        

    } catch (error) {
        console.log(error);
        res.status(403).json({
            status: "Error",
            msg: "Unauthorized |token expired"
        })
    } 


}


module.exports = Auth