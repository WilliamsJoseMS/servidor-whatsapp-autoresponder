const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar para recibir JSON y form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar CORS para AutoResponder
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Página de inicio
app.get('/', (req, res) => {
    res.send(`
        <h1>✅ Servidor WhatsApp funcionando!</h1>
        <p>Servidor activo y listo para recibir mensajes</p>
        <p>Usa el endpoint /webhook para AutoResponder</p>
        <hr>
        <h3>Endpoints disponibles:</h3>
        <ul>
            <li>GET / - Esta página</li>
            <li>POST /webhook - Recibir mensajes de AutoResponder</li>
            <li>GET /test - Prueba simple</li>
        </ul>
    `);
});

// Endpoint para recibir mensajes de AutoResponder
app.post('/webhook', (req, res) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📩 Nuevo mensaje recibido');
    console.log('Hora:', new Date().toLocaleString());
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // AutoResponder puede enviar los datos de diferentes formas
    const mensaje = req.body.message || req.body.query || req.body.text || '';
    const nombre = req.body.name || req.body.from || 'Usuario';
    const numero = req.body.number || req.body.phone || '';
    const grupoNombre = req.body.groupname || '';
    const esGrupo = req.body.isgroup === 'true' || req.body.isgroup === true;
    
    console.log(`👤 De: ${nombre} (${numero})`);
    console.log(`💬 Mensaje: ${mensaje}`);
    if (esGrupo) {
        console.log(`👥 Grupo: ${grupoNombre}`);
    }
    
    // Variable para la respuesta
    let respuesta = '';
    let retraso = 0; // delay en segundos
    
    // ═══════════════════════════════════════════════════════════
    // AQUÍ PUEDES PERSONALIZAR TUS RESPUESTAS AUTOMÁTICAS
    // ═══════════════════════════════════════════════════════════
    
    const mensajeLower = mensaje.toLowerCase().trim();
    
    // Respuestas según palabras clave
    if (mensajeLower.includes('hola') || mensajeLower.includes('hi') || mensajeLower.includes('buenos')) {
        respuesta = `¡Hola ${nombre}! 👋 ¿En qué puedo ayudarte hoy?`;
        
    } else if (mensajeLower.includes('precio') || mensajeLower.includes('costo') || mensajeLower.includes('cuanto')) {
        respuesta = `Hola ${nombre}, nuestros precios son:\n\n` +
                   `📦 Plan Básico: $10/mes\n` +
                   `⭐ Plan Premium: $25/mes\n` +
                   `🚀 Plan Empresarial: $50/mes\n\n` +
                   `¿Cuál te interesa?`;
        
    } else if (mensajeLower.includes('horario') || mensajeLower.includes('hora') || mensajeLower.includes('atiende')) {
        respuesta = `⏰ *Horarios de atención:*\n\n` +
                   `Lunes a Viernes: 9:00 AM - 6:00 PM\n` +
                   `Sábados: 10:00 AM - 2:00 PM\n` +
                   `Domingos: Cerrado\n\n` +
                   `¿En qué más puedo ayudarte?`;
        
    } else if (mensajeLower.includes('producto') || mensajeLower.includes('catalogo') || mensajeLower.includes('catálogo')) {
        respuesta = `📱 *Nuestro catálogo incluye:*\n\n` +
                   `• Teléfonos inteligentes\n` +
                   `• Laptops y computadoras\n` +
                   `• Accesorios tecnológicos\n` +
                   `• Software y licencias\n\n` +
                   `¿Qué producto te interesa?`;
        
    } else if (mensajeLower.includes('contacto') || mensajeLower.includes('telefono') || mensajeLower.includes('teléfono')) {
        respuesta = `📞 *Datos de contacto:*\n\n` +
                   `Teléfono: +1 234 567 8900\n` +
                   `Email: info@ejemplo.com\n` +
                   `Web: www.ejemplo.com\n\n` +
                   `¿Necesitas algo más?`;
        
    } else if (mensajeLower.includes('gracias') || mensajeLower.includes('thank')) {
        respuesta = `¡De nada, ${nombre}! 😊 Estoy aquí para ayudarte cuando lo necesites.`;
        
    } else if (mensajeLower.includes('adios') || mensajeLower.includes('chao') || mensajeLower.includes('bye')) {
        respuesta = `¡Hasta luego, ${nombre}! 👋 Que tengas un excelente día.`;
        
    } else {
        // Respuesta por defecto
        respuesta = `Hola ${nombre}, gracias por tu mensaje. 📝\n\n` +
                   `Recibí: "${mensaje}"\n\n` +
                   `Puedes preguntarme sobre:\n` +
                   `• Precios\n` +
                   `• Horarios\n` +
                   `• Productos\n` +
                   `• Contacto\n\n` +
                   `¿En qué puedo ayudarte?`;
    }
    
    // ═══════════════════════════════════════════════════════════
    // FIN DE RESPUESTAS PERSONALIZADAS
    // ═══════════════════════════════════════════════════════════
    
    console.log(`✅ Respuesta generada: ${respuesta.substring(0, 50)}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Enviar respuesta a AutoResponder
    // IMPORTANTE: AutoResponder espera el campo "reply"
    res.json({
        reply: respuesta,
        delay: retraso  // Opcional: delay en segundos antes de enviar
    });
});

// Endpoint GET para pruebas rápidas
app.get('/webhook', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Webhook activo. Usa POST para enviar mensajes.',
        endpoint: '/webhook',
        method: 'POST',
        ejemplo: {
            message: 'hola',
            name: 'Juan',
            number: '+1234567890'
        }
    });
});

// Endpoint de prueba
app.get('/test', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        message: 'Servidor funcionando correctamente'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Endpoints disponibles:`);
    console.log(`   GET  / - Página de inicio`);
    console.log(`   POST /webhook - Recibir mensajes`);
    console.log(`   GET  /webhook - Info del webhook`);
    console.log(`   GET  /test - Prueba del servidor`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
