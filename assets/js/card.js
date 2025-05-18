

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

    // Optimización: filtros aplicados en "change" en lugar de "submit"
    const filtersForm = document.getElementById('filtersForm');
    if (filtersForm) {
        filtersForm.addEventListener('change', () => applyFilters());
    }
});

function renderProducts(data, subcategoriaID = null) {
    const container = document.getElementById('products-container');
    if (!container || !data || !Array.isArray(data.categorias)) {
        console.error('Datos inválidos para renderizar productos.');
        return;
    }

    container.innerHTML = '';

    data.categorias.forEach(categoria => {
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = categoria.nombre;
        categoryTitle.classList.add('category-title', 'text-white', 'text-center', 'mt-5');
        container.appendChild(categoryTitle);

        categoria.subcategorias.forEach(subcategoria => {
            if (!subcategoria.productos || subcategoria.productos.length === 0) return;

            if (!subcategoriaID || subcategoria.id === subcategoriaID) {
                const subcategoryDiv = document.createElement('div');
                subcategoryDiv.classList.add('subcategory');
                subcategoryDiv.id = `subcategoria-${subcategoria.id}`;

                subcategoryDiv.innerHTML = `
                    <h5 class="text-white text-center mt-3 mb-3">${subcategoria.nombre}</h5>
                    <div class="row g-3">
                        ${subcategoria.productos.map(createProductCard).join('')}
                    </div>
                `;
                container.appendChild(subcategoryDiv);
            }
        });
    });
}

// Función optimizada para crear una card de producto sin errores de sintaxis
function createProductCard(producto) {
    return `
        <div class="col-6 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100">
                <div class="card-body">
                    <img src="${producto.foto}" alt="Imagen de ${producto.nombre}" class="card-img-top img-fluid rounded">
                    <h5 class="card-title text-center mt-1">${producto.nombre}</h5>
                    <p class="card-text price-container">
                        <span><strong>Efectivo:</strong> $${producto.precioEfectivo.toLocaleString()}</span>
                        <span><strong>Tarjeta:</strong> $${producto.precioTransferenciaTarjeta.toLocaleString()}</span>
                    </p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-info action-btn" aria-label="Ver información de ${producto.nombre}"
                            onclick="showInfo('${producto.nombre}', '${producto.descripcion}')">
                            <i class="bi bi-info-circle"></i> <span class="btn-text d-none d-lg-inline">Ver</span>
                        </button>
                        <button class="btn btn-primary action-btn" aria-label="Agregar ${producto.nombre} al carrito"
                            onclick="agregarAlCarrito('${producto.id}', '${producto.nombre}', '${producto.precioEfectivo}', '${producto.precioTransferenciaTarjeta}')">
                            <i class="bi bi-bag-plus-fill"></i> <span class="btn-text d-none d-lg-inline">Agregar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}



export { renderProducts };

