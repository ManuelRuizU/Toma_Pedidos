// assets/js/carrito.js
// assets/js/carrito.js

import { mostrarMensajeCarrito } from './animaciones.js';
import { enviarPedido } from './whatsapp.js';

// Costo fijo de envío (modifícalo según tus necesidades)
const COSTO_ENVIO = 2000;

// Variables globales
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items-container');
const totalElement = document.getElementById('total');

// Cargar productos desde el JSON
/**
 * Carga los productos desde el archivo JSON.
 * @returns {Promise} Un objeto con los productos.
 */
async function cargarProductos() {
    try {
        const response = await fetch('/assets/json/productos.json');
        if (!response.ok) throw new Error('Error al cargar productos');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Sincronizar precios del carrito según el método de pago
/**
 * Sincroniza los precios del carrito según el método de pago seleccionado.
 */
async function sincronizarPreciosConMetodoPago() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productosData = await cargarProductos();
    const metodoPago = document.getElementById('metodopago')?.value || 'Efectivo';

    if (!productosData) return;

    carrito.forEach((item) => {
        const producto = productosData.categorias
            .flatMap(categoria => categoria.subcategorias)
            .flatMap(subcategoria => subcategoria.productos)
            .find(prod => prod.id === item.id);

        if (producto) {
            // Calcula el precio según el método de pago
            item.precio = (metodoPago === 'Tarjeta' || metodoPago === 'Transferencia')
                ? producto.precioTransferenciaTarjeta
                : producto.precioEfectivo;
        }
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Renderizar el carrito
/**
 * Renderiza el carrito y actualiza el total.
 */
async function renderCart() {
    await sincronizarPreciosConMetodoPago(); // Asegurar precios correctos
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.quantity > 0); // Eliminar productos sin cantidad

    cartItems.innerHTML = '';
    let total = 0;

    // Renderizar los productos del carrito
    // Renderizar los productos del carrito
carrito.forEach((item) => {
  const subtotal = item.precio * item.quantity;
  total += subtotal;

  const cartItem = document.createElement('li');
  cartItem.classList.add('cart-item');
  cartItem.innerHTML = `
    <div class="item-name">${item.nombre}</div>
    <div class="item-price">$${(item.precio || item.precioEfectivo).toLocaleString('es-CL')}</div>
    <div class="item-controls">
      <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity('${item.id}', -1)">-</button>
      <span class="item-quantity">${item.quantity}</span>
      <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity('${item.id}', 1)">+</button>
    </div>
    <div class="item-subtotal">$${subtotal.toLocaleString('es-CL')}</div>`;
  cartItems.appendChild(cartItem);
});

    // Solo si hay productos en el carrito, se evalúa el tipo de entrega
    let tipoEntregaEl = document.getElementById('tipoentrega');
    let shippingCost = 0;
    if (carrito.length > 0 && tipoEntregaEl && tipoEntregaEl.value === "Domicilio") {
        shippingCost = COSTO_ENVIO;
        const shippingItem = document.createElement('li');
        shippingItem.classList.add('cart-item', 'shipping');
        shippingItem.innerHTML = `
            <div class="item-name">Costo de envío <small>(sujeto a confirmación)</small></div>
            <div class="item-subtotal">$${shippingCost.toLocaleString('es-CL')}</div>`;
        cartItems.appendChild(shippingItem);
    }

    total += shippingCost;
    totalElement.innerText = total.toLocaleString('es-CL');
}

// Actualizar la cantidad de un producto
/**
 * Actualiza la cantidad de un producto en el carrito.
 * @param {string} id El ID del producto.
 * @param {number} change La cantidad a sumar o restar.
 */
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
/**
 * Agrega un producto al carrito.
 * @param {string} id El ID del producto.
 * @param {string} nombre El nombre del producto.
 */
function agregarAlCarrito(id, nombre, precioEfectivo, precioTransferenciaTarjeta) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const existingProduct = carrito.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    carrito.push({ id, nombre, quantity: 1, precioEfectivo, precioTransferenciaTarjeta });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCart();
  mostrarMensajeCarrito();
}

// Limpiar el carrito
/**
 * Limpia el carrito y elimina todos los productos.
 */
function limpiarCarrito() {
    localStorage.removeItem('carrito');
    renderCart();
}

// Mostrar/ocultar el carrito
/**
 * Muestra u oculta el carrito.
 */
function toggleCartSidebar() {
    cartSidebar.classList.toggle('show');
}

// Eventos
document.getElementById('metodopago').addEventListener('change', () => {
    renderCart();
});

// Agregar listener para el cambio en el tipo de entrega para re-renderizar el carrito
const tipoEntregaElement = document.getElementById('tipoentrega');
if (tipoEntregaElement) {
    tipoEntregaElement.addEventListener('change', () => {
        renderCart();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// Exportar funciones
window.toggleCartSidebar = toggleCartSidebar;
window.agregarAlCarrito = agregarAlCarrito;
window.updateQuantity = updateQuantity;
window.limpiarCarrito = limpiarCarrito;
window.enviarPedido = enviarPedido;

export { agregarAlCarrito, renderCart };








