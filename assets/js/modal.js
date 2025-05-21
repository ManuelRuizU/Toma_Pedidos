// assets/js/modal.js

// assets/js/modal.js

// Almacena la instancia del modal
let infoModalInstance = null;

// 🔹 Función para mostrar la información del producto en el modal
export function showInfo(nombre, descripcion) {
    const modalElement = document.getElementById('info-modal');
    const modalTitle = document.getElementById('infoModalLabel');
    const modalBody = document.getElementById('info-modal-content');

    if (!modalElement || !modalTitle || !modalBody) {
        console.error("No se encontraron elementos del modal en el DOM.");
        return;
    }

    modalTitle.textContent = nombre;
    modalBody.innerHTML = `<p>${descripcion}</p>`;

    // 🔹 Usa una instancia nueva si no existe
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
        modalInstance = new bootstrap.Modal(modalElement);
    }
    modalInstance.show();
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

