const express = require("express")
const {Response, Request} = require("express")
const Publicacion = require("../models/publicacion.model")
const Compra = require('../models/compras.model')
const { cargarArchivos } = require('../controller/uploas.controller')


const prueba = async (req, res) => {


    try {
    
        return res.json({
            status: "ok",
            msg: "accion de ruta util"
        })
        
    } catch (error) {
        console.log(error);
    }

}

const getPublicacion = async (req, res) => {


    try {
        const publicaciones = await Publicacion.find()
                              .select('-__v -password -created_at')
                              .populate('boletas')

        if (publicaciones.length === 0) {
            return res.status(200).json({
                status:'not found',
                msg: 'No se encontraron publicaciones'
            })
        }
        
        return res.json({
            publicaciones
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'Internal Server Error',
            msg: 'Error al recuperar las publicaciones'
        })
        
    }


};

const getDetail = async (req, res) => {


//  todo: habilitar la constante de abajo (id) para que funcione denuevo 
// const id = req.params.id;


  try {
    const publicacion = await Publicacion.findById(id).select(
      "-__v -password -created_at"
    );

    if (!id) {
      return res.status(401).json({
        status: "Bad Request",
        msg: "Falta el Id en la publicación",
      });
    }

    return res.status(200).json({
      status: "success",
      publicacion,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      msg: "Error al recuperar la publicacion",
      error: error.message,
    });
  }
};


const createPublicacion = async (req = Resquest, res = Response) => {

    const body = req.body
    const password = "ElMejorEntrenadorFocus"
    const titulo = req.body.titulo

    console.log('este es el pass', req.body.password, body)
    
    if (req.body.password !== password) 
        return res.status(401).json({ msg: "Invalid password"})

    try {

        

        if (!body.titulo || !body.subTitulo || !body.texto ) {
            return res.status(400).json({
                status: 'Bad request',
                msg: " Faltan datos en la Publicacion"
            })
        }

        const busqueda = await Publicacion.find({titulo: body.titulo})

        if (busqueda.length > 0) {
            return res.json({
                status: 'error',
                msg: "El nombre de la publicacion ya existe"
            })
        }

        
        
        const nuevaPublicacion = Publicacion(body)
        await nuevaPublicacion.save()

        const publicacionSaved = {
            titulo: nuevaPublicacion.titulo,
            subTitulo: nuevaPublicacion.subTitulo,
            texto: nuevaPublicacion.texto
        }

        return res.status(200).json({
            status: 'success',
            msg: "accion de publicar",
            publicacion: publicacionSaved
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "Internal Server Error",
            msg: error.message
        })
    }



};


const updatePubli = async (req = Request, res = Response) => {

    const body = req.body;
    const id = req.params.id;
    const password = "ElMejorEntrenadorFocus";

    if (password !== body.password) {

        return res.status(401).json({
            status: "Unauthorized",
            msg: "password Invalida"
        })
        
    }

    try {

        const publiToUpdate = await Publicacion.find({_id: id})

        if (publiToUpdate.length === 0) {
            return res.send({status: 404, msg: 'publicacion a actualizar no existe'})
        }
        
        const publiActualizada = await Publicacion.findByIdAndUpdate(id, body, {new: true})
                                                  .select("-__v -password -created_at")

        return res.json({
            status:'success',
            msg: ' Actualizando',           
            publiActualizada    
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "Internal Server Error",
            msg: "Error al actualizar la publicacion",
            error: error.message
        })
    }  

};


const removePubli = async (req, res) => {

    const id = req.params.id

    try {

        const boletas = await Compra.find({idPublicacion : id})

        if (boletas.length > 0) {
            return res.status(403).json({
                status: "error",
                msg: 'Eliminar Primero las Boletas Vendidas'
            })
        }


        const remove = await Publicacion.findByIdAndDelete(id)

        return res.status(200).json({

            status:'success',
            msg: ' Publicacion eliminada',
            
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Internal Server Error',
            msg: 'error al intentar borrar publicacion',
            error: error.mesaage
        })
    }

};

module.exports= {
    prueba,
    createPublicacion,
    updatePubli,
    removePubli,
    getPublicacion,
    getDetail
}