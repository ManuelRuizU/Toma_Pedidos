

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
        filtersForm.addEventListener('change', () => applyFilters());
    }
});

// Delegación de eventos para botones
document.addEventListener('click', e => {
    const infoBtn = e.target.closest('.btn-ver-info');
    const cartBtn = e.target.closest('.btn-agregar-carrito');

    if (infoBtn) {
        showInfo(infoBtn.dataset.nombre, infoBtn.dataset.descripcion);
    }

    if (cartBtn) {
        agregarAlCarrito(
            cartBtn.dataset.id,
            cartBtn.dataset.nombre,
            cartBtn.dataset.efectivo,
            cartBtn.dataset.tarjeta
        );
    }
});

function renderProducts(data, subcategoriaID = null) {
    const container = document.getElementById('products-container');
    if (!container || !data || !Array.isArray(data.categorias)) {
        console.error('Datos inválidos para renderizar productos.');
        return;
    }

    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    data.categorias.forEach(categoria => {
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = categoria.nombre;
        categoryTitle.id = `categoria-${categoria.id}`;
        fragment.appendChild(categoryTitle);


        categoria.subcategorias.forEach(subcategoria => {
            if (!subcategoria.productos || subcategoria.productos.length === 0) return;

            if (!subcategoriaID || subcategoria.id === subcategoriaID) {
                const subcategoryDiv = document.createElement('div');
                subcategoryDiv.classList.add('subcategory');
                subcategoryDiv.id = `subcategoria-${subcategoria.id}`;


                subcategoryDiv.innerHTML = `
                    <h5 class="text-white text-center mt-3 mb-3">${escapeHTML(subcategoria.nombre)}</h5>
                    <div class="row g-3">
                        ${subcategoria.productos.map(createProductCard).join('')}
                    </div>
                `;
                fragment.appendChild(subcategoryDiv);
            }
        });
    });

    container.appendChild(fragment);
}

function createProductCard(producto) {
    const precioEfectivo = producto.precioEfectivo
        ? `$${producto.precioEfectivo.toLocaleString()}`
        : '';
    const precioTarjeta = producto.precioTransferenciaTarjeta
        ? `$${producto.precioTransferenciaTarjeta.toLocaleString()}`
        : '';

    const tieneAmbosPrecios = producto.precioEfectivo && producto.precioTransferenciaTarjeta;

    return `
        <div class="col-6 col-sm-6 col-md-4 col-lg-3">
            <div class="product-card shadow-sm rounded">
                <div class="product-image-container">
                    <img src="${escapeHTML(producto.foto)}" alt="${escapeHTML(producto.nombre)}" class="product-image rounded-top" loading="lazy">
                </div>
                <div class="product-info p-2">
                    <h5 class="product-name text-truncate mb-2">${escapeHTML(producto.nombre)}</h5>
                    
                    <div class="product-prices mb-2">
                        ${tieneAmbosPrecios
                            ? `
                            <div><strong>Efectivo:</strong> <span class="text-success">${precioEfectivo}</span></div>
                            <div><strong>Tarjeta:</strong> <span class="text-danger">${precioTarjeta}</span></div>`
                            : `<div><strong>Precio:</strong> <span>${precioEfectivo || precioTarjeta}</span></div>`
                        }
                    </div>

                    <div  class="d-flex justify-content-between mt-auto gap-2">
                        <button type="button" class="btn btn-outline-primary btn-sm w-50"
                            data-nombre="${escapeHTML(producto.nombre)}"
                            data-descripcion="${escapeHTML(producto.descripcion)}">
                            <span class="eye-wrapper" aria-hidden="true">
                                <svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                <svg class="eye-closed" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m15 18-.722-3.25"/>
                                    <path d="M2 8a10.645 10.645 0 0 0 20 0"/>
                                    <path d="m20 15-1.726-2.05"/>
                                    <path d="m4 15 1.726-2.05"/>
                                    <path d="m9 18 .722-3.25"/>
                                </svg>
                            </span>
                        </button>
                        <button class="btn btn-primary btn-sm w-50 btn-agregar-carrito"
                            data-id="${escapeHTML(producto.id)}"
                            data-nombre="${escapeHTML(producto.nombre)}"
                            data-efectivo="${escapeHTML(producto.precioEfectivo)}"
                            data-tarjeta="${escapeHTML(producto.precioTransferenciaTarjeta)}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-basket-icon lucide-shopping-basket"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}



function escapeHTML(str) {
    if (typeof str !== 'string') return String(str); // Solución segura
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    }[tag]));
}


export { renderProducts };





