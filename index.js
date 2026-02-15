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
        respuestas
