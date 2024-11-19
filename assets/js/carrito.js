// assets/js/carrito.js
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

  // Agregar evento a los botones de agregar al carrito
  const addToCartButton = document.querySelectorAll('.btn-primary'); 
  addToCartButton.forEach(button => {
      button.addEventListener('click', () => {
          mostrarMensajeCarrito(); 
          const productoId = button.parentElement.querySelector('button').getAttribute('onclick').match(/'(\w+)'/)[1];
          const productoNombre = button.parentElement.querySelector('h5').textContent;
          const precioEfectivo = button.parentElement.querySelector('p:nth-child(3)').textContent.match(/: \$([\d.]+)/)[1];
          const precioTransferenciaTarjeta = button.parentElement.querySelector('p:nth-child(4)').textContent.match(/: \$([\d.]+)/)[1];
          const precio = (metodoPago === 'Tarjeta' || metodoPago === 'Transferencia') ? precioTransferenciaTarjeta : precioEfectivo;
          agregarAlCarrito(productoId, productoNombre, precio);
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

// funcion imagenes animadas desde img
function mostrarMensajeCarrito() {
  const button = document.getElementById('cart-button');
  if (!button) return;

  for (let i = 0; i < 5; i++) { // Generar 4 imágenes animadas
      const heart = document.createElement('img'); // Crear un elemento img
      heart.classList.add('heart-animation');
      heart.src = 'assets/img/icono/santa-claus.png'; // Ajusta la ruta según tu proyecto

      // Obtener la posición del botón en relación a la ventana
      const rect = button.getBoundingClientRect();

      // Usar posición fija para mantener las imágenes visibles
      heart.style.position = 'fixed';
      heart.style.left = `${rect.left + rect.width / 5}px`; // Centrado horizontalmente respecto al botón
      heart.style.top = `${rect.top + rect.height / 2}px`; // Centrado verticalmente respecto al botón

      // Aplicar un desplazamiento aleatorio
      const randomOffsetX = Math.random() * 50 - 25; // Desplazamiento horizontal aleatorio
      const randomOffsetY = Math.random() * 50 - 25; // Desplazamiento vertical aleatorio
      heart.style.left = `${parseFloat(heart.style.left) + randomOffsetX}px`;
      heart.style.top = `${parseFloat(heart.style.top) + randomOffsetY}px`;

      // Añadir la imagen al DOM
      document.body.appendChild(heart);

      // Animación hacia arriba y desvanecimiento
      heart.animate(
          [
              { transform: 'translateY(0)', opacity: 1 },
              { transform: 'translateY(-50px)', opacity: 1 }
          ],
          {
              duration: 2000 + i * 1000, // Añadir un pequeño desfase entre imágenes
              easing: 'ease-out'
          }
      );

      // Eliminar la imagen del DOM después de la animación
      setTimeout(() => {
          heart.remove();
      }, 1200 + i * 300);
  }
}




const addToCartButton = document.querySelectorAll('.btn-primary'); // Selecciona los botones de agregar al carrito

addToCartButton.forEach(button => {
    button.addEventListener('click', () => {
        mostrarMensajeCarrito(); // Muestra el mensaje al agregar un producto
    });
});


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
  
  // Función para mostrar corazones animados
  function showHearts(button) {
      const heart = document.createElement('div');
      heart.classList.add('heart-animation');
      heart.innerHTML = '❤️';
      document.body.appendChild(heart);
  
      // Posición inicial cerca del botón
      const rect = button.getBoundingClientRect();
      heart.style.left = `${rect.left + rect.width / 2}px`;
      heart.style.top = `${rect.top - 10}px`;
  
      // Animación hacia arriba
      heart.animate(
          [
              { transform: 'translateY(0)', opacity: 1 },
              { transform: 'translateY(-50px)', opacity: 0 }
          ],
          {
              duration: 1000,
              easing: 'ease-out'
          }
      );
  
      // Eliminar el corazón del DOM después de la animación
      setTimeout(() => {
          heart.remove();
      }, 1000);
  }


// Enviar pedido
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
    alert(mensaje); // Reemplaza con la lógica de envío por WhatsApp si es necesario
}

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

export { agregarAlCarrito, limpiarCarrito, updateQuantity, renderCart };
