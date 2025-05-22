// card.js
import { showInfo } from './modal.js';
import { loadData } from './data.js';
import { renderNavbar } from './navbar.js';   
import { agregarAlCarrito } from './carrito.js';
import { renderSubcategories, initializeFilters, applyFilters } from './filtros.js';

document.addEventListener('DOMContentLoaded', () => {
  loadData()
    .then(data => {
      renderNavbar(data.categorias);
      renderProducts(data);
      renderSubcategories(data.categorias);
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

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
    agregarAlCarrito(
      cartBtn.dataset.id,
      cartBtn.dataset.nombre,
      cartBtn.dataset.efectivo,
      cartBtn.dataset.tarjeta
    );
  }
});

function renderProducts(data) {
  const template = document.getElementById('productCardTemplate');
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  data.categorias.forEach(categoria => {
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = categoria.nombre;
    categoryTitle.id = `categoria-${categoria.id}`;
    container.appendChild(categoryTitle);

    categoria.subcategorias.forEach(subcategoria => {
      const subcategoryDiv = document.createElement('div');
      subcategoryDiv.classList.add('subcategory');
      subcategoryDiv.id = `subcategoria-${subcategoria.id}`;

      subcategoryDiv.innerHTML = `
        <h5 class="text-white text-center mt-3 mb-3">${escapeHTML(subcategoria.nombre)}</h5>
        <div class="row g-3">
        </div>
      `;
      container.appendChild(subcategoryDiv);

      const productsContainer = subcategoryDiv.querySelector('.row.g-3');

      subcategoria.productos.forEach(producto => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.product-card');

        card.querySelector('.product-image').src = producto.foto;
        card.querySelector('.product-name').textContent = producto.nombre;
        card.querySelector('.product-prices .text-success').textContent = `$${producto.precioEfectivo}`;
        card.querySelector('.product-prices .text-danger').textContent = `$${producto.precioTransferenciaTarjeta}`;

        const addToCartButton = card.querySelector('.btn-agregar-carrito');
        addToCartButton.dataset.id = producto.id;
        addToCartButton.dataset.nombre = producto.nombre;
        addToCartButton.dataset.efectivo = producto.precioEfectivo;
        addToCartButton.dataset.tarjeta = producto.precioTransferenciaTarjeta;

        const infoButton = card.querySelector('.btn-ver-info');
        infoButton.addEventListener('click', () => {
          showInfo(producto.nombre, producto.descripcion);
        });

        productsContainer.appendChild(clone);
      });
    });
  });
}

function escapeHTML(str) {
  if (typeof str !== 'string') return String(str);
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[tag]));
}

export { renderProducts };


