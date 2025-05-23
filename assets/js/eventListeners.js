//eventListeners.js
import { carrito } from './carrito.js';
import { applyFilters } from './filtros.js';


document.addEventListener('DOMContentLoaded', () => {
  const filtersForm = document.getElementById('filtersForm');
  if (filtersForm) {
    filtersForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
});

document.addEventListener('click', (e) => {
  const cartBtn = e.target.closest('.btn-agregar-carrito');

  if (cartBtn) {
    console.log("Agregando producto:", cartBtn.dataset); // 🔹 Depuración
    agregarAlCarrito(
      cartBtn.dataset.id,
      cartBtn.dataset.nombre,
      cartBtn.dataset.efectivo,
      cartBtn.dataset.tarjeta
    );
  }
});

