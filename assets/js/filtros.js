
import { loadData } from './data.js';
import { renderProducts } from './card.js';

let originalData = null; // Variable para almacenar los datos originales
function renderSubcategories(categorias) {
    const filtersContainer = document.getElementById('filtersForm');
    if (!filtersContainer) {
        console.error('No se encontró el contenedor de filtros.');
        return;
    }

    // Renderiza el formulario de filtros
    filtersContainer.innerHTML = `
        <div class="mb-3">
            <label for="categoryFilter" class="form-label">Categoría</label>
            <select id="categoryFilter" class="form-select">
                <option value="">Todas</option>
                ${categorias
                    .map(
                        categoria =>
                            `<option value="${categoria.nombre}">${categoria.nombre}</option>`
                    )
                    .join('')}
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Rango de precios</label>
            <div class="d-flex align-items-center">
                <span id="priceMin" class="me-2">0</span>
                <input type="range" class="form-range" id="priceRange" min="0" max="50000" step="1000">
                <span id="priceValue" class="ms-2">50000</span>
            </div>
        </div>
        <button type="submit" class="btn btn-success w-100">Aplicar filtros</button>
        <button type="button" id="clearFilters" class="btn btn-secondary w-100 mt-2">Limpiar filtros</button>
    `;

    // Actualizar dinámicamente el valor del rango de precios
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (priceRange && priceValue) {
        priceRange.addEventListener('input', () => {
            priceValue.textContent = priceRange.value; // Mostrar el valor actual del rango
        });
    }

    // Asignar evento para limpiar filtros
    const clearFiltersButton = document.getElementById('clearFilters');
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', () => {
            renderProducts(originalData); // Volver a mostrar todos los productos
            document.getElementById('categoryFilter').value = ''; // Restablecer categoría
            document.getElementById('priceRange').value = 0; // Restablecer rango de precios
            document.getElementById('priceValue').textContent = '0'; // Actualizar el texto del rango
        });
    }
}

function initializeFilters() {
    loadData()
        .then(data => {
            originalData = JSON.parse(JSON.stringify(data)); // Guardar una copia de los datos originales
            renderSubcategories(originalData.categorias); // Renderizar los filtros dinámicamente
            renderProducts(originalData); // Renderizar todos los productos al inicio
        })
        .catch(error => console.error('Error al inicializar filtros:', error));
}




function applyFilters() {
    if (!originalData) {
        console.error('Los datos originales no están cargados.');
        return;
    }

    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceRange = parseInt(document.getElementById('priceRange').value, 10);

    console.log('Rango de precio seleccionado:', priceRange);

    // Crear una copia de las categorías
    let filteredCategories = JSON.parse(JSON.stringify(originalData.categorias));

    // Filtrar por categoría
    if (categoryFilter) {
        filteredCategories = filteredCategories.filter(categoria =>
            categoria.nombre.toLowerCase() === categoryFilter.toLowerCase()
        );
    }

    console.log('Después de filtrar por categoría:', filteredCategories);

    // Filtrar por rango de precio
    filteredCategories.forEach(categoria => {
        categoria.subcategorias.forEach(subcategoria => {
            subcategoria.productos = subcategoria.productos.filter(producto =>
                producto.precioEfectivo <= priceRange
            );
        });

        // Eliminar subcategorías vacías
        categoria.subcategorias = categoria.subcategorias.filter(subcategoria =>
            subcategoria.productos.length > 0
        );
    });

    // Eliminar categorías vacías
    filteredCategories = filteredCategories.filter(categoria =>
        categoria.subcategorias.length > 0
    );

    console.log('Después de filtrar por precio:', filteredCategories);

    // Verificar si hay productos después del filtrado
    const hasProducts = filteredCategories.some(categoria =>
        categoria.subcategorias.some(subcategoria => subcategoria.productos.length > 0)
    );

    if (!hasProducts) {
        showModal('No hay productos en el rango de precio seleccionado.');
        return;
    }

    // Renderizar los productos filtrados
    renderProducts({ categorias: filteredCategories });
}

function showModal(message) {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
        <div class="modal fade" id="noProductsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Aviso</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalContainer);

    const modalElement = document.getElementById('noProductsModal');
    const modalInstance = new bootstrap.Modal(modalElement);

    // Mostrar el modal
    modalInstance.show();

    // Asegurarse de eliminar el backdrop y el modal del DOM
    modalElement.addEventListener('hidden.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove(); // Elimina el fondo oscuro si queda presente
        }
        modalContainer.remove(); // Elimina el modal del DOM
        document.body.classList.remove('modal-open'); // Asegura que la clase modal-open se elimine
        document.body.style.overflow = ''; // Restablece el scroll si estaba bloqueado
    });
}





// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters(); // Carga inicial de datos y filtros

    const filtersForm = document.getElementById('filtersForm');
    if (filtersForm) {
        // Eliminar cualquier evento previo asignado para evitar duplicados
        filtersForm.removeEventListener('submit', handleFilterSubmit);
        filtersForm.addEventListener('submit', handleFilterSubmit);
    }
});

// Nueva función para manejar el submit
function handleFilterSubmit(event) {
    event.preventDefault();
    applyFilters(); // Aplica filtros al enviar el formulario
}


// Exportar funciones si necesitas reutilizarlas
export { renderSubcategories, initializeFilters, applyFilters };
