
// utilsPedido.js

import { getElements } from './formulario.js';


// Validar que todos los campos requeridos están completos
export function validarCampos() {
    const errores = [];
    const elementos = getElements();

    if (!elementos.nombre.value.trim()) errores.push("Nombre");
    if (!elementos.telefono.value.trim() || !/^\d+$/.test(elementos.telefono.value)) errores.push("Teléfono válido");
    if (!elementos.direccion.value.trim()) errores.push("Dirección");
    if (!elementos.tipoEntrega.value) errores.push("Tipo de entrega");
    if (!elementos.metodoPago.value) errores.push("Método de pago");
    if (!elementos.horario.value) errores.push("Horario");

    return errores;
}


// Generar el mensaje de pedido para WhatsApp
export function generarMensajePedido(carrito, elementos, costoEnvio = 2000) {
    if (!carrito || carrito.length === 0) {
        return "📌 No hay productos en tu carrito. Agrega algunos para realizar tu pedido. 😊";
    }

    const productosTexto = carrito.map(item =>
        `🛍️ ${item.quantity}x *${item.nombre}* - $${(item.precio * item.quantity).toLocaleString('es-CL')}`
    ).join("\n");

    const totalProductos = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    let costoEnvioCalculado = elementos.tipoEntrega.value === "Domicilio" ? costoEnvio : 0;
    const totalConEnvio = totalProductos + costoEnvioCalculado;

    return `
¡Hola! Soy *${elementos.nombre.value.trim()}* y quiero hacer un pedido. 😃  

📍 *Dirección:* ${elementos.direccion.value.trim()}  
📞 *Teléfono:* ${elementos.telefono.value.trim()}  
🚚 *Entrega:* ${elementos.tipoEntrega.value}  
💳 *Pago:* ${elementos.metodoPago.value}  
⏰ *Horario:* ${elementos.horario.value}  

🛒 *Productos en el carrito:*  
${productosTexto}

${elementos.tipoEntrega.value === "Domicilio" ? `📦 *Costo de envío:* $${costoEnvioCalculado.toLocaleString('es-CL')}\n` : ''}  
💰 *Total a pagar:* $${totalConEnvio.toLocaleString('es-CL')}  

📝 *Comentarios:* ${elementos.comentario.value.trim() || "Sin comentarios"}  

✅ ¿Confirmamos el pedido? Espero tu respuesta. 😃  
`;
}
