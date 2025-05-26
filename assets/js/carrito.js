// assets/js/carrito.js
import { mostrarMensajeCarrito } from './animaciones.js';
import { enviarPedido } from './whatsapp.js';

// Clase Carrito
class Carrito {
  constructor() {
    this.COSTO_ENVIO = 2000;
    this.cartSidebar = document.getElementById('cart-sidebar');
    this.cartItems = document.getElementById('cart-items-container');
    this.totalElement = document.getElementById('total');
  }

  // Cargar productos desde el JSON
  async cargarProductos() {
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
  async sincronizarPreciosConMetodoPago() {
    const carrito = this.obtenerCarrito();
    const productosData = await this.cargarProductos();
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

    this.guardarCarrito(carrito);
  }

  // Renderizar el carrito
  async renderCart() {
    await this.sincronizarPreciosConMetodoPago(); // Asegurar precios correctos
    const carrito = this.obtenerCarrito().filter(item => item.quantity > 0); // Eliminar productos sin cantidad

    this.cartItems.innerHTML = '';
    let total = 0;

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
      this.cartItems.appendChild(cartItem);
    });

    // Solo si hay productos en el carrito, se evalúa el tipo de entrega
    const tipoEntregaEl = document.getElementById('tipoentrega');
    let shippingCost = 0;
    if (carrito.length > 0 && tipoEntregaEl && tipoEntregaEl.value === "Domicilio") {
      shippingCost = this.COSTO_ENVIO;
      const shippingItem = document.createElement('li');
      shippingItem.classList.add('cart-item', 'shipping');
      shippingItem.innerHTML = `
        <div class="item-name">Costo de envío <small>(sujeto a confirmación)</small></div>
        <div class="item-subtotal">$${shippingCost.toLocaleString('es-CL')}</div>`;
      this.cartItems.appendChild(shippingItem);
    }

    total += shippingCost;
    this.totalElement.innerText = total.toLocaleString('es-CL');
  }

  // Actualizar la cantidad de un producto
  updateQuantity(id, change) {
    const carrito = this.obtenerCarrito();
    const productIndex = carrito.findIndex(item => item.id === id);

    if (productIndex > -1) {
      carrito[productIndex].quantity += change;
      if (carrito[productIndex].quantity < 1) carrito.splice(productIndex, 1);
    }

    this.guardarCarrito(carrito);
    this.renderCart();
  }

  // Agregar un producto al carrito
  agregarAlCarrito(id, nombre, precioEfectivo, precioTransferenciaTarjeta) {
    const carrito = this.obtenerCarrito();
    const existingProduct = carrito.find(item => item.id === id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      carrito.push({ id, nombre, quantity: 1, precioEfectivo, precioTransferenciaTarjeta });
    }

    this.guardarCarrito(carrito);
    this.renderCart();
    mostrarMensajeCarrito();
  }

  // Limpiar el carrito
  limpiarCarrito() {
    localStorage.removeItem('carrito');
    this.renderCart();
  }

  // Mostrar/ocultar el carrito
  toggleCartSidebar() {
    this.cartSidebar.classList.toggle('show');
  }

  // Obtener el carrito
  obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  }

  // Guardar el carrito
  guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
}

// Instanciar la clase Carrito
const carrito = new Carrito();

// Eventos
document.getElementById('metodopago').addEventListener('change', () => {
  carrito.renderCart();
});

const tipoEntregaElement = document.getElementById('tipoentrega');
if (tipoEntregaElement) {
  tipoEntregaElement.addEventListener('change', () => {
    carrito.renderCart();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  carrito.renderCart();
});

// Exportar funciones
window.toggleCartSidebar = () => carrito.toggleCartSidebar();
window.agregarAlCarrito = (id, nombre, precioEfectivo, precioTransferenciaTarjeta) => carrito.agregarAlCarrito(id, nombre, precioEfectivo, precioTransferenciaTarjeta);
window.updateQuantity = (id, change) => carrito.updateQuantity(id, change);
window.limpiarCarrito = () => carrito.limpiarCarrito();
window.enviarPedido = enviarPedido;

export { carrito };









