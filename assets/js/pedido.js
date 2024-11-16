
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
  // Validaciones...
}

function generarMensajeWhatsApp() {
  // Generar mensaje...
}

export { enviarPedido };