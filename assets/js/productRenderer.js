
import { showInfo } from './modal.js';
import { escapeHTML } from './utils.js';

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

export { renderProducts };