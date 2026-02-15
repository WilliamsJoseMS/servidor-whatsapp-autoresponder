const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar para recibir JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Headers requeridos por AutoResponder - MÁS PERMISIVOS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Max-Age', '3600');
    res.header('Access-Control-Allow-Headers', '*');
    
    // Responder a preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Página de inicio
app.get('/', (req, res) => {
    res.send(`
        <h1>✅ Servidor WhatsApp funcionando!</h1>
        <p>Servidor activo y listo para recibir mensajes de AutoResponder</p>
        <p>Endpoint: POST /webhook</p>
        <hr>
        <h3>Comandos con imágenes:</h3>
        <ul>
            <li><strong>test1</strong> - Prueba método 1 (campo image)</li>
            <li><strong>test2</strong> - Prueba método 2 (campo media)</li>
            <li><strong>test3</strong> - Prueba método 3 (enlace en texto)</li>
            <li><strong>test4</strong> - Prueba método 4 (mensaje separado)</li>
            <li><strong>imagen</strong> - Imagen estándar</li>
            <li><strong>catalogo</strong> - Catálogo con imagen</li>
        </ul>
        <hr>
        <h3>Otros comandos:</h3>
        <ul>
            <li><strong>hola</strong> - Saludo</li>
            <li><strong>precio</strong> - Precios</li>
            <li><strong>horario</strong> - Horarios</li>
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
    
    // URL de la imagen
    const imagenURL = "https://i.imgur.com/sraR9Lu.jpg";
    
    // ═════════════════════════════════════════════════════════
    // PRUEBAS DE DIFERENTES MÉTODOS PARA ENVIAR IMÁGENES
    // ═════════════════════════════════════════════════════════
    
    if (mensajeLower.includes('test1')) {
        // MÉTODO 1: Campo "image" en el objeto
        console.log('🧪 Probando MÉTODO 1: campo image');
        respuestas = [
            { message: "🧪 TEST 1: Usando campo 'image'" },
            { 
                message: "Si ves una imagen debajo, el método 1 funciona:",
                image: imagenURL
            }
        ];
        
    } else if (mensajeLower.includes('test2')) {
        // MÉTODO 2: Campo "media"
        console.log('🧪 Probando MÉTODO 2: campo media');
        respuestas = [
            { message: "🧪 TEST 2: Usando campo 'media'" },
            { 
                message: "Si ves una imagen debajo, el método 2 funciona:",
                media: imagenURL
            }
        ];
        
    } else if (mensajeLower.includes('test3')) {
        // MÉTODO 3: URL en el texto (WhatsApp muestra vista previa automática)
        console.log('🧪 Probando MÉTODO 3: URL en texto');
        respuestas = [
            { message: "🧪 TEST 3: URL en el mensaje\n\nSi WhatsApp muestra vista previa, el método 3 funciona:\n\n" + imagenURL }
        ];
        
    } else if (mensajeLower.includes('test4')) {
        // MÉTODO 4: Imagen en mensaje separado
        console.log('🧪 Probando MÉTODO 4: mensaje separado con imagen');
        respuestas = [
            { message: "🧪 TEST 4: Mensaje separado con imagen" },
            { image: imagenURL }
        ];
        
    } else if (mensajeLower.includes('test5')) {
        // MÉTODO 5: Todos los campos posibles
        console.log('🧪 Probando MÉTODO 5: todos los campos');
        respuestas = [
            { message: "🧪 TEST 5: Múltiples campos de imagen" },
            { 
                message: "Probando todos los formatos:",
                image: imagenURL,
                media: imagenURL,
                imageUrl: imagenURL,
                mediaUrl: imagenURL,
                attachment: imagenURL,
                file: imagenURL
            }
        ];
        
    // ═════════════════════════════════════════════════════════
    // COMANDOS NORMALES
    // ═════════════════════════════════════════════════════════
        
    } else if (mensajeLower.includes('imagen') || mensajeLower.includes('foto') || mensajeLower.includes('picture')) {
        console.log('📸 Enviando imagen - método combinado');
        respuestas = [
            { message: "📸 Aquí está tu imagen:" },
            { 
                image: imagenURL,
                media: imagenURL
            },
            { message: "Si no la ves, aquí está el enlace:\n\n" + imagenURL }
        ];
        
    } else if (mensajeLower.includes('catalogo') || mensajeLower.includes('catálogo') || mensajeLower.includes('producto')) {
        console.log('📱 Enviando catálogo con imagen');
        respuestas = [
            { message: "📱 *Nuestro catálogo de productos*" },
            { 
                message: "Aquí puedes ver nuestros productos:",
                image: imagenURL,
                media: imagenURL
            },
            { message: "¿Qué producto te interesa?" }
        ];
        
    } else if (mensajeLower.includes('hola') || mensajeLower.includes('hi') || mensajeLower.includes('buenos')) {
        respuestas = [
            { message: `¡Hola ${sender}! 👋` },
            { message: "¿En qué puedo ayudarte?\n\n🧪 PRUEBA DE IMÁGENES:\n• test1\n• test2\n• test3\n• test4\n• test5\n\n📋 OTROS:\n• imagen\n• catalogo\n• precio" }
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
            { message: "Comandos disponibles:\n\n🧪 TESTS:\n• test1 - test5\n\n📸 IMÁGENES:\n• imagen\n• catalogo\n\n📋 OTROS:\n• precio\n• horario\n• contacto" }
        ];
    }
    
    // ═══════════════════════════════════════════════════════════
    // FIN DE PROCESAMIENTO
    // ═══════════════════════════════════════════════════════════
    
    console.log(`✅ Respuestas generadas: ${respuestas.length} mensajes`);
    respuestas.forEach((r, i) => {
        const msgPreview = r.message ? r.message.substring(0, 40) : '[solo imagen]';
        const hasImage = r.image || r.media || r.imageUrl || r.mediaUrl;
        console.log(`   ${i + 1}. ${msgPreview}${hasImage ? ' 📸[+imagen]' : ''}...`);
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
        imageTests: {
            test1: 'Campo image',
            test2: 'Campo media',
            test3: 'URL en texto',
            test4: 'Mensaje separado',
            test5: 'Todos los campos'
        }
    });
});

// Endpoint de prueba
app.get('/test', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        message: 'Servidor funcionando correctamente',
        imageURL: 'https://i.imgur.com/sraR9Lu.jpg'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Listo para recibir mensajes de AutoResponder`);
    console.log(`📸 5 métodos de prueba para imágenes disponibles`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
