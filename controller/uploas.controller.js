// const { response } = require("express");
const express = require("express");
const path = require('path');
const { v4: uuid} = require('uuid');
const fs = require('fs');
const cloudinary = require('cloudinary').v2


cloudinary.config(process.env.CLOUDINARY_URL)

var extension
// let titulo = "erns1"
const cargarArchivos1 = async (req, res = response,) => {

    const titulo = req.params.titulo

    const archivo = req.files.archivo;

    console.log('este es el archivo', archivo)

   
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({msg:'No files were uploaded.'});
    }

    const extPermitidas = ['jpg', 'png', 'gif', 'jpeg']

    const file = req.files.archivo.name
    const partes = file.split('.')
    const extension = partes[ partes.length -1 ] 
    
    

    if (!extPermitidas.includes(extension)) {
        return res.status(400).json({
            status:'Bad Request',
            msg: `EL archivo ${file} contiene una extension no permitida`
        })
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    
    // recibiendo archivo
    // const archivo = req.files.archivo;

    console.log(archivo);

    // asignando nombre al archivo a guardar
    const nombreArchivo = archivo.name + uuid() + '.' + extension
   
    // evaluando si existe el path de destino
    const pathExist = path.join(__dirname, `../uploads/${titulo}/` )
    


    if (!fs.existsSync(pathExist)) {
        fs.mkdirSync(pathExist);

    }
    

    // asignando el path con el archivo donde se va a guardar
    const uploadPath =  path.join(__dirname,  `../uploads/${titulo}/`, nombreArchivo);

        

  
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(uploadPath, (err) => {
      if (err)
        return res.status(500).json({msg: err});
  
      res.json({
                msg: `${uploadPath}`,
                nombreArchivo    
            });
    });

};
const cargarArchivos = async (req, res = response,) => {

    const titulo = req.params.titulo

   
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({msg:'No files were uploaded.'});
    }

    const extPermitidas = ['jpg', 'png', 'gif', 'jpeg']

    const file = req.files.archivo.name
    const partes = file.split('.')
    const extension = partes[ partes.length -1 ] 
    
    

    if (!extPermitidas.includes(extension)) {
        return res.status(400).json({
            status:'Bad Request',
            msg: `EL archivo ${file} contiene una extension no permitida`
        })
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    
    // recibiendo archivo
    const archivo = req.files.archivo;

    console.log(archivo);

    // asignando nombre al archivo a guardar
    const nombreArchivo = archivo.name + uuid() + '.' + extension
   
    // evaluando si existe el path de destino
    const pathExist = path.join(__dirname, `../uploads/${titulo}/` )
    


    if (!fs.existsSync(pathExist)) {
        fs.mkdirSync(pathExist);

    }
    cloudinary.config({ 
        cloud_name: 'dv0bnpxs2', 
        api_key: '437986122884639', 
        api_secret: '-6eYzqjlzvoQg2_LBdfWfOLjsnM' 
      })
   



    // asignando el path con el archivo donde se va a guardar
   

       

    const {tempFilePath} = req.files.archivo
    const resp =  await cloudinary.uploader.upload(tempFilePath)
       

  
    

    const uploadPath =  path.join(__dirname,  `../uploads/${titulo}/`, nombreArchivo);

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(uploadPath, (err) => {
      if (err)
       { return res.status(500).json({msg: err});}
       
      
      res.json({
                // msg: `${uploadPath}`,
                // nombreArchivo,
                resp: resp.secure_url
                 
            });
    });

    

};




const updateImage = (req, res) => {


    const param = req.params.titulo

    res.json({
        param
    })

}

const removeImagenes = async (req, res) => {

    const titul = req.params.titulo

    const Path = path.join(__dirname, `../uploads/${titul}/`);
    const existPath = fs.existsSync(Path)

    if (existPath) {

        const eliminacion = fs.rmdirSync( Path, { recursive: true } )

        return res.status(200).json({
           status: 'success',
           msg: 'La imagenes han sido Eliminadas'
          })
        
    }else {

        return res.status(200).json({
           msg: 'No existe la publicacion a eliminar'
          })

    }
  
};




module.exports = {
    cargarArchivos,
    removeImagenes,
    updateImage
};

