



const subirArchivo = (files, titulo) => {


    return new Promise((resolve, reject) => {

        const extPermitidas = ['jpg', 'png', 'gif', 'jpeg']

        const file = files.archivo.name
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
        
    
        // asignando el path con el archivo donde se va a guardar
        const uploadPath =  path.join(__dirname,  `../uploads/${titulo}/`, nombreArchivo);
    
            
    
      
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
          if (err)
            return res.status(500).json({msg: err});
      
          res.json({msg: `${uploadPath}`});
        });
    


    })

   



}



module.exports = {
    subirArchivo
}