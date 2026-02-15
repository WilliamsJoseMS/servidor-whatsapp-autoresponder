const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Max-Age', '3600');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

const IMAGEN_URL = 'https://bvupglaubbjzntbwercu.supabase.co/storage/v1/object/public/billboard/Gemini_Generated_Image_5vl95r5vl95r5vl9.png';

app.get('/', (req, res) => {
    res.send('<h1>Servidor WhatsApp Bot</h1><p>Activo y funcionando</p><img src="' + IMAGEN_URL + '" style="max-width:400px"><p>Endpoint: POST /webhook</p>');
});

app.post('/webhook', (req, res) => {
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
    
    if (msg === 'test1') {
        respuestas = [{ message: 'TEST 1: Campo image', image: IMAGEN_URL }];
    } else if (msg === 'test2') {
        respuestas = [{ message: 'TEST 2: Mensaje separado' }, { image: IMAGEN_URL }];
    } else if (msg === 'test3') {
        respuestas = [{ message: 'TEST 3: URL en texto\n\n' + IMAGEN_URL }];
    } else if (msg === 'test4') {
        respuestas = [{ message: 'TEST 4: Campo media', media: IMAGEN_URL }];
    } else if (msg === 'test5') {
        respuestas = [{ message: 'TEST 5: Todos los campos', image: IMAGEN_URL, media: IMAGEN_URL, imageUrl: IMAGEN_URL }];
    } else if (msg.includes('imagen') || msg.includes('foto')) {
        respuestas = [{ message: 'Aqui esta tu imagen:' }, { image: IMAGEN_URL, media: IMAGEN_URL }];
    } else if (msg.includes('catalogo')) {
        respuestas = [{ message: 'CATALOGO DE PRODUCTOS' }, { message: 'Nuestros productos:', image: IMAGEN_URL }, { message: 'Te interesa alguno?' }];
    } else if (msg.includes('hola')) {
        respuestas = [{ message: 'Hola ' + sender + '!' }, { message: 'Prueba: test1, test2, test3, test4, test5, imagen, catalogo' }];
    } else if (msg.includes('precio')) {
        respuestas = [{ message: 'PRECIOS' }, { message: 'Basico: $10\nPremium: $25\nEmpresarial: $50' }];
    } else if (msg.includes('horario')) {
        respuestas = [{ message: 'HORARIOS' }, { message: 'Lun-Vie: 9AM-6PM\nSab: 10AM-2PM' }];
    } else {
        respuestas = [{ message: 'Recibi: ' + message }, { message: 'Escribe hola para ver el menu' }];
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
    console.log('Listo');
});
