// assets/js/modal.js

// assets/js/modal.js

// Almacena la instancia del modal
let infoModalInstance = null;

// 🔹 Función para mostrar la información del producto en el modal
export function showInfo(nombre, descripcion) {
    const modalElement = document.getElementById('info-modal');
    const modalTitle = document.getElementById('infoModalLabel');
    const modalBody = document.getElementById('info-modal-content');

    modalTitle.textContent = nombre;
    modalBody.innerHTML = `<p>${descripcion}</p>`;

    // 🔹 Obtener la instancia correcta cada vez que se muestra
    infoModalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    infoModalInstance.show();
}

// 🔹 Función para cerrar el modal correctamente
export function closeInfoModal() {
    const modalElement = document.getElementById('info-modal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
        modalInstance.hide();
    }
}

// 🔹 Prevención de cierres accidentales al hacer clic fuera del contenido
document.addEventListener('click', (event) => {
    const modalElement = document.getElementById('info-modal');
    if (modalElement.classList.contains('show') && event.target.closest('.modal-content') === null) {
        if (confirm("¿Seguro que quieres cerrar este mensaje?")) {
            closeInfoModal();
        }
    }
});

// 🔹 Exponer funciones globalmente si es necesario
window.showInfo = showInfo;
window.closeInfoModal = closeInfoModal;

