// assets/js/modal.js

// Almacena una instancia de Bootstrap Modal
let infoModalInstance = null;

// Mostrar la información del producto en el modal
export function showInfo(nombre, descripcion) {
  const modalElement = document.getElementById('info-modal');
  const modalTitle = document.getElementById('infoModalLabel');
  const modalBody = document.getElementById('info-modal-content');

  modalTitle.textContent = nombre;
  modalBody.innerHTML = `<p>${descripcion}</p>`;

  // Inicializar el modal si no está creado
  if (!infoModalInstance) {
    infoModalInstance = new bootstrap.Modal(modalElement, {
      backdrop: true,
      keyboard: true,
    });
  }

  // Mostrar el modal
  infoModalInstance.show();
}

// Cerrar el modal
export function closeInfoModal() {
  const modalElement = document.getElementById('info-modal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);

  if (modalInstance) {
    modalInstance.hide();
  }
}

// Evento para cerrar al hacer clic fuera del contenido (opcional)
document.addEventListener('click', function (event) {
  const modalElement = document.getElementById('info-modal');
  if (modalElement.classList.contains('show') && event.target === modalElement) {
    closeInfoModal();
  }
});

// Exponer al ámbito global si es necesario
window.showInfo = showInfo;
window.closeInfoModal = closeInfoModal;

