//whatsapp.js
// whatsapp.js

import { validarCampos, getElements } from './formulario.js';
import { showValidationModal, closeValidationModal } from './whatsapp_modal.js';



// Genera el mensaje de pedido para WhatsApp
function generarMensajePedido() {
    const { nombre, telefono, direccion, tipoEntrega, metodoPago, comentario, horario } = getElements();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        return "📌 No hay productos en tu carrito. Agrega algunos para realizar tu pedido. 😊";
    }

    const productosTexto = carrito.map((item) =>
        `🛍️ ${item.quantity}x *${item.nombre}* - $${(item.precio * item.quantity).toLocaleString('es-CL')}`
    ).join("\n");

    const totalProductos = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const COSTO_ENVIO = 2000;
    let costoEnvio = tipoEntrega.value === "Domicilio" ? COSTO_ENVIO : 0;
    const totalConEnvio = totalProductos + costoEnvio;

    return `
¡Hola! Soy *${nombre.value.trim()}* y quiero hacer un pedido. 😃  

📍 *Dirección:* ${direccion.value.trim()}  
📞 *Teléfono:* ${telefono.value.trim()}  
🚚 *Entrega:* ${tipoEntrega.value}  
💳 *Pago:* ${metodoPago.value}  
⏰ *Horario:* ${horario.value}  

🛒 *Productos en el carrito:*  
${productosTexto}

${tipoEntrega.value === "Domicilio" ? `📦 *Costo de envío:* $${costoEnvio.toLocaleString('es-CL')}\n` : ''}  
💰 *Total a pagar:* $${totalConEnvio.toLocaleString('es-CL')}  

📝 *Comentarios:* ${comentario.value.trim() || "Sin comentarios"}  

✅ ¿Confirmamos el pedido? Espero tu respuesta. 😃  
`;
}

// 🔹 Optimización del envío del mensaje a WhatsApp
export function enviarPedido() {
    const errores = validarCampos();
    if (errores.length > 0) {
        showValidationModal(errores.map(error => `Falta completar: ${error}`));
        return;
    }

    const mensajePedido = generarMensajePedido();
    const numeroWhatsApp = '56997075934';
    const mensaje = encodeURIComponent(mensajePedido);
    const esMovil = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const url = esMovil 
        ? `whatsapp://send?phone=${numeroWhatsApp}&text=${mensaje}` 
        : `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

    // 🔹 Si está en móvil, abrir directamente la app de WhatsApp
    if (esMovil) {
        window.location.href = url;
    } else {
        // 🔹 En PC, preguntar antes de abrir WhatsApp Web
        if (confirm("¿Quieres abrir WhatsApp para enviar tu pedido?")) {
            window.open(url, '_blank');
        } else {
            alert("Pedido cancelado. Puedes seguir navegando en nuestra tienda.");
        }
    }
}



