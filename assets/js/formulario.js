
// formulario.js

import { showValidationModal } from './whatsapp_modal.js';

// Obtiene los elementos del formulario
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
    };
}

// 🔹 Función para validar campos del formulario
export function validarCampos() {
    const { nombre, telefono, direccion, tipoEntrega, metodoPago, horario, terminos } = getElements();
    const errores = [];

    if (!nombre.value.trim()) errores.push('Nombre');
    if (!telefono.value.trim()) errores.push('Teléfono');
    if (!direccion.value.trim()) errores.push('Dirección');
    if (!tipoEntrega.value) errores.push('Método de entrega');
    if (!metodoPago.value) errores.push('Método de pago');
    if (!horario.value) errores.push('Horario de entrega');
    if (!terminos.checked) errores.push('Aceptar los términos y condiciones');

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) errores.push('Agregar productos al carrito');

    return errores;
}
