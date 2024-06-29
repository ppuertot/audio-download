import express, { Express, Request, Response } from "express";
import path from "path";
import multer from "multer";

const app = express();
const port = process.env.PORT || "3000";

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

app.use('/public', express.static(path.join(__dirname, 'public')));

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


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
