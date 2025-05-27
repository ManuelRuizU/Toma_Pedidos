//whatsapp.js
import { validarCampos, generarMensajePedido } from './utilsPedido.js';
import { getElements } from './formulario.js';
import { showValidationModal } from './whatsapp_modal.js';

export function enviarPedido() {
    const errores = validarCampos();

    if (errores.length > 0) {
        showValidationModal(errores);
        return;
    }

    const elementos = getElements();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const mensajePedido = generarMensajePedido(carrito, elementos);

    let datosPago = "";
    if (elementos.metodoPago.value === "Efectivo") {
        const totalValor = parseFloat(elementos.total.textContent.replace(/\./g, ""));
        const montoIngresado = parseFloat(elementos.montoEfectivo.value);
        datosPago = `💰 *Pago en efectivo:* $${montoIngresado.toLocaleString("es-CL")}\n` +
                    `💵 *Vuelto:* $${(montoIngresado - totalValor).toLocaleString("es-CL")}`;
    }

    let linkMapa = '';
    if (elementos.tipoEntrega.value === 'Domicilio') {
        const direccion = elementos.differentDeliveryAddress.checked && elementos.deliveryAddress.value.trim()
            ? elementos.deliveryAddress.value.trim()
            : elementos.direccion.value.trim();
        const direccionEncoded = encodeURIComponent(direccion);
        linkMapa = `📍 *Ubicación en Google Maps:* https://www.google.com/maps/search/?api=1&query=${direccionEncoded}`;
    }

    document.getElementById("resumenPedido").textContent = mensajePedido;
    document.getElementById("datosPago").textContent = datosPago;
    document.getElementById("linkMapa").textContent = linkMapa;
    document.getElementById("totalConfirmacion").textContent = elementos.total.textContent;

    const modalConfirmacion = new bootstrap.Modal(document.getElementById("confirmacionModal"));
    modalConfirmacion.show();

    const confirmarEnvioBtn = document.getElementById("confirmarEnvio");
    confirmarEnvioBtn.replaceWith(confirmarEnvioBtn.cloneNode(true));
    document.getElementById("confirmarEnvio").addEventListener("click", () => {
        let mensajeFinal = mensajePedido;
        if (datosPago) mensajeFinal += `\n\n${datosPago}`;
        if (linkMapa) mensajeFinal += `\n\n${linkMapa}`;
        const numeroWhatsApp = '56958052262';
        const mensaje = encodeURIComponent(mensajeFinal);
        window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
    });
}








