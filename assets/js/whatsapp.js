//whatsapp.js
// whatsapp.js

import { validarCampos, getElements } from './formulario.js';
import { showValidationModal, closeValidationModal } from './whatsapp_modal.js';



// Genera el mensaje de pedido para WhatsApp
function generarMensajePedido() {
    const { nombre, telefono, direccion, tipoEntrega, metodoPago, comentario, horario } = getElements();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const productosTexto = carrito.map((item) =>
        `${item.quantity} de ${item.nombre} X $${item.precio.toLocaleString('es-CL')} = $${(item.precio * item.quantity).toLocaleString('es-CL')}`
    ).join('\n');

    const totalProductos = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const COSTO_ENVIO = 2000;
    let costoEnvio = tipoEntrega.value === "Domicilio" ? COSTO_ENVIO : 0;
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

// 🔹 Función para enviar el pedido a WhatsApp
export function enviarPedido() {
    const errores = validarCampos();
    if (errores.length > 0) {
        showValidationModal(errores.map(error => `Falta completar: ${error}`));
        return;
    }

    const esMovil = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const numeroWhatsApp = '56997075934';
    const mensaje = encodeURIComponent(generarMensajePedido()); // 🔹 Usa el mensaje generado
    const url = esMovil ? `whatsapp://send?phone=${numeroWhatsApp}&text=${mensaje}` : `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

    // 🔹 Solo abrir WhatsApp si el usuario confirma
    if (confirm("¿Quieres abrir WhatsApp para enviar tu pedido?")) {
        window.location.href = url; // 🔹 Se ejecuta SOLO después de confirmar
    } else {
        alert("Pedido cancelado. Puedes seguir navegando en nuestra tienda.");
    }
}

