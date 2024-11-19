// whatsapp.js
// Variables
const pedidoForm = document.getElementById('pedido-form');
const nombreInput = document.getElementById('nombre');
const telefonoInput = document.getElementById('telefono');
const direccionInput = document.getElementById('direccion');

// Funciones
function enviarPedido() {
  if (validarCampos()) {
    const mensajeWhatsApp = generarMensajeWhatsApp();
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=+56997075934&text=${encodeURIComponent(mensajeWhatsApp)}`;
    window.open(urlWhatsApp, "_blank");
  }
}

function validarCampos() {
  // Validaciones básicas
  if (!nombreInput.value.trim()) {
    alert("El nombre es obligatorio");
    return false;
  }
  if (!telefonoInput.value.trim() || telefonoInput.value.length < 10) {
    alert("El teléfono es obligatorio y debe tener al menos 10 dígitos");
    return false;
  }
  if (!direccionInput.value.trim()) {
    alert("La dirección es obligatoria");
    return false;
  }
  return true;
}

function generarMensajeWhatsApp() {
  // Obtenemos los valores de los campos
  const nombre = nombreInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const direccion = direccionInput.value.trim();
  
  // Obtener los productos del carrito desde localStorage
  const carrito = obtenerCarrito();
  
  // Si el carrito está vacío, notificamos al usuario
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. No puedes hacer un pedido sin productos.");
    return;
  }

  let mensaje = `*Pedido de ${nombre}*%0A`;
  mensaje += `Teléfono: ${telefono}%0A`;
  mensaje += `Dirección: ${direccion}%0A`;
  
  // Añadir productos al mensaje
  mensaje += `%0A*Productos:*%0A`;
  carrito.forEach(item => {
    mensaje += `${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio}%0A`;
  });
  
  return mensaje;
}

function obtenerCarrito() {
  // Intentamos obtener el carrito desde localStorage
  const carritoJSON = localStorage.getItem('carrito');
  
  // Si el carrito no existe, retornamos un arreglo vacío
  if (!carritoJSON) {
    return [];
  }
  
  // Convertimos el carrito JSON de localStorage a un arreglo de objetos
  return JSON.parse(carritoJSON);
}

// Exportar la función
export { enviarPedido };
