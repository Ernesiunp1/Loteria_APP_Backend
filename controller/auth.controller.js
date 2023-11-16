
const express = require('express')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('../services/jwtService')



const checkAuth = async ( req, res ) =>{

    console.log('entrando al checkAuth');

    const { email, password } = req.body


    try {
        
        if (!email || !password) 
            return res.status(401).json({ msg:' Faltan datos en la request'})


        const usuario = await User.find({ email: email, password: password})


        if (usuario.length === 0) {
            return res.status(404).json({
                status: 'error',
                msg: 'Credenciales no Validas'
            })
        }



        return res.json({
            status:' success',
            usuario
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Internal Server Error',
            msg: 'Error al consultar el Usuario'
        })
    }



}



const login = async (req = request, res = response) => {
    // recoger valores
    const { email, password } = req.body;
  
    // validacion lista en routes
  
    try {
      // validando si el usuario existe en la base de datos
      const userStored = await User.findOne({ email });
      if (!userStored) {
        res.status(404).json({
          status: "Not Found",
          msg: "Usuario no encontrado",
        });
      }
  
   
      // si existe comparamos la password almacenada con la enviada
      const check_password = bcrypt.compareSync(password, userStored.password);
  
     

      // si no es correcta enviamos respuesta negativa
      if (!check_password) {
        return res.status(401).json({
          status: "Error",
          msg: "UnAuthorized | not valid credentials",
        });
      }
  
      // si es correcta generamos un jwt desde un servicio
      const token = await jwt(userStored);
  
  
      // insertar usuario en la request
      req.user = await userStored
  
  
      res.json({
        status: "success",
        name:  userStored.name,     
        token      
      });
  
    } catch (error) {
  
      console.log(error);
      return res.status(500).json({
        status: "error",
        msg: "Internal Server Error| error al hacer login",
      });
    }
  };




const createUser = async (req, res) =>{

    const body = req.body

    if (body.email === "" || body.password == null) {
        return res.status(400).json({
            status: 'error',
            msg: ' falta datos en la request'
        })
    }




    try {

        const checkEmail = await User.findOne({email: body.email})

       
        if (checkEmail){
            
            return res.status(400).json({
                status : 'error',
                msg: "El correo ya existe"
            })
        }


        const newPassword = bcrypt.hashSync(body.password, 13)

        body.password = newPassword


        
        const creatingUser = User(body)
        const newUser = await creatingUser.save()

        return res.status(201).json({
            status: 'success',
            newUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status:'Internal Server Error',
            msg:'Error al crear nuevo usuario'
        })
        
    }

   





}


const updateUser = async (req, res) => {

    const {email, password, nuevaPass} = req.body


    try {


        const update = await User.findOneAndUpdate({email: email , 
                                                    password: password}, 
                                                    { password: nuevaPass}, 
                                                    {new:true, select: '-password' } )


        if (!update || update == null) {
            return res.status(301).json({
                status: 'unAuthorize',
                msg: 'Credenciales incorrectas'
            })
        }
                                    
        return res.json({
            status: 'Success',
            update,
            msg: "Usuario actualizado exitosamente"
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Internal Server Error',
            msg: 'Error al actualizar usuario',
            error: error.message,
            error
        })
    }



    // res.json({
    //     msg: ' Updating',
    //     update
    // })


}



module.exports = {
    checkAuth,
    createUser,
    updateUser,
    login

}