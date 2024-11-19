// card.js

import { showInfo } from './modal.js';
import { loadData } from './data.js';
import { renderNavbar } from './navbar.js';
import { agregarAlCarrito } from './carrito.js';

document.addEventListener('DOMContentLoaded', () => {
  loadData()
    .then(data => {
      renderProducts(data); 
      renderNavbar(data.categorias); 
      setupAddToCartButtons(); // Asocia eventos a los botones de agregar
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
});


// Función para renderizar los productos en el contenedor
function renderProducts(data) {
    const container = document.getElementById('products-container');
  
    // Limpiar el contenedor antes de agregar los productos
    container.innerHTML = '';
  
    data.categorias.forEach(categoria => {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');
      categoryDiv.id = `categoria-${categoria.id}`; // Agregar ID único a la categoría
      categoryDiv.innerHTML = `<h1 class="text-center" style="color: white;">${categoria.nombre}</h1>`;

      categoria.subcategorias.forEach(subcategoria => {
        const subcategoryDiv = document.createElement('div');
        subcategoryDiv.classList.add('subcategory');
        subcategoryDiv.id = `subcategoria-${subcategoria.id}`; // Agregar ID único a la subcategoría
        subcategoryDiv.innerHTML = `<h3 style="color: white;">${subcategoria.nombre}</h3>`;
  
        const subcategoryRow = document.createElement('div'); // Crear una fila para los productos
        subcategoryRow.classList.add('row'); // Agregar la clase "row"
  
        subcategoria.productos.forEach(producto => {
          // Crear un elemento para cada producto
          const productDiv = document.createElement('div');
          productDiv.style.width = '16rem'; // Agregar ancho fijo
          productDiv.classList.add('product', 'card', 'mb-3', 'col-sm-6', 'mt-4', 'col-lg-3'); // Agregar clases "card", "col-*"
          productDiv.innerHTML = `
            <div class="card-body">
              <img src="${producto.foto}" alt="${producto.nombre}" class="card-img-top">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">Precio <i class="bi bi-cash-coin"></i>: $${producto.precioEfectivo.toLocaleString()}</p>
              <p class="card-text">Precio <i class="fa-solid fa-money-bill-transfer"></i>: $${producto.precioTransferenciaTarjeta.toLocaleString()}</p>
              <button class="btn btn-info" onclick="showInfo('${producto.nombre}', '${producto.descripcion}')"><i class="bi bi-info-circle"></i></button>
              <button class="btn btn-primary" onclick="console.log('Agregar producto:', '${producto.id}', '${producto.nombre}', ${producto.precioEfectivo}, ${producto.precioTransferenciaTarjeta}); agregarAlCarrito('${producto.id}', '${producto.nombre}', '${producto.precioEfectivo}', '${producto.precioTransferenciaTarjeta}')"><i class="bi bi-bag-plus-fill"></i></button>
            </div>
          </div>
          `;
          subcategoryRow.appendChild(productDiv);
        });
  
        subcategoryDiv.appendChild(subcategoryRow); // Agregar la fila al contenedor de la subcategoría
        categoryDiv.appendChild(subcategoryDiv);
      });
  
      container.appendChild(categoryDiv);
    });
}


