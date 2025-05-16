//whatsapp.js
import { showValidationModal } from './whatsapp_modal.js';

// Obtiene los elementos del DOM
function getElements() {
    return {
        nombre: document.getElementById('nombre'),
        telefono: document.getElementById('telefono'),
        direccion: document.getElementById('direccion'),
        tipoEntrega: document.getElementById('tipoentrega'),
        metodoPago: document.getElementById('metodopago'),
        comentario: document.getElementById('comentario'),
        horario: document.getElementById('horario'),
        terminos: document.getElementById('terminos'),
    };
}

// Valida los campos
function validarCampos() {
    const { nombre, telefono, direccion, tipoEntrega, metodoPago, horario, terminos } = getElements();
    const errores = [];

    if (!nombre.value.trim()) errores.push('Nombre');
    if (!telefono.value.trim()) errores.push('Teléfono');
    if (!direccion.value.trim()) errores.push('Dirección');
    if (!tipoEntrega.value) errores.push('Método de entrega');
    if (!metodoPago.value) errores.push('Método de pago');
    if (!horario.value) errores.push('Horario de entrega');
    if (!terminos.checked) errores.push('Aceptar los términos y condiciones');

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) errores.push('Agregar productos al carrito');

    return errores;
}

// Genera el mensaje de pedido
function generarMensajePedido() {
    const { nombre, telefono, direccion, tipoEntrega, metodoPago, comentario, horario } = getElements();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const productosTexto = carrito.map((item, index) =>
        `${item.quantity} de ${item.nombre} X $${item.precio.toLocaleString('es-CL')} = $${(item.precio * item.quantity).toLocaleString('es-CL')}`
    ).join('\n');

    const totalProductos = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const COSTO_ENVIO = 2000;
    let costoEnvio = 0;
    if (tipoEntrega.value === "Domicilio") {
        costoEnvio = COSTO_ENVIO;
    }
    const totalConEnvio = totalProductos + costoEnvio;

    return `
Hola, soy *${nombre.value.trim()}* y quiero realizar un pedido. A continuación, los detalles:

📞 Teléfono: ${telefono.value.trim()}
📍 Dirección: ${direccion.value.trim()}
🚚 Tipo de Entrega: ${tipoEntrega.value}
💳 Método de Pago: ${metodoPago.value}
⏰ *Horario de entrega:* ${horario.value} (Sujeto a disponibilidad)

🛒 *Productos del Carrito:*
${productosTexto}

${tipoEntrega.value === "Domicilio" ? `📦 Costo de envío: $${costoEnvio.toLocaleString('es-CL')}\n` : ''}
💰 *Total a pagar:* $${totalConEnvio.toLocaleString('es-CL')}

📝 Comentarios adicionales: ${comentario.value.trim() || 'Sin comentarios'}
`;
}

// Envía el pedido a WhatsApp
export function enviarPedido() {
    const errores = validarCampos();
    if (errores.length > 0) {
        showValidationModal(errores.map(error => `Falta completar: ${error}`));
        return;
    }

    const mensaje = generarMensajePedido();
    const numeroWhatsApp = '56997075934';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    if (confirm("¿Quieres abrir WhatsApp para enviar tu pedido?")) {
        window.open(url, '_blank');
    } else {
        alert("Pedido cancelado. Puedes seguir navegando en nuestra tienda.");
    }
}
