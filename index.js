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
    res.send('<h1>Servidor WhatsApp Bot</h1><p>Activo - Descarga y adjunta imagenes</p><img src="' + IMAGEN_URL + '" style="max-width:400px"><p>Endpoint: POST /webhook</p>');
});

app.post('/webhook', async (req, res) => {
    console.log('Mensaje recibido');
    console.log(JSON.stringify(req.body, null, 2));
    
    if (!req.body.query || !req.body.query.sender || !req.body.query.message) {
        return res.status(400).json({ replies: [{ message: 'Error: Datos incompletos' }] });
    }
    
    const sender = req.body.query.sender;
    const message = req.body.query.message;
    const msg = message.toLowerCase().trim();
    
    console.log('De:', sender, 'Mensaje:', message);
    
    let respuestas = [];
    
    // Si el comando requiere imagen, descargarla
    const comandosConImagen = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'imagen', 'foto', 'catalogo'];
    const necesitaImagen = comandosConImagen.some(cmd => msg.includes(cmd));
    
    let imagenBase64 = null;
    if (necesitaImagen) {
        try {
            console.log('Descargando imagen...');
            imagenBase64 = await descargarImagenBase64(IMAGEN_URL);
            console.log('Imagen descargada, tamaño base64:', imagenBase64.length, 'caracteres');
        } catch (error) {
            console.error('Error descargando imagen:', error);
        }
    }
    
    // TESTS CON IMAGEN BASE64
    if (msg === 'test1') {
        respuestas = [
            { message: 'TEST 1: Campo image con base64', image: 'data:image/png;base64,' + imagenBase64 }
        ];
    } else if (msg === 'test2') {
        respuestas = [
            { message: 'TEST 2: Campo image sin prefijo', image: imagenBase64 }
        ];
    } else if (msg === 'test3') {
        respuestas = [
            { message: 'TEST 3: Campo media con base64', media: 'data:image/png;base64,' + imagenBase64 }
        ];
    } else if (msg === 'test4') {
        respuestas = [
            { message: 'TEST 4: Campo file con base64', file: 'data:image/png;base64,' + imagenBase64 }
        ];
    } else if (msg === 'test5') {
        respuestas = [
            { message: 'TEST 5: Mensaje separado', image: 'data:image/png;base64,' + imagenBase64 }
        ];
    } else if (msg === 'test6') {
        respuestas = [
            { 
                message: 'TEST 6: Todos los campos',
                image: 'data:image/png;base64,' + imagenBase64,
                media: 'data:image/png;base64,' + imagenBase64,
                file: 'data:image/png;base64,' + imagenBase64,
                attachment: 'data:image/png;base64,' + imagenBase64
            }
        ];
        
    // COMANDOS NORMALES CON IMAGEN
    } else if (msg.includes('imagen') || msg.includes('foto')) {
        respuestas = [
            { message: 'Aqui esta tu imagen:' },
            { image: 'data:image/png;base64,' + imagenBase64 }
        ];
    } else if (msg.includes('catalogo')) {
        respuestas = [
            { message: 'CATALOGO DE PRODUCTOS' },
            { message: 'Nuestros productos:', image: 'data:image/png;base64,' + imagenBase64 },
            { message: 'Te interesa alguno?' }
        ];
        
    // COMANDOS SIN IMAGEN
    } else if (msg.includes('hola')) {
        respuestas = [
            { message: 'Hola ' + sender + '!' },
            { message: 'TESTS (imagen base64):\ntest1, test2, test3, test4, test5, test6\n\nCOMANDOS:\nimagen, catalogo, precio, horario' }
        ];
    } else if (msg.includes('precio')) {
        respuestas = [
            { message: 'PRECIOS' },
            { message: 'Basico: $10\nPremium: $25\nEmpresarial: $50' }
        ];
    } else if (msg.includes('horario')) {
        respuestas = [
            { message: 'HORARIOS' },
            { message: 'Lun-Vie: 9AM-6PM\nSab: 10AM-2PM' }
        ];
    } else {
        respuestas = [
            { message: 'Recibi: ' + message },
            { message: 'Escribe hola para ver el menu' }
        ];
    }
    
    console.log('Enviando', respuestas.length, 'respuestas');
    res.status(200).json({ replies: respuestas });
});

app.get('/webhook', (req, res) => {
    res.json({ status: 'ok', imageUrl: IMAGEN_URL });
});

app.listen(PORT, () => {
    console.log('Servidor en puerto', PORT);
    console.log('Imagen:', IMAGEN_URL);
    console.log('Modo: Descarga y convierte a base64');
    console.log('Listo');
});
