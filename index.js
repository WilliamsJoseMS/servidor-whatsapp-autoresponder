const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

const IMAGEN_URL = 'https://bvupglaubbjzntbwercu.supabase.co/storage/v1/object/public/billboard/Gemini_Generated_Image_5vl95r5vl95r5vl9.png';

// Función para descargar imagen y convertir a base64
function descargarImagenBase64(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const chunks = [];
            
            response.on('data', (chunk) => {
                chunks.push(chunk);
            });
            
            response.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                resolve(base64);
            });
            
            response.on('error', (err) => {
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

app.get('/', (req, res) => {
    res.send('<h1>Servidor WhatsApp Bot</h1><p>Activo - SIEMPRE envia imagen</p><img src="' + IMAGEN_URL + '" style="max-width:400px"><p>Endpoint: POST /webhook</p>');
});

app.post('/webhook', async (req, res) => {
    console.log('==================================');
    console.log('MENSAJE RECIBIDO');
    console.log('==================================');
    console.log(JSON.stringify(req.body, null, 2));
    
    if (!req.body.query || !req.body.query.sender || !req.body.query.message) {
        return res.status(400).json({ replies: [{ message: 'Error: Datos incompletos' }] });
    }
    
    const sender = req.body.query.sender;
    const message = req.body.query.message;
    
    console.log('De:', sender);
    console.log('Mensaje:', message);
    console.log('----------------------------------');
    
    // DESCARGAR LA IMAGEN SIEMPRE
    console.log('Descargando imagen...');
    let imagenBase64 = null;
    
    try {
        imagenBase64 = await descargarImagenBase64(IMAGEN_URL);
        console.log('Imagen descargada! Tamaño:', imagenBase64.length, 'caracteres');
    } catch (error) {
        console.error('Error descargando imagen:', error);
    }
    
    // PREPARAR RESPUESTAS - SIEMPRE CON IMAGEN
    let respuestas = [];
    
    if (imagenBase64) {
        // Enviar la imagen en TODOS los formatos posibles
        respuestas = [
            { 
                message: 'Recibí tu mensaje: ' + message,
                image: 'data:image/png;base64,' + imagenBase64
            },
            {
                image: IMAGEN_URL
            },
            {
                media: 'data:image/png;base64,' + imagenBase64
            },
            {
                message: 'Enlace directo: ' + IMAGEN_URL
            }
        ];
    } else {
        respuestas = [
            { message: 'Recibí: ' + message },
            { message: 'Error al cargar imagen. URL: ' + IMAGEN_URL }
        ];
    }
    
    console.log('Enviando', respuestas.length, 'respuestas con imagen');
    console.log('==================================\n');
    
    res.status(200).json({ replies: respuestas });
});

app.get('/webhook', (req, res) => {
    res.json({ 
        status: 'ok', 
        imageUrl: IMAGEN_URL,
        mode: 'Siempre envia imagen'
    });
});

app.listen(PORT, () => {
    console.log('==================================');
    console.log('SERVIDOR INICIADO');
    console.log('==================================');
    console.log('Puerto:', PORT);
    console.log('Imagen:', IMAGEN_URL);
    console.log('Modo: SIEMPRE ENVÍA IMAGEN');
    console.log('==================================\n');
});
