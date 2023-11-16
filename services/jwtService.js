const jwt = require("jwt-simple");
const moment = require("moment");



const token = async ( data )=>{

    const payload = {
        id: data._id,       
        email: data.email,            
        iat: moment().unix(),
        exp: moment().add(5 , "hours").unix()
    }


    return jwt.encode(payload, process.env.JWTSECRET)
}


module.exports = token






