const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar para recibir JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Página de inicio para verificar que funciona
app.get('/', (req, res) => {
    res.send(`
        <h1>✅ Servidor WhatsApp funcionando!</h1>
        <p>Servidor activo y listo para recibir mensajes</p>
        <p>Usa el endpoint /webhook para AutoResponder</p>
    `);
});

// Endpoint para recibir mensajes de AutoResponder
app.post('/webhook', (req, res) => {
    console.log('📩 Mensaje recibido:');
    console.log(req.body);
    
    // Aquí puedes procesar el mensaje
    const mensaje = req.body.message || req.body.query || '';
    const numero = req.body.from || req.body.number || '';
    
    console.log(`De: ${numero}`);
    console.log(`Mensaje: ${mensaje}`);
    
    // Respuesta automática simple
    let respuesta = 'Gracias por tu mensaje';
    
    // Ejemplos de respuestas automáticas
    if (mensaje.toLowerCase().includes('hola')) {
        respuesta = '¡Hola! 👋 ¿En qué puedo ayudarte?';
    } else if (mensaje.toLowerCase().includes('precio')) {
        respuesta = 'Nuestros precios van desde $10';
    } else if (mensaje.toLowerCase().includes('horario')) {
        respuesta = 'Atendemos de Lunes a Viernes, 9am - 6pm';
    }
    
    // Enviar respuesta a AutoResponder
    res.json({
        reply: respuesta
    });
});

// Endpoint GET para pruebas
app.get('/webhook', (req, res) => {
    res.send('Webhook activo. Usa POST para enviar mensajes.');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
