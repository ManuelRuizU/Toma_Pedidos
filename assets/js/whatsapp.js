
// Importar la variable carrito desde carrito.js
import { carrito } from './carrito.js';  // Ruta relativa correcta


// Función para enviar el pedido
function enviarPedido() {
    const numeroWhatsApp = "+56958052262";  // Número de WhatsApp al que se enviará el pedido

    // Verificar que el carrito no esté vacío
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de enviar el pedido.");
        return;
    }

    // Construir el mensaje con los productos en el carrito
    let mensaje = `¡Hola! Quiero realizar el siguiente pedido:\n\n`;

    carrito.forEach(item => {
        mensaje += `- ${item.nombre} x${item.quantity} = $${(item.quantity * item.precio).toFixed(2)}\n`;
    });

    // Aquí puedes agregar más detalles, como los datos del cliente

    // Codificar el mensaje para la URL
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp
    window.open(url, "_blank");
}


export{enviarPedido};