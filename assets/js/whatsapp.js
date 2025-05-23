//whatsapp.js
import { validarCampos, generarMensajePedido } from './utilsPedido.js';
import { showValidationModal } from './whatsapp_modal.js';
import { getElements } from './formulario.js';

// Enviar mensaje por WhatsApp
export function enviarPedido() {
    const errores = validarCampos();
    if (errores.length > 0) {
        alert("Falta completar algunos campos."); // O usar un modal de validación
        return;
    }

    const elementos = getElements();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const mensajePedido = generarMensajePedido(carrito, elementos);

    document.getElementById("resumenPedido").textContent = mensajePedido;
    new bootstrap.Modal(document.getElementById("confirmacionModal")).show();

    // Evento para enviar a WhatsApp solo cuando el usuario confirma
    document.getElementById("confirmarEnvio").addEventListener("click", () => {
        const numeroWhatsApp = '56997075934';
        const mensaje = encodeURIComponent(mensajePedido);
        const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
        window.open(url, '_blank');
    });
}


    const elementos = getElements();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const mensajePedido = generarMensajePedido(carrito, elementos);

    const numeroWhatsApp = '56997075934';
    const mensaje = encodeURIComponent(mensajePedido);
    const esMovil = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const url = esMovil ? `whatsapp://send?phone=${numeroWhatsApp}&text=${mensaje}` : `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

    window.open(url, '_blank');





