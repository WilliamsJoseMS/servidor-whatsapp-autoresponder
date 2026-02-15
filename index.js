const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar parsers MÁS PERMISIVOS
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

// Headers ULTRA PERMISIVOS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('X-Content-Type-Options', 'nosniff');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// ═══════════════════════════════════════════════════════════
// IMAGEN - URL DIRECTA Y PÚBLICA
// ═══════════════════════════════════════════════════════════

const IMAGEN_URL = "https://bvupglaubbjzntbwercu.supabase.co/storage/v1/object/public/billboard/Gemini_Generated_Image_
