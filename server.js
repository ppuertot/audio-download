const express = require('express');
const multer = require('multer');
const mime = require('mime-types');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Agrega una marca de tiempo al nombre del archivo
    }
});

const upload = multer({ storage });

// Ruta para cargar archivos
app.post('/upload', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se cargó ningún archivo.');
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/download/${req.file.filename}`;
    res.send({ fileUrl });
});

// Ruta para descargar un archivo de audio específico
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Verificar si el archivo existe
    fs.stat(filePath, (err, stats) => {
        if (err) {
            return res.status(404).send('Archivo no encontrado.');
        }
        
        // Obtener el tipo MIME
        const mimeType = mime.lookup(filePath);
        console.log(mimeType)

        // Configurar el encabezado de la respuesta
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', mimeType);

        // Crear un stream de lectura y pipe a la respuesta
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
