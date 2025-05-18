// assets/js/carrito.js
import { mostrarMensajeCarrito } from './animaciones.js';
import { enviarPedido } from './whatsapp.js';

const COSTO_ENVIO = 2000;
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items-container');
const totalElement = document.getElementById('total');

// 🔹 Carga productos desde JSON solo cuando es necesario
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

// 🔹 Sincroniza precios sin recargar datos innecesariamente
function sincronizarPreciosConMetodoPago() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const metodoPago = document.getElementById('metodopago')?.value || 'Efectivo';

    carrito.forEach(item => {
        item.precio = (metodoPago === 'Tarjeta' || metodoPago === 'Transferencia') 
            ? item.precioTransferenciaTarjeta 
            : item.precioEfectivo;
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// 🔹 Renderiza el carrito con mejor interacción
async function renderCart() {
    sincronizarPreciosConMetodoPago();
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.quantity > 0);

    cartItems.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.quantity;
        total += subtotal;

        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="item-name">${item.nombre}</div>
            <div class="item-price">$${item.precio.toLocaleString('es-CL')}</div>
            <div class="item-controls">
                <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <div class="item-subtotal">$${subtotal.toLocaleString('es-CL')}</div>`;
        cartItems.appendChild(cartItem);
    });

    if (carrito.length > 0 && document.getElementById('tipoentrega')?.value === "Domicilio") {
        total += COSTO_ENVIO;
        cartItems.innerHTML += `
            <li class="cart-item shipping">
                <div class="item-name">Costo de envío <small>(sujeto a confirmación)</small></div>
                <div class="item-subtotal">$${COSTO_ENVIO.toLocaleString('es-CL')}</div>
            </li>`;
    }

    totalElement.innerText = total.toLocaleString('es-CL');
}

// 🔹 Actualización de cantidad con menos escritura en `localStorage`
function updateQuantity(id, change) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productIndex = carrito.findIndex(item => item.id === id);

    if (productIndex > -1) {
        carrito[productIndex].quantity += change;
        if (carrito[productIndex].quantity < 1) carrito.splice(productIndex, 1);

        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderCart();
        toggleCartSidebar(true);
    }
}

// 🔹 Agrega productos con mejor visualización
let carritoAbierto = false; // 🔹 Variable para controlar la apertura automática

function agregarAlCarrito(id, nombre, precioEfectivo, precioTransferenciaTarjeta) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const existingProduct = carrito.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        carrito.push({ id, nombre, quantity: 1, precioEfectivo, precioTransferenciaTarjeta });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCart();
    mostrarMensajeCarrito();

    // 🔹 Solo abrir el carrito la primera vez en la sesión
    if (!carritoAbierto) {
        toggleCartSidebar(true);
        carritoAbierto = true;
    }
}


// 🔹 Limpiar carrito con cierre suave
function limpiarCarrito() {
    localStorage.removeItem('carrito');
    renderCart();
    toggleCartSidebar(false);
}

// 🔹 Mostrar/ocultar carrito con transiciones suaves
function toggleCartSidebar(forceOpen = false) {
    if (forceOpen || !cartSidebar.classList.contains('show')) {
        cartSidebar.classList.add('show');
        cartSidebar.classList.remove('hide');
    } else {
        cartSidebar.classList.add('hide');
        setTimeout(() => cartSidebar.classList.remove('show'), 400); // 🔹 Espera antes de quitar 'show'
    }
}


// 🔹 Eventos organizados
document.getElementById('metodopago').addEventListener('change', () => {
    renderCart();
    toggleCartSidebar(true);
});

document.getElementById('tipoentrega')?.addEventListener('change', () => {
    renderCart();
});

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// 🔹 Exportar funciones globales
window.toggleCartSidebar = toggleCartSidebar;
window.agregarAlCarrito = agregarAlCarrito;
window.updateQuantity = updateQuantity;
window.limpiarCarrito = limpiarCarrito;
window.enviarPedido = enviarPedido;

export { agregarAlCarrito, renderCart };





