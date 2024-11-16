

 // Variables
 const cartSidebar = document.getElementById('cart-sidebar');
 const cartItems = document.getElementById('cart-items-container');
 const totalElement = document.getElementById('total');
 const cartCountElement = document.getElementById('cart-count');
 
 
 document.addEventListener('DOMContentLoaded', function() {
   
   checkCartAndUpdate();
 });
 
// Función para verificar el contenido del carrito y actualizar el botón
  function checkCartAndUpdate() {

    const cartButton = document.getElementById("cart-button");
    const cartStatus = document.getElementById("cart-status");
    const checkoutButton = document.getElementById("checkout-button");
}


// Llama a checkCartAndUpdate cada vez que el carrito se actualice
document.addEventListener("DOMContentLoaded", checkCartAndUpdate);

// Función para vaciar el carrito
function vaciarCarrito() {
localStorage.removeItem('carrito'); // Eliminar carrito del localStorage
updateCartStatus(); // Actualiza el estado del carrito a vacío
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




// Funcion Renderizar el carrito
async function renderCart() {
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
cartItems.innerHTML = '';
let total = 0;
const metodoPago = document.getElementById('metodopago').value;

const productosData = await cargarProductos();
if (!productosData) return;

carrito.forEach((item) => {
    const productoEncontrado = productosData.categorias.flatMap(categoria => categoria.subcategorias)
        .flatMap(subcategoria => subcategoria.productos)
        .find(prod => prod.id === item.id);

    if (productoEncontrado) {
        // Calculamos el precio según el método de pago
        const precioUnitario = metodoPago === 'Tarjeta' || metodoPago === 'Transferencia' ? 
                      productoEncontrado.precioTransferenciaTarjeta : 
                      productoEncontrado.precioEfectivo;
        const subtotal = precioUnitario * item.quantity;
        total += subtotal;

        // Crear elemento del carrito
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = 
        `<div class="item-name">${item.nombre}</div>
        <div class="item-price">$${precioUnitario.toLocaleString('es-CL')}</div>
        <div class="item-controls">
            <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <div class="item-subtotal">$${subtotal.toLocaleString('es-CL')}</div>`;
        cartItems.appendChild(cartItem);

        // Actualizar el precio unitario en el carrito
        item.precio = precioUnitario;
    }
});

totalElement.innerText = total.toLocaleString('es-CL');
localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar la cantidad de un producto
export function updateQuantity(id, change) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const productIndex = carrito.findIndex(item => item.id === id);

  if (productIndex > -1) {
      carrito[productIndex].quantity += change;
      if (carrito[productIndex].quantity < 1) carrito.splice(productIndex, 1); 
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCart();
  checkCartAndUpdate();
}



function agregarAlCarrito(id, nombre, precio) {
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const existingProductIndex = carrito.findIndex((item) => item.id === id);
if (existingProductIndex > -1) {
  carrito[existingProductIndex].quantity += 1;
} else {
  carrito.push({ id, nombre, precio, quantity: 1 });
}
localStorage.setItem('carrito', JSON.stringify(carrito));
renderCart();
}




async function actualizarPrecio() {
// Solo necesitamos este método para actualizar el total cuando el método de pago cambie
await renderCart(); // Llama a renderCart para que se actualicen tanto los precios unitarios como el total
}





function toggleCartSidebar() {
cartSidebar.classList.toggle('show');
}


// Función de envío de pedido
function enviarPedido() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const total = totalElement.innerText;
  if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
  }

  let mensaje = "Detalle de Pedido:\n";
  carrito.forEach(item => {
    mensaje += `Producto: ${item.nombre}, Cantidad: ${item.quantity}, Precio: $${item.precio.toLocaleString('es-CL')}\n`;
  });
  mensaje += `Total a Pagar: $${total}`;

  alert(mensaje); // Puedes reemplazar esto con una función para enviar el mensaje por WhatsApp u otro método.
}

// Hacer que las funciones estén disponibles en el ámbito global
window.toggleCartSidebar = toggleCartSidebar;
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarPrecio = actualizarPrecio;  // Asegúrate de que actualizarPrecio esté en el global
window.enviarPedido = enviarPedido; // Para la función de envío
window.updateQuantity = updateQuantity;

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  // Asegura que la función esté disponible después de cargar el DOM
  window.actualizarPrecio = actualizarPrecio;
});




// Exportar funciones necesarias para otros módulos
export { agregarAlCarrito }
