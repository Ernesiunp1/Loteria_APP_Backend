require("dotenv").config()
const {request, response} = require("express")
const mercadopago = require("mercadopago")



const success = (req = request, res = response) => {
    const params = req.params
    const query = req.query

    return res.json({
        status: "success",
        msg: "TODO HA IDO MUY BIEN"
    })
    
}


const failure = (req = request, res = response) => {
    const params = req.params
    const query = req.query

    return res.json({
        status: "success",
        msg: "TODO HA IDO MUY MALLLLLL"
    })
}



module.exports = {
    success,
    failure
}