// assets/js/modal.js

window.showInfo = showInfo;
window.closeInfoModal = closeInfoModal;

export function showInfo(nombre, descripcion) {
  document.getElementById('infoModalLabel').textContent = nombre;
  document.getElementById('info-modal-content').innerHTML = `<p>${descripcion}</p>`;
  
  const infoModal = document.getElementById('info-modal');
  infoModal.classList.add('show');
  infoModal.style.display = 'block';
  document.body.classList.add('modal-open');  // Para evitar desplazamiento del fondo
}

function closeInfoModal() {
  const infoModal = document.getElementById('info-modal');
  infoModal.classList.remove('show');
  infoModal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

// Cerrar modal al hacer clic fuera del contenido
const modalBackdrop = document.querySelector('.modal');
modalBackdrop.addEventListener('click', function(event) {
  if (event.target === this) {
    closeInfoModal();
  }
});
