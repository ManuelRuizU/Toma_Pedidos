// assets/js/carrito.js carrito y animaciones.

import { mostrarMensajeCarrito, showHearts }from'./animaciones.js';
import { enviarPedido } from './whatsapp.js';

// Variables globales
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items-container');
const totalElement = document.getElementById('total');
const metodosPagoValidos = ['Efectivo', 'Tarjeta', 'Transferencia'];
const metodoPago = document.getElementById('metodopago')?.value || 'Efectivo';
if (!metodosPagoValidos.includes(metodoPago)) {
    metodoPago = 'Efectivo'; // Establece un valor predeterminado
    console.warn('Método de pago inválido, utilizando valor predeterminado');
}

// Cargar los datos del archivo productos.json y actualizar el precio según el método de pago
async function cargarProductos() {
  try {
      const response = await fetch('/assets/json/productos.json'); // Ajusta la ruta si es necesario
      if (!response.ok) throw new Error('Error al cargar productos');
      return await response.json();
  } catch (error) {
      console.error(error);
      return null;
  }
}
// Renderizar el carrito
async function renderCart() {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(item => item.quantity > 0);
  cartItems.innerHTML = '';
  let total = 0;
  const metodoPago = document.getElementById('metodopago')?.value || 'Efectivo';

  const productosData = await cargarProductos();
  if (!productosData) return;

  carrito.forEach((item) => {
      const producto = productosData.categorias
          .flatMap(categoria => categoria.subcategorias)
          .flatMap(subcategoria => subcategoria.productos)
          .find(prod => prod.id === item.id);

      if (producto) {
          const precioUnitario = (metodoPago === 'Tarjeta' || metodoPago === 'Transferencia') 
              ? producto.precioTransferenciaTarjeta 
              : producto.precioEfectivo;
          const subtotal = precioUnitario * item.quantity;
          total += subtotal;

          const cartItem = document.createElement('li');
          cartItem.classList.add('cart-item');
          cartItem.innerHTML = `
              <div class="item-name">${item.nombre}</div>
              <div class="item-price">$${precioUnitario.toLocaleString('es-CL')}</div>
              <div class="item-controls">
                  <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity('${item.id}', -1)">-</button>
                  <span class="item-quantity">${item.quantity}</span>
                  <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity('${item.id}', 1)">+</button>
              </div>
              <div class="item-subtotal">$${subtotal.toLocaleString('es-CL')}</div>`;
          cartItems.appendChild(cartItem);

          item.precio = precioUnitario;
      }
  });

// Seleccionar únicamente los botones de agregar al carrito
const addToCartButtons = document.querySelectorAll('.btn-add-to-cart'); // Cambiar clase específica para evitar conflictos

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        mostrarMensajeCarrito();

        try {
            // Verificar que el botón tenga un elemento padre con los atributos necesarios
            const parentElement = button.parentElement;
            if (!parentElement) throw new Error('Elemento padre no encontrado.');

            const parentButton = parentElement.querySelector('button');
            if (!parentButton) throw new Error('No se encontró un botón en el elemento padre.');

            const onclickValue = parentButton.getAttribute('onclick');
            if (!onclickValue) throw new Error('El botón no contiene un atributo "onclick".');

            // Extraer el productoId del atributo onclick
            const productoIdMatch = onclickValue.match(/'(\w+)'/);
            if (!productoIdMatch) throw new Error('El atributo onclick no contiene el formato esperado.');
            const productoId = productoIdMatch[1];

            // Obtener el nombre del producto
            const productoNombre = parentElement.querySelector('h5')?.textContent || 'Producto sin nombre';

            // Obtener el precio efectivo
            const precioEfectivoText = parentElement.querySelector('p:nth-child(3)')?.textContent || '';
            const precioEfectivoMatch = precioEfectivoText.match(/: \$([\d.]+)/);
            const precioEfectivo = precioEfectivoMatch ? precioEfectivoMatch[1] : '0.00';

            // Obtener el precio de transferencia o tarjeta
            const precioTransferenciaTarjetaText = parentElement.querySelector('p:nth-child(4)')?.textContent || '';
            const precioTransferenciaTarjetaMatch = precioTransferenciaTarjetaText.match(/: \$([\d.]+)/);
            const precioTransferenciaTarjeta = precioTransferenciaTarjetaMatch ? precioTransferenciaTarjetaMatch[1] : '0.00';

            // Lógica de agregar al carrito
            console.log('Producto agregado:', { productoId, productoNombre, precioEfectivo, precioTransferenciaTarjeta });
            agregarAlCarrito(productoId, productoNombre, precioEfectivo, precioTransferenciaTarjeta);
        } catch (error) {
            console.error('Error al intentar agregar al carrito:', error.message);
        }
    });
});



  totalElement.innerText = total.toLocaleString('es-CL');
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar evento de cambio al selector de método de pago
document.getElementById('metodopago').addEventListener('change', () => {
  renderCart();
});


// Actualizar la cantidad de un producto en el carrito
function updateQuantity(id, change) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productIndex = carrito.findIndex(item => item.id === id);

    if (productIndex > -1) {
        carrito[productIndex].quantity += change;
        if (carrito[productIndex].quantity < 1) carrito.splice(productIndex, 1);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCart();
}

// Agregar un producto al carrito
function agregarAlCarrito(id, nombre, precio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const existingProduct = carrito.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        carrito.push({ id, nombre, precio, quantity: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCart();
    mostrarMensajeCarrito(); // Muestra el mensaje cuando se agrega un producto
}




// Limpiar el carrito
function limpiarCarrito() {
    localStorage.removeItem('carrito');
    renderCart();
    console.log('El carrito ha sido limpiado.');
}

// Mostrar/ocultar el sidebar del carrito
function toggleCartSidebar() {
    cartSidebar.classList.toggle('show');
    //showHearts(document.getElementById('cart-button')); // Ejecuta la animación desde el botón
  }
  



// Enviar pedido


// Iniciar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// Exportar funciones necesarias
window.toggleCartSidebar = toggleCartSidebar;
window.agregarAlCarrito = agregarAlCarrito;
window.enviarPedido = enviarPedido;
window.updateQuantity = updateQuantity;
window.limpiarCarrito = limpiarCarrito;

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Esta es la variable que debes exportar

// Funciones y lógica relacionadas con el carrito...

// Exportar la variable carrito
export { carrito, agregarAlCarrito, updateQuantity, limpiarCarrito, renderCart };





