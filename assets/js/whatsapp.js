
import { showValidationModal, closeValidationModal } from './whatsapp_modal.js';

export function enviarPedido() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const nombre = document.getElementById('nombre')?.value.trim();
  const telefono = document.getElementById('telefono')?.value.trim();
  const direccion = document.getElementById('direccion')?.value.trim();
  const tipoEntrega = document.getElementById('tipoentrega')?.value;
  const metodoPago = document.getElementById('metodopago')?.value;
  const comentario = document.getElementById('comentario')?.value.trim() || 'Sin comentarios';
  const horario = document.getElementById('horario')?.value; // Obtiene el horario seleccionado
  const terminosAceptados = document.getElementById('terminos')?.checked;

  const errores = [];

  // Validaciones
  if (!nombre) errores.push('Nombre');
  if (!telefono) errores.push('Teléfono');
  if (!direccion) errores.push('Dirección');
  if (!tipoEntrega) errores.push('Método de entrega');
  if (!metodoPago) errores.push('Método de pago');
  if (!horario) errores.push('Horario de entrega'); // Validar que el horario fue seleccionado
  if (!terminosAceptados) errores.push('Aceptar los términos y condiciones');
  if (carrito.length === 0) errores.push('Agregar productos al carrito');

  // Si hay errores, mostrar el modal con los errores
  if (errores.length > 0) {
      showValidationModal(errores.map(error => `Falta completar: ${error}`));
      return; // Detener la ejecución si hay errores
  }

  // Generar el mensaje de pedido para los productos
  const productosTexto = carrito.map((item, index) =>
      `${item.quantity} de ${item.nombre} X $${item.precio.toLocaleString('es-CL')} = $${(item.precio * item.quantity).toLocaleString('es-CL')}`
  ).join('\n');

  // Calcular el total de productos
  const totalProductos = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  // Definir el costo de envío
  const COSTO_ENVIO = 2000;
  let costoEnvio = 0;
  if (tipoEntrega === "Domicilio") {
    costoEnvio = COSTO_ENVIO;
  }
  // Sumar el costo de envío al total
  const totalConEnvio = totalProductos + costoEnvio;

  // Generar el mensaje de pedido incluyendo el costo de envío
  const mensaje = `
Hola, soy *${nombre}* y quiero realizar un pedido. A continuación, los detalles:

📞 Teléfono: ${telefono}
📍 Dirección: ${direccion}
🚚 Tipo de Entrega: ${tipoEntrega}
💳 Método de Pago: ${metodoPago}
⏰ *Horario de entrega:* ${horario} (Sujeto a disponibilidad)

🛒 *Productos del Carrito:*
${productosTexto}

${tipoEntrega === "Domicilio" ? `📦 Costo de envío: $${costoEnvio.toLocaleString('es-CL')}\n` : ''}
💰 *Total a pagar:* $${totalConEnvio.toLocaleString('es-CL')}

📝 Comentarios adicionales: ${comentario}
`;

  const numeroWhatsApp = '56997075934'; // Cambia este número por el del negocio
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
  

