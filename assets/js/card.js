
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
        // Crear el título de la categoría
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = categoria.nombre;
        categoryTitle.classList.add('category-title', 'text-white', 'text-center', 'mt-5');
        container.appendChild(categoryTitle); // Añadir el título de la categoría al contenedor

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

                // Título de la subcategoría
                const subcategoryTitle = document.createElement('h5');
                subcategoryTitle.textContent = subcategoria.nombre;
                subcategoryTitle.classList.add('text-white', 'text-center', 'mt-3', 'mb-3'); 
                subcategoryDiv.appendChild(subcategoryTitle);

                const subcategoryRow = document.createElement('div');
                subcategoryRow.classList.add('row', 'g-3'); // g-3 para espacio entre cards

                // Renderizar productos
                subcategoria.productos.forEach(producto => {
                    const productDiv = createProductCard(producto);
                    subcategoryRow.appendChild(productDiv);
                });

                subcategoryDiv.appendChild(subcategoryRow);
                container.appendChild(subcategoryDiv);
            }
        });
    });
}


// Función para crear una card de producto
function createProductCard(producto) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('col-6', 'col-sm-6', 'col-md-4', 'col-lg-3'); // Mejora la responsividad

    // Card de producto
    const card = document.createElement('div');
    card.classList.add('card', 'h-100'); // Mantener la altura consistente

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Imagen del producto
    const img = document.createElement('img');
    img.src = producto.foto;
    img.alt = `Imagen de ${producto.nombre}`; // Descripción accesible de la imagen
    img.classList.add('card-img-top', 'img-fluid', 'rounded'); // img-fluid para responsividad

    // Nombre del producto
    const productTitle = document.createElement('h5');
    productTitle.classList.add('card-title', 'text-center', 'mt-1');
    productTitle.textContent = producto.nombre;

    // Precios
    const precioEfectivo = document.createElement('p');
    precioEfectivo.classList.add('card-text', 'fw-bold');
    precioEfectivo.textContent = `Precio Efectivo: $${producto.precioEfectivo.toLocaleString()}`;

    const precioTransferencia = document.createElement('p');
    precioTransferencia.classList.add('card-text');
    precioTransferencia.textContent = `Precio Transferencia: $${producto.precioTransferenciaTarjeta.toLocaleString()}`;

    // Botones de acción
    const infoButton = document.createElement('button');
    infoButton.classList.add('btn', 'btn-info', 'w-100', 'mb-2');
    infoButton.innerHTML = '<i class="bi bi-info-circle"></i> Ver';
    infoButton.onclick = () => showInfo(producto.nombre, producto.descripcion);

    const addButton = document.createElement('button');
    addButton.classList.add('btn', 'btn-primarys', 'w-100');
    addButton.innerHTML = '<i class="bi bi-bag-plus-fill"></i> Agregar';
    addButton.onclick = () => agregarAlCarrito(producto.id, producto.nombre, producto.precioEfectivo, producto.precioTransferenciaTarjeta);

    // Añadir todo al cardBody
    cardBody.appendChild(img);
    cardBody.appendChild(productTitle);
    cardBody.appendChild(precioEfectivo);
    cardBody.appendChild(precioTransferencia);
    cardBody.appendChild(infoButton);
    cardBody.appendChild(addButton);

    // Añadir el card al div de producto
    card.appendChild(cardBody);
    productDiv.appendChild(card);

    return productDiv;
}

export { renderProducts };


