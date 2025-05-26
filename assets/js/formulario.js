// formulario.js
// Importa la función showValidationModal desde whatsapp_modal.js
import { showValidationModal } from './whatsapp_modal.js';

/**
 * Obtiene los elementos del formulario.
 * @returns {object} Un objeto con los elementos del formulario.
 */
export function getElements() {
    return {
        nombre: document.getElementById('nombre'),
        telefono: document.getElementById('telefono'),
        direccion: document.getElementById('direccion'),
        tipoEntrega: document.getElementById('tipoentrega'),
        metodoPago: document.getElementById('metodopago'),
        comentario: document.getElementById('comentario'),
        horario: document.getElementById('horario'),
        terminos: document.getElementById('terminos'),
        montoEfectivo: document.getElementById('montoEfectivo'),
        montoEfectivoContainer: document.getElementById('montoEfectivoContainer'),
        vueltoCalculado: document.getElementById('vueltoCalculado'),
        total: document.getElementById('total'),
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const { telefono } = getElements();

    // Agrega evento de input para evitar que se borre el prefijo +56
    telefono.addEventListener('input', function() {
        if (!this.value.startsWith('+56 ')) {
            this.value = '+56 ';
        }
    });

    // Obtiene los elementos del formulario
    const { metodoPago, montoEfectivoContainer, montoEfectivo, vueltoCalculado, total } = getElements();

    // Agrega evento de blur a los campos del formulario
    document.querySelectorAll("#pedido-formulario input, #pedido-formulario select").forEach((campo) => {
        campo.addEventListener("blur", () => {
            // Resalta el campo si está vacío
            if (!campo.value.trim()) {
                campo.classList.add("is-invalid");
            } else {
                campo.classList.remove("is-invalid");
            }
        });
    });

    // Muestra el campo de monto si se selecciona "Efectivo"
    if (metodoPago) {
        metodoPago.addEventListener("change", () => {
            montoEfectivoContainer.style.display = metodoPago.value === "Efectivo" ? "block" : "none";
        });
    }

    // Calcula y muestra el vuelto en tiempo real
    if (montoEfectivo) {
        montoEfectivo.addEventListener("input", () => {
            const totalValor = parseFloat(total.textContent.replace(/\./g, ""));
            const montoIngresado = parseFloat(montoEfectivo.value);

            if (!isNaN(montoIngresado) && montoIngresado >= totalValor) {
                const vuelto = montoIngresado - totalValor;
                vueltoCalculado.textContent = `💵 Vuelto: $${vuelto.toLocaleString("es-CL")}`;
                vueltoCalculado.classList.remove("text-danger");
                vueltoCalculado.classList.add("text-success");
            } else {
                vueltoCalculado.textContent = "⚠️ Monto insuficiente para pagar el pedido";
                vueltoCalculado.classList.remove("text-success");
                vueltoCalculado.classList.add("text-danger");
            }
        });
    }
});


