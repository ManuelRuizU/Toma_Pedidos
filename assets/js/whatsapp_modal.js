// assets/js/whatsapp_modal.js


// Muestra el modal de validación con los errores detectados
function showValidationModal(errores) {
    const modalElement = document.getElementById('validationModal');
    const modal = new bootstrap.Modal(modalElement);
    const modalBody = document.getElementById('validationModalBody');

    if (errores.length > 0) {
        modalBody.innerHTML = `
            <strong class="text-danger"><i class="bi bi-exclamation-circle-fill"></i> Error en el formulario</strong>
            <p class="mt-2">Por favor, completa los siguientes datos antes de enviar tu pedido:</p>
            <ul class="list-group list-group-flush">
                ${errores.map(error => `<li class="list-group-item text-danger">${error}</li>`).join('')}
            </ul>
        `;
        modal.show();
    }
}

// Cierra el modal con animación
function closeValidationModal() {
    const modalElement = document.getElementById('validationModal');
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

    if (modal) {
        modalElement.classList.add('fade-out');
        setTimeout(() => {
            modal.hide();
            modalElement.classList.remove('fade-out');
        }, 500);
    }
}

window.closeValidationModal = closeValidationModal;

// Exportar funciones
export { showValidationModal, closeValidationModal };


