
import { showInfo } from './modal.js';
import { loadData } from './data.js';
import { renderNavbar } from './navbar.js';
import { agregarAlCarrito } from './carrito.js';
import { renderSubcategories, initializeFilters, applyFilters } from './filtros.js';


document.addEventListener('DOMContentLoaded', () => {
    loadData()
        .then(data => {
            renderNavbar(data.categorias); // Renderizar categorías en el navbar
            renderProducts(data); // Mostrar todos los productos al cargar
            renderSubcategories(data.categorias); // Renderizar los filtros dinámicos
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));

    // Configuración del formulario de filtros en el offcanvas
    const offcanvasFilters = document.getElementById('offcanvasFilters');
    const filtersForm = document.getElementById('filtersForm');

    if (!offcanvasFilters || !filtersForm) {
        console.error('El offcanvas o el formulario de filtros no se encontraron en el DOM.');
        return;
    }

    // Aplicar filtros al enviar el formulario
    filtersForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters(); // Aplica los filtros seleccionados
    });
});

function renderProducts(data, subcategoriaID = null) {
  const container = document.getElementById('products-container');
  if (!container) {
      console.error('No se encontró el contenedor de productos.');
      return;
  }

  container.innerHTML = '';

  // Verificar si las categorías existen y son un array
  if (!data || !Array.isArray(data.categorias)) {
      console.error('Datos inválidos para renderizar productos:', data);
      return;
  }

  data.categorias.forEach(categoria => {
      categoria.subcategorias.forEach(subcategoria => {
          // Verificar si la subcategoría tiene productos antes de procesarla
          if (!subcategoria.productos || !Array.isArray(subcategoria.productos) || subcategoria.productos.length === 0) {
              return; // Omitir subcategorías vacías
          }

          // Crear contenedor de la subcategoría
          if (!subcategoriaID || subcategoria.id === subcategoriaID) {
              const subcategoryDiv = document.createElement('div');
              subcategoryDiv.classList.add('subcategory');
              subcategoryDiv.id = `subcategoria-${subcategoria.id}`;
              subcategoryDiv.innerHTML = `<h3 style="color: white;">${subcategoria.nombre}</h3>`;

              const subcategoryRow = document.createElement('div');
              subcategoryRow.classList.add('row');

              // Renderizar productos
              subcategoria.productos.forEach(producto => {
                  const productDiv = document.createElement('div');
                  productDiv.classList.add('product', 'card', 'mb-3', 'col-sm-6', 'mt-4', 'col-lg-3');
                  productDiv.innerHTML = `
                      <div class="card-body">
                          <img src="${producto.foto}" alt="${producto.nombre}" class="card-img-top">
                          <h5 class="card-title">${producto.nombre}</h5>
                          <p class="card-text"><strong>Precio Efectivo: $${producto.precioEfectivo.toLocaleString()}</strong></p>
                          <p class="card-text">Precio Transferencia: $${producto.precioTransferenciaTarjeta.toLocaleString()}</p>
                          <button class="btn btn-info" onclick="showInfo('${producto.nombre}', '${producto.descripcion}')"><i class="bi bi-info-circle"></i></button>
                          <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.id}', '${producto.nombre}', '${producto.precioEfectivo}', '${producto.precioTransferenciaTarjeta}')"><i class="bi bi-bag-plus-fill"></i></button>
                      </div>
                  `;
                  subcategoryRow.appendChild(productDiv);
              });

              subcategoryDiv.appendChild(subcategoryRow);
              container.appendChild(subcategoryDiv);
          }
      });
  });
}


export { renderProducts };

