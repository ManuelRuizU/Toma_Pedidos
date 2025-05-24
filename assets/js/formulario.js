// formulario.js
import { showValidationModal } from './whatsapp_modal.js';

// 🔹 Obtiene los elementos del formulario
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

// 🔹 Validación en tiempo real (Resalta campos vacíos)
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#pedido-formulario input, #pedido-formulario select").forEach((campo) => {
        campo.addEventListener("blur", () => {
            if (!campo.value.trim()) {
                campo.classList.add("is-invalid");
            } else {
                campo.classList.remove("is-invalid");
            }
        });
    });

    // 🔹 Mostrar el campo de monto solo si el usuario elige "Efectivo"
    const { metodoPago, montoEfectivoContainer, montoEfectivo, vueltoCalculado, total } = getElements();

    if (metodoPago) {
        metodoPago.addEventListener("change", () => {
            montoEfectivoContainer.style.display = metodoPago.value === "Efectivo" ? "block" : "none";
        });
    }

    // 🔹 Calcular y mostrar el vuelto en tiempo real
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

// 🔹 Función para validar campos antes de enviar el pedido
export function validarCampos() {
    const { nombre, telefono, direccion, tipoEntrega, metodoPago, horario, terminos, montoEfectivo, total } = getElements();
    const errores = [];

    if (!nombre.value.trim()) errores.push('Nombre');
    if (!telefono.value.trim()) errores.push('Teléfono');
    if (!direccion.value.trim()) errores.push('Dirección');
    if (!tipoEntrega.value) errores.push('Método de entrega');
    if (!metodoPago.value) errores.push('Método de pago');
    if (!horario.value) errores.push('Horario de entrega');
    if (!terminos.checked) errores.push('Aceptar los términos y condiciones');

    // 🔹 Validar monto si el usuario selecciona "Efectivo"
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





