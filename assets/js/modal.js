// assets/js/modal.js

window.showInfo = showInfo;
window.closeInfoModal = closeInfoModal;

// Función para mostrar el modal con la información del producto
function showInfo(nombre, descripcion) {
    const modalContent = document.getElementById('info-modal-content');
    modalContent.innerHTML = `
      <h2>${nombre}</h2>
      <p>${descripcion}</p>
    `;
    const infoModal = document.getElementById('info-modal');
    infoModal.classList.add('show');
    infoModal.style.display = 'block';
  }
  
  // Función para cerrar el modal
  function closeInfoModal() {
    const infoModal = document.getElementById('info-modal');
    infoModal.classList.remove('show');
    infoModal.style.display = 'none';
  }

  const backdrop = document.querySelector('.modal');
backdrop.addEventListener('click', function(event) {
  if (event.target === this) {
    closeInfoModal();
  }
});
  
  export { showInfo, closeInfoModal };
