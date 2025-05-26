//whatsapp.js
import { validarCampos, generarMensajePedido } from './utilsPedido.js';
import { getElements } from './formulario.js';
import { showValidationModal } from './whatsapp_modal.js';

export function enviarPedido() {
    const errores = validarCampos();

    if (errores.length > 0) {
        showValidationModal(errores); // 🔹 Ahora el modal mostrará correctamente el error del monto
        return;
    }

    const elementos = getElements();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const mensajePedido = generarMensajePedido(carrito, elementos);

    // 🔹 Si el usuario elige "Efectivo", agregar cuánto paga y el vuelto
    let datosPago = "";
    if (elementos.metodoPago.value === "Efectivo") {
        const totalValor = parseFloat(elementos.total.textContent.replace(/\./g, ""));
        const montoIngresado = parseFloat(elementos.montoEfectivo.value);

        if (!montoIngresado || isNaN(montoIngresado) || montoIngresado < totalValor) {
            errores.push('Falta ingresar un monto válido con el que pagará');
            showValidationModal(errores);
            return;
        }

        const vuelto = montoIngresado - totalValor;
        datosPago = `💰 *Pago en efectivo:* $${montoIngresado.toLocaleString("es-CL")}  
                     💵 *Vuelto:* $${vuelto.toLocaleString("es-CL")}`;
    }

    // 🔹 Mostrar los datos en el modal antes de enviar
    document.getElementById("resumenPedido").textContent = mensajePedido;
    document.getElementById("datosPago").textContent = datosPago;
    const modalConfirmacion = new bootstrap.Modal(document.getElementById("confirmacionModal"));
    modalConfirmacion.show();

    // 🔹 Asegurar que el evento solo se registre una vez para evitar múltiples envíos
    const confirmarEnvioBtn = document.getElementById("confirmarEnvio");
    confirmarEnvioBtn.removeEventListener("click", enviarMensajeWhatsApp);
    confirmarEnvioBtn.addEventListener("click", enviarMensajeWhatsApp);

    function enviarMensajeWhatsApp() {
        let mensajeFinal = mensajePedido;
        if (datosPago) mensajeFinal += `\n\n${datosPago}`;

        const numeroWhatsApp = '56958052262';
        const mensaje = encodeURIComponent(mensajeFinal);
        const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
        
        window.open(url, '_blank');
    }
}








