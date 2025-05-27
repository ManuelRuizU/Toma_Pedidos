// utilsPedido.js
import { getElements } from './formulario.js';
import { addressValidated, showMessage } from './mapValidator.js';

function validarTelefono(telefono) {
    const numeroTelefono = telefono.replace(/^\+56 /, '');
    const regex = /^9\d{8}$/;
    return regex.test(numeroTelefono);
}

export function validarCampos() {
    const { nombre, telefono, direccion, deliveryAddress, differentDeliveryAddress, tipoEntrega, metodoPago, horario, terminos, montoEfectivo, total } = getElements();
    const errores = [];

    if (!nombre.value.trim()) errores.push('Nombre');
    if (!telefono.value.trim() || !validarTelefono(telefono.value)) errores.push('Teléfono inválido');
    if (!tipoEntrega.value) errores.push('Método de entrega');
    if (!metodoPago.value) errores.push('Método de pago');
    if (!horario.value) errores.push('Horario de entrega');
    if (!terminos.checked) errores.push('Aceptar los términos y condiciones');

    if (tipoEntrega.value === 'Domicilio') {
        if (!direccion.value.trim()) {
            errores.push('Dirección del cliente (faltante para domicilio)');
        }
        if (differentDeliveryAddress.checked) {
            if (!deliveryAddress.value.trim()) {
                errores.push('Dirección de despacho (faltante)');
            } else if (!addressValidated) {
                errores.push('Dirección de despacho no validada por el mapa. Por favor, haz clic en "Validar Dirección".');
                showMessage('La dirección de despacho no ha sido validada. Por favor, haz clic en "Validar Dirección".', 'error');
            }
        } else if (!addressValidated) {
            errores.push('Dirección del cliente no validada por el mapa. Por favor, haz clic en "Validar Dirección".');
            showMessage('La dirección del cliente no ha sido validada. Por favor, haz clic en "Validar Dirección".', 'error');
        }
    }

    if (metodoPago.value === "Efectivo") {
        const totalValor = parseFloat(total.textContent.replace(/\./g, ""));
        const montoIngresado = parseFloat(montoEfectivo.value);

        if (!montoEfectivo.value.trim()) {
            errores.push('Falta ingresar el monto con el que pagará');
        } else if (isNaN(montoIngresado) || montoIngresado < totalValor) {
            errores.push('Monto insuficiente para pagar el pedido');
        }
    }

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) errores.push('Agregar productos al carrito');

    return errores;
}

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

    const direccion = elementos.differentDeliveryAddress.checked && elementos.deliveryAddress.value.trim()
        ? elementos.deliveryAddress.value.trim()
        : elementos.direccion.value.trim();

    return `
¡Hola! Soy *${elementos.nombre.value.trim()}* y quiero hacer un pedido. 😃  

📍 *Dirección del cliente:* ${elementos.direccion.value.trim()}  
${elementos.differentDeliveryAddress.checked ? `🚚 *Dirección de despacho:* ${direccion}  ` : ''}  
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




