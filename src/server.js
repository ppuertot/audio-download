const express = require('express');
const multer = require('multer');
// const mime = require('mime-types');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Agrega una marca de tiempo al nombre del archivo
        // cb(null, file.originalname)
    }
});

const upload = multer({ storage });

// Ruta para cargar archivos
app.post('/upload', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se cargó ningún archivo.');
    }
    console.log(req.file)
    // const fileUrl = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
    res.json({ 
        url1: `${req.protocol}://${req.get('host')}/public/${req.file.filename}`,
        url2: `${req.protocol}://${req.get('host')}/download/${req.file.filename}`,
        url3: `${req.protocol}://${req.get('host')}/send_file/${req.file.filename}`,
        url4: `${req.protocol}://${req.get('host')}/stream/${req.file.filename}`  
    });
});

// Ruta para descargar un archivo de audio específico
app.get('/stream/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', filename);

    // Verificar si el archivo existe
    fs.stat(filePath, (err, stats) => {
        if (err) {
            return res.status(404).send('Archivo no encontrado.');
        }
        
        // Obtener el tipo MIME
        // const mimeType = mime.lookup(filePath);
        // console.log(mimeType)

        // Configurar el encabezado de la respuesta
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'audio/wave');

        // Crear un stream de lectura y pipe a la respuesta
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

// Ruta para descargar un archivo de audio específico
app.get('/send_file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', filename);

    res.sendFile(filePath, err => {
        if (err) {
            res.status(404).send('Archivo no encontrado.');
        }
    });
});

// Ruta para descargar un archivo de audio específico
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', filename);

    res.download(filePath, err => {
        if (err) {
            res.status(404).send('Archivo no encontrado.');
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
