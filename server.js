const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta para descargar un archivo de audio específico
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', filename);

    // Verificar si el archivo existe
    fs.stat(filePath, (err, stats) => {
        if (err) {
            return res.status(404).send('Archivo no encontrado.');
        }

        // Configurar el encabezado de la respuesta
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'audio/wav');

        // Crear un stream de lectura y pipe a la respuesta
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
