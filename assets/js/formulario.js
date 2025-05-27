// formulario.js
import { showValidationModal } from './whatsapp_modal.js';
import { handleTipoEntregaChange } from './mapValidator.js';

export function getElements() {
    return {
        nombre: document.getElementById('nombre'),
        telefono: document.getElementById('telefono'),
        direccion: document.getElementById('direccion'),
        deliveryAddress: document.getElementById('deliveryAddress'),
        differentDeliveryAddress: document.getElementById('differentDeliveryAddress'),
        deliveryAddressContainer: document.getElementById('deliveryAddressContainer'),
        tipoEntrega: document.getElementById('tipoentrega'),
        metodoPago: document.getElementById('metodopago'),
        comentario: document.getElementById('comentario'),
        horario: document.getElementById('horario'),
        terminos: document.getElementById('terminos'),
        montoEfectivo: document.getElementById('montoEfectivo'),
        montoEfectivoContainer: document.getElementById('montoEfectivoContainer'),
        vueltoCalculado: document.getElementById('vueltoCalculado'),
        total: document.getElementById('total'),
        validateAddressBtn: document.getElementById('validateAddressBtn'),
        addressMessageDiv: document.getElementById('address-message'),
        mapContainer: document.getElementById('map-container')
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const { telefono, metodoPago, montofectivoContainer, montoEfectivo, vueltoCalculado, total, tipoEntrega, differentDeliveryAddress, deliveryAddressContainer, deliveryAddress } = getElements();

    // Restaurar dirección de despacho y método de pago desde localStorage
    if (deliveryAddress) {
        deliveryAddress.value = localStorage.getItem('deliveryAddress') || '';
        differentDeliveryAddress.checked = !!localStorage.getItem('deliveryAddress');
        deliveryAddressContainer.style.display = differentDeliveryAddress.checked ? 'block' : 'none';
    }
    if (metodoPago) {
        metodoPago.value = localStorage.getItem('metodoPago') || '';
    }

    // Manejar checkbox de dirección de despacho diferente
    if (differentDeliveryAddress) {
        differentDeliveryAddress.addEventListener('change', () => {
            deliveryAddressContainer.style.display = differentDeliveryAddress.checked ? 'block' : 'none';
            if (!differentDeliveryAddress.checked) {
                deliveryAddress.value = '';
                localStorage.removeItem('deliveryAddress');
                handleTipoEntregaChange();
            }
        });

        deliveryAddress.addEventListener('input', () => {
            localStorage.setItem('deliveryAddress', deliveryAddress.value);
        });
    }

    // Evitar borrar el prefijo +56
    telefono.addEventListener('input', function() {
        if (!this.value.startsWith('+56 ')) {
            this.value = '+56 ';
        }
    });

    // Validación en tiempo real para campos requeridos
    document.querySelectorAll("#pedido-formulario input, #pedido-formulario select").forEach((campo) => {
        campo.addEventListener("blur", () => {
            if (campo.value.trim() === '' && campo.required) {
                campo.classList.add("is-invalid");
            } else {
                campo.classList.remove("is-invalid");
            }
        });
    });

    // Mostrar campo de monto si se selecciona "Efectivo"
    if (metodoPago) {
        metodoPago.addEventListener("change", () => {
            montoEfectivoContainer.style.display = metodoPago.value === "Efectivo" ? "block" : "none";
            localStorage.setItem('metodoPago', metodoPago.value);
        });
    }

    // Calcular vuelto en tiempo real
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

    // Inicializar estado del tipo de entrega
    if (tipoEntrega) {
        handleTipoEntregaChange();
        tipoEntrega.addEventListener('change', handleTipoEntregaChange);
    }
});

