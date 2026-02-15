const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar para recibir JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Headers requeridos por AutoResponder
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Max-Age', '3600');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

// Página de inicio
app.get('/', (req, res) => {
    res.send(`
        <h1>✅ Servidor WhatsApp funcionando!</h1>
        <p>Servidor activo y listo para recibir mensajes de AutoResponder</p>
        <p>Endpoint: POST /webhook</p>
        <hr>
        <h3>Palabras clave disponibles:</h3>
        <ul>
            <li><strong>hola</strong> - Saludo</li>
            <li><strong>imagen</strong> - Envía una imagen</li>
            <li><strong>catalogo</strong> - Catálogo con imagen</li>
            <li><strong>precio</strong> - Lista de precios</li>
            <li><strong>horario</strong> - Horarios de atención</li>
            <li><strong>contacto</strong> - Información de contacto</li>
            <li><strong>gracias</strong> - Despedida cortés</li>
            <li><strong>adios</strong> - Despedida</li>
        </ul>
    `);
});

// Endpoint principal para AutoResponder
app.post('/webhook', (req, res) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📩 Mensaje recibido de AutoResponder');
    console.log('Hora:', new Date().toLocaleString());
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Verificar que los datos no estén incompletos
    if (
        !req.body.query ||
        !req.body.appPackageName ||
        !req.body.messengerPackageName ||
        !req.body.query.sender ||
        !req.body.query.message
    ) {
        console.error('❌ Error: Datos JSON incompletos');
        
        res.status(400).json({
            replies: [
                { message: "Error ❌" },
                { message: "JSON data is incomplete. Was the request sent by AutoResponder?" }
            ]
        });
        return;
    }
    
    // Extraer datos del mensaje
    const appPackageName = req.body.appPackageName;
    const messengerPackageName = req.body.messengerPackageName;
    const sender = req.body.query.sender;
    const message = req.body.query.message;
    const isGroup = req.body.query.isGroup;
    const groupParticipant = req.body.query.groupParticipant || '';
    const ruleId = req.body.query.ruleId;
    const isTestMessage = req.body.query.isTestMessage;
    
    console.log(`👤 De: ${sender}`);
    console.log(`💬 Mensaje: ${message}`);
    console.log(`📱 App: ${appPackageName}`);
    console.log(`💌 Messenger: ${messengerPackageName}`);
    console.log(`👥 Es grupo: ${isGroup}`);
    console.log(`🧪 Es prueba: ${isTestMessage}`);
    
    // ═══════════════════════════════════════════════════════════
    // PROCESAR MENSAJES Y GENERAR RESPUESTAS
    // ═══════════════════════════════════════════════════════════
    
    const mensajeLower = message.toLowerCase().trim();
    let respuestas = [];
    
    // Respuestas según palabras clave
    if (mensajeLower.includes('hola') || mensajeLower.includes('hi') || mensajeLower.includes('buenos')) {
        respuestas = [
            { message: `¡Hola ${sender}! 👋` },
            { message: "¿En qué puedo ayudarte hoy?\n\nPuedes escribir:\n• imagen\n• catalogo\n• precio\n• horario" }
        ];
        
    } else if (mensajeLower.includes('imagen') || mensajeLower.includes('foto') || mensajeLower.includes('picture')) {
        respuestas = [
            { message: "📸 Aquí está la imagen que solicitaste:" },
            { image: "https://i.imgur.com/sraR9Lu.jpg" }
        ];
        
    } else if (mensajeLower.includes('catalogo') || mensajeLower.includes('catálogo') || mensajeLower.includes('producto')) {
        respuestas = [
            { message: "📱 *Nuestro catálogo de productos*" },
            { 
                message: "Aquí puedes ver nuestros productos destacados:",
                image: "https://i.imgur.com/sraR9Lu.jpg"
            },
            { message: "¿Qué producto te interesa?" }
        ];
        
    } else if (mensajeLower.includes('precio') || mensajeLower.includes('costo') || mensajeLower.includes('cuanto')) {
        respuestas = [
            { message: `Hola ${sender}, nuestros precios son:` },
            { message: "📦 Plan Básico: $10/mes\n⭐ Plan Premium: $25/mes\n🚀 Plan Empresarial: $50/mes" },
            { message: "¿Cuál te interesa?" }
        ];
        
    } else if (mensajeLower.includes('horario') || mensajeLower.includes('hora') || mensajeLower.includes('atiende')) {
        respuestas = [
            { message: "⏰ *Horarios de atención:*" },
            { message: "Lunes a Viernes: 9:00 AM - 6:00 PM\nSábados: 10:00 AM - 2:00 PM\nDomingos: Cerrado" }
        ];
        
    } else if (mensajeLower.includes('contacto') || mensajeLower.includes('telefono') || mensajeLower.includes('teléfono')) {
        respuestas = [
            { message: "📞 *Datos de contacto:*" },
            { message: "Teléfono: +1 234 567 8900\nEmail: info@ejemplo.com\nWeb: www.ejemplo.com" }
        ];
        
    } else if (mensajeLower.includes('gracias') || mensajeLower.includes('thank')) {
        respuestas = [
            { message: `¡De nada, ${sender}! 😊` },
            { message: "Estoy aquí para ayudarte cuando lo necesites." }
        ];
        
    } else if (mensajeLower.includes('adios') || mensajeLower.includes('chao') || mensajeLower.includes('bye')) {
        respuestas = [
            { message: `¡Hasta luego, ${sender}! 👋` },
            { message: "Que tengas un excelente día." }
        ];
        
    } else {
        // Respuesta por defecto
        respuestas = [
            { message: `Hola ${sender}, gracias por tu mensaje 📝` },
            { message: `Recibí: "${message}"` },
            { message: "Puedes preguntarme sobre:\n• imagen\n• catalogo\n• precio\n• horario\n• contacto" }
        ];
    }
    
    // ═══════════════════════════════════════════════════════════
    // FIN DE PROCESAMIENTO
    // ═══════════════════════════════════════════════════════════
    
    console.log(`✅ Respuestas generadas: ${respuestas.length} mensajes`);
    respuestas.forEach((r, i) => {
        const msgPreview = r.message ? r.message.substring(0, 50) : '[imagen]';
        console.log(`   ${i + 1}. ${msgPreview}${r.image ? ' [+imagen]' : ''}...`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Enviar respuesta en el formato correcto de AutoResponder
    res.status(200).json({
        replies: respuestas
    });
});

// Endpoint GET para información
app.get('/webhook', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Webhook activo. Usa POST para enviar mensajes.',
        endpoint: '/webhook',
        method: 'POST',
        format: {
            request: {
                appPackageName: 'tkstudio.autoresponderforwa',
                messengerPackageName: 'com.whatsapp',
                query: {
                    sender: 'John Smith',
                    message: 'Hola',
                    isGroup: false,
                    ruleId: 1,
                    isTestMessage: false
                }
            },
            response: {
                replies: [
                    { message: 'Reply 1' },
                    { message: 'Reply 2', image: 'https://example.com/image.jpg' }
                ]
            }
        }
    });
});

// Endpoint de prueba
app.get('/test', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        message: 'Servidor funcionando correctamente',
        features: ['text', 'images']
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Listo para recibir mensajes de AutoResponder`);
    console.log(`📸 Soporte para imágenes: ACTIVADO`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
