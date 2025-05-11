// assets/js/whatsapp_modal.js
// Funciones del modal
function showValidationModal(errores) {
    const modalElement = document.getElementById('validationModal');
    const modal = new bootstrap.Modal(modalElement);
    const modalBody = document.getElementById('validationModalBody');

    // Formatear los errores como una lista
    modalBody.innerHTML = `
        <strong><p>Falta completar los siguientes datos:</p></strong>
        <ul>
            ${errores.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;

    // Mostrar el modal
    modal.show();

    // Cierre automático después de 3 segundos con desvanecimiento
    setTimeout(() => closeValidationModal(), 5000);
}



function closeValidationModal() {
    const modalElement = document.getElementById('validationModal');
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        // Agregar la clase para el desvanecimiento
        modalElement.classList.add('fade-out');

        // Esperar a que la animación termine antes de cerrar el modal
        setTimeout(() => {
            modal.hide();
            modalElement.classList.remove('fade-out'); // Eliminar la clase después de cerrarse
        }, 500); // Duración de la animación en ms (debe coincidir con el CSS)
    }
}


// Exponer funciones al ámbito global
window.closeValidationModal = closeValidationModal;
window.showValidationModal = showValidationModal;

export { showValidationModal, closeValidationModal };
