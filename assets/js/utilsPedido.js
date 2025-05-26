
// utilsPedido.js

// utilsPedido.js

import { getElements } from './formulario.js';
// ✅ Importa la bandera de validación de dirección y showMessage desde mapValidator.js
import { addressValidated, showMessage } from './mapValidator.js';


/**
 * Valida el teléfono.
 * @param {string} telefono - El número de teléfono a validar.
 * @returns {boolean} - True si el teléfono es válido, false de lo contrario.
 */
function validarTelefono(telefono) {
    const numeroTelefono = telefono.replace(/^\+56 /, '');
    const regex = /^9\d{8}$/;
    if (regex.test(numeroTelefono)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Valida los campos del formulario antes de enviar el pedido.
 * @returns {array} Un arreglo con los errores encontrados.
 */
export function validarCampos() {
    const { nombre, telefono, direccion, tipoEntrega, metodoPago, horario, terminos, montoEfectivo, total } = getElements();
    const errores = [];

    // Valida los campos requeridos básicos
    if (!nombre.value.trim()) errores.push('Nombre');
    if (!telefono.value.trim() || !validarTelefono(telefono.value)) errores.push('Teléfono inválido');
    if (!tipoEntrega.value) errores.push('Método de entrega');
    if (!metodoPago.value) errores.push('Método de pago');
    if (!horario.value) errores.push('Horario de entrega');
    if (!terminos.checked) errores.push('Aceptar los términos y condiciones');

    // ✅ Validación específica para la dirección de domicilio
    if (tipoEntrega.value === 'Domicilio') {
        if (!direccion.value.trim()) {
            errores.push('Dirección (faltante para domicilio)');
        } else if (!addressValidated) { // ✅ Verifica la bandera de validación de Google Maps
            errores.push('Dirección no validada por el mapa. Por favor, haz clic en "Validar Dirección".');
            // Opcional: También puedes mostrar un mensaje visual en el div de mensajes de dirección
            showMessage('La dirección no ha sido validada por el mapa. Por favor, haz clic en "Validar Dirección".', 'error');
        }
    }

    // Valida el monto si se selecciona "Efectivo"
    if (metodoPago.value === "Efectivo") {
        const totalValor = parseFloat(total.textContent.replace(/\./g, ""));
        const montoIngresado = parseFloat(montoEfectivo.value);

        if (!montoEfectivo.value.trim()) {
            errores.push('Falta ingresar el monto con el que pagará');
        } else if (isNaN(montoIngresado) || montoIngresado < totalValor) {
            errores.push('Monto insuficiente para pagar el pedido');
        }
    }

    // Valida que el carrito no esté vacío
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) errores.push('Agregar productos al carrito');

    return errores;
}

// Generar el mensaje de pedido para WhatsApp (sin cambios necesarios aquí para la validación)
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


