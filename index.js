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
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Max-Age', '3600');
    res.header('Access-Control-Allow-Headers', '*');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓN DE IMÁGENES
// ═══════════════════════════════════════════════════════════

// Imagen principal de Supabase
const imagenPrincipal = "https://bvupglaubbjzntbwercu.supabase.co/storage/v1/object/public/billboard/Gemini_Generated_Image_5vl95r5vl95r5vl9.png";

// Puedes agregar más imágenes aquí
const imagenes = {
    principal: imagenPrincipal,
    catalogo: imagenPrincipal,  // Cambiar cuando tengas otra imagen
    producto1: imagenPrincipal, // Ejemplo para múltiples productos
};

// ═══════════════════════════════════════════════════════════

// Página de inicio
app.get('/', (req, res) => {
    res.send(`
        <h1>✅ Servidor WhatsApp funcionando!</h1>
        <p>Servidor activo y listo para recibir mensajes de AutoResponder</p>
        <p>Endpoint: POST /webhook</p>
        <hr>
        <h3>🧪 Tests de imágenes:</h3>
        <ul>
            <li><strong>test1</strong> - Método campo 'image'</li>
            <li><strong>test2</strong> - Método campo 'media'</li>
            <li><strong>test3</strong> - Método URL en texto</li>
            <li><strong>test4</strong> - Método mensaje separado</li>
            <li><strong>testcompleto</strong> - Todos los métodos</li>
        </ul>
        <hr>
        <h3>📸 Comandos con imágenes:</h3>
        <ul>
            <li><strong>imagen</strong> - Enviar imagen</li>
            <li><strong>foto</strong> - Enviar imagen</li>
            <li><strong>catalogo</strong> - Catálogo con imagen</li>
            <li><strong>producto</strong> - Producto con imagen</li>
        </ul>
        <hr>
        <h3>📋 Otros comandos:</h3>
        <ul>
            <li><strong>hola</strong> - Saludo con menú</li>
            <li><strong>precio</strong> - Lista de precios</li>
            <li><strong>horario</strong> - Horarios de atención</li>
            <li><strong>contacto</strong> - Información de contacto</li>
            <li><strong>gracias</strong> - Despedida cortés</li>
            <li><strong>adios</strong> - Despedida</li>
        </ul>
        <hr>
        <h3>🔗 Imagen configurada:</h3>
        <p><img src="${imagenPrincipal}" style="max-width: 300px; border: 2px solid #ccc; border-radius: 8px;"></p>
        <p><strong>URL:</strong> ${imagenPrincipal}</p>
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
    const sender = req.body.query.sender;
    const message = req.body.query.message;
    const isGroup = req.body.query.isGroup;
    
    console.log(`👤 De: ${sender}`);
    console.log(`💬 Mensaje: ${message}`);
    console.log(`👥 Es grupo: ${isGroup}`);
    
    // ═══════════════════════════════════════════════════════════
    // PROCESAR MENSAJES Y GENERAR RESPUESTAS
    // ═══════════════════════════════════════════════════════════
    
    const mensajeLower = message.toLowerCase().trim();
    let respuestas = [];
    
    // ═════════════════════════════════════════════════════════
    // PRUEBAS DE MÉTODOS PARA ENVIAR IMÁGENES
    // ═════════════════════════════════════════════════════════
    
    if (mensajeLower.includes('test1')) {
        console.log('🧪 TEST 1: Campo image');
        respuestas = [
            { message: "🧪 TEST 1: Usando campo 'image'" },
            { 
                message: "Si ves la imagen, el método 1 funciona ✅",
                image: imagenPrincipal
            }
        ];
        
    } else if (mensajeLower.includes('test2')) {
        console.log('🧪 TEST 2: Campo media');
        respuestas = [
            { message: "🧪 TEST 2: Usando campo 'media'" },
            { 
                message: "Si ves la imagen, el método 2 funciona ✅",
                media: imagenPrincipal
            }
        ];
        
    } else if (mensajeLower.includes('test3')) {
        console.log('🧪 TEST 3: URL en texto');
        respuestas = [
            { message: `🧪 TEST 3: URL en el mensaje\n\nSi WhatsApp muestra vista previa, el método 3 funciona ✅\n\n${imagenPrincipal}` }
        ];
        
    } else if (mensajeLower.includes('test4')) {
        console.log('🧪 TEST 4: Mensaje separado');
        respuestas = [
            { message: "🧪 TEST 4: Imagen en mensaje separado" },
            { image: imagenPrincipal },
            { message: "Si viste la imagen arriba, el método 4 funciona ✅" }
        ];
        
    } else if (mensajeLower.includes('testcompleto')) {
        console.log('🧪 TEST COMPLETO: Todos los campos');
        respuestas = [
            { message: "🧪 TEST COMPLETO: Probando todos los campos posibles" },
            { 
                message: "Múltiples campos de imagen:",
                image: imagenPrincipal,
                media: imagenPrincipal,
                imageUrl: imagenPrincipal,
                mediaUrl: imagenPrincipal,
                file: imagenPrincipal,
                attachment: imagenPrincipal
            },
            { message: "Si viste la imagen, al menos uno de los métodos funciona ✅" }
        ];
        
    // ═════════════════════════════════════════════════════════
    // COMANDOS NORMALES CON IMÁGENES
    // ═════════════════════════════════════════════════════════
        
    } else if (mensajeLower.includes('imagen') || mensajeLower.includes('foto') || mensajeLower.includes('picture')) {
        console.log('📸 Enviando imagen');
        respuestas = [
            { message: "📸 Aquí está tu imagen:" },
            { 
                image: imagenPrincipal,
                media: imagenPrincipal
            }
        ];
        
    } else if (mensajeLower.includes('catalogo') || mensajeLower.includes('catálogo')) {
        console.log('📱 Enviando catálogo');
        respuestas = [
            { message: "📱 *Nuestro catálogo de productos*" },
            { 
                message: "Aquí puedes ver nuestros productos destacados:",
                image: imagenes.catalogo,
                media: imagenes.catalogo
            },
            { message: "¿Qué producto te interesa?\n\nEscribe 'precio' para ver nuestros planes." }
        ];
        
    } else if (mensajeLower.includes('producto')) {
        console.log('🏷️ Enviando producto');
        respuestas = [
            { message: "🏷️ *Producto destacado*" },
            { 
                image: imagenes.producto1,
                media: imagenes.producto1
            },
            { message: "Este es uno de nuestros productos más populares.\n\n¿Te gustaría saber el precio?" }
        ];
        
    // ═════════════════════════════════════════════════════════
    // COMANDOS SIN IMÁGENES
    // ═════════════════════════════════════════════════════════
        
    } else if (mensajeLower.includes('hola') || mensajeLower.includes('hi') || mensajeLower.includes('buenos')) {
        respuestas = [
            { message: `¡Hola ${sender}! 👋` },
            { message: "¿En qué puedo ayudarte hoy?\n\n📋 *Menú de opciones:*\n\n🧪 TESTS:\n• test1, test2, test3, test4\n• testcompleto\n\n📸 CON IMÁGENES:\n• imagen / foto\n• catalogo\n• producto\n\n📋 INFORMACIÓN:\n• precio\n• horario\n• contacto" }
        ];
        
    } else if (mensajeLower.includes('precio') || mensajeLower.includes('costo') || mensajeLower.includes('cuanto')) {
        respuestas = [
            { message: `Hola ${sender}, estos son nuestros precios:` },
            { message: "💰 *PLANES DISPONIBLES:*\n\n📦 Plan Básico\n$10/mes\n\n⭐ Plan Premium\n$25/mes\n\n🚀 Plan Empresarial\n$50/mes" },
            { message: "¿Cuál plan te interesa?\n\nEscribe 'catalogo' para ver imágenes de nuestros productos." }
        ];
        
    } else if (mensajeLower.includes('horario') || mensajeLower.includes('hora') || mensajeLower.includes('atiende')) {
        respuestas = [
            { message: "⏰ *Horarios de atención:*" },
            { message: "🗓️ Lunes a Viernes\n9:00 AM - 6:00 PM\n\n🗓️ Sábados\n10:00 AM - 2:00 PM\n\n🗓️ Domingos\nCerrado" },
            { message: "¿Necesitas algo más?" }
        ];
        
    } else if (mensajeLower.includes('contacto') || mensajeLower.includes('telefono') || mensajeLower.includes('teléfono')) {
        respuestas = [
            { message: "📞 *Datos de contacto:*" },
            { message: "☎️ Teléfono: +1 234 567 8900\n📧 Email: info@ejemplo.com\n🌐 Web: www.ejemplo.com" },
            { message: "Estamos aquí para ayudarte." }
        ];
        
    } else if (mensajeLower.includes('gracias') || mensajeLower.includes('thank')) {
        respuestas = [
            { message: `¡De nada, ${sender}! 😊` },
            { message: "Fue un placer ayudarte. Si necesitas algo más, aquí estaré." }
        ];
        
    } else if (mensajeLower.includes('adios') || mensajeLower.includes('chao') || mensajeLower.includes('bye')) {
        respuestas = [
            { message: `¡Hasta luego, ${sender}! 👋` },
            { message: "Que tengas un excelente día. ¡Vuelve pronto!" }
        ];
        
    } else if (mensajeLower.includes('menu') || mensajeLower.includes('menú') || mensajeLower.includes('ayuda') || mensajeLower.includes('help')) {
        respuestas = [
            { message: "📋 *MENÚ DE COMANDOS*" },
            { message: "🧪 *TESTS DE IMÁGENES:*\ntest1, test2, test3, test4, testcompleto\n\n📸 *COMANDOS CON IMÁGENES:*\nimagen, foto, catalogo, producto\n\n📋 *INFORMACIÓN:*\nprecio, horario, contacto\n\n👋 *OTROS:*\nhola, gracias, adios" }
        ];
        
    } else {
        // Respuesta por defecto
        respuestas = [
            { message: `Hola ${sender}, recibí tu mensaje: "${message}"` },
            { message: "No estoy seguro de qué necesitas. 🤔" },
            { message: "Escribe 'menu' para ver todos los comandos disponibles, o 'hola' para empezar." }
        ];
    }
    
    // ═══════════════════════════════════════════════════════════
    // FIN DE PROCESAMIENTO
    // ═══════════════════════════════════════════════════════════
    
    console.log(`✅ Respuestas generadas: ${respuestas.length} mensajes`);
    respuestas.forEach((r, i) => {
        const msgPreview = r.message ? r.message.substring(0, 50) : '[solo imagen]';
        const hasImage = r.image || r.media;
        console.log(`   ${i + 1}. ${msgPreview}${hasImage ? ' 📸' : ''}...`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Enviar respuesta
    res.status(200).json({
        replies: respuestas
    });
});

// Endpoint GET
app.get('/webhook', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Webhook activo',
        imageUrl: imagenPrincipal
    });
});

// Endpoint de prueba
app.get('/test', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        imageUrl: imagenPrincipal
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Listo para recibir mensajes de AutoResponder`);
    console.log(`📸 Imagen Supabase configurada ✅`);
    console.log(`🔗 ${imagenPrincipal}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
