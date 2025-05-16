import { loadData } from './data.js';

// Función para renderizar la rueda con las categorías
function renderWheel(categorias) {
  const wheel = document.querySelector('.wheel');

  // Crear círculos para cada categoría
  categorias.forEach((categoria, index) => {
    const circle = document.createElement('div');
    circle.classList.add('circle', 'pop');
    circle.style.left = `calc(50% + ${Math.cos(index * Math.PI / 180 * (360 / categorias.length)) * 150}px - 40px)`;
    circle.style.top = `calc(50% + ${Math.sin(index * Math.PI / 180 * (360 / categorias.length)) * 150}px - 40px)`;

    // Crear contenedor para la imagen y el texto
    const content = document.createElement('div');
    content.style.position = 'absolute';
    content.style.top = '50%';
    content.style.left = '50%';
    content.style.transformOrigin = 'center';
    content.style.transform = 'translate(-50%, -50%)';

    // Crear imagen para la categoría
    const imgContainer = document.createElement('div');
    imgContainer.style.width = '80px';
    imgContainer.style.height = '80px';
    imgContainer.style.borderRadius = '50%';
    imgContainer.style.overflow = 'hidden';
    imgContainer.style.backgroundColor = '#ff5405';
    imgContainer.style.display = 'flex';
    imgContainer.style.alignItems = 'center';
    imgContainer.style.justifyContent = 'center';

    const img = document.createElement('img');
    img.src = categoria.imagen;
    img.alt = categoria.nombre;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    imgContainer.appendChild(img);
    content.appendChild(imgContainer);

    // Crear texto para la categoría
    const span = document.createElement('span');
    span.textContent = categoria.nombre;
    content;
    content.appendChild(span);

    circle.appendChild(content);

    // Agregar evento de clic para redirigir a la categoría
    circle.addEventListener('click', () => {
      window.location.href = `index.html?categoria=${categoria.id}`;
    });

    wheel.appendChild(circle);
  });
}

// Variables para la interacción con la rueda
let angle = 0;
let velocity = 0;
let isDragging = false;
let lastY = 0;
let animationFrame;

// Función para establecer la rotación de la rueda
function setRotation(deg) {
  const wheel = document.querySelector('.wheel');
  wheel.style.transform = `rotate(${deg}deg)`;
  wheel.style.setProperty('--wheel-rotation', `${deg}deg`);

  const circles = document.querySelectorAll('.circle > div');
  circles.forEach(circle => {
    circle.style.transform = `translate(-50%, -50%) rotate(${-deg}deg)`;
  });
}

// Función para animar la inercia de la rueda
function animateInertia() {
  angle += velocity;
  velocity *= 0.97;
  setRotation(angle);

  if (Math.abs(velocity) > 0.05) {
    animationFrame = requestAnimationFrame(animateInertia);
  } else {
    cancelAnimationFrame(animationFrame);
  }
}

// Eventos para la interacción con la rueda
function onMouseDown(e) {
  isDragging = true;
  lastY = e.clientY;
  cancelAnimationFrame(animationFrame);
}

function onMouseMove(e) {
  if (!isDragging) return;
  const deltaY = e.clientY - lastY;
  velocity = deltaY * 0.3;
  angle += velocity;
  setRotation(angle);
  lastY = e.clientY;
}

function onMouseUp() {
  isDragging = false;
  animateInertia();
}

function onTouchStart(e) {
  console.log('Touch start');
  isDragging = true;
  lastY = e.touches[0].clientY;
  cancelAnimationFrame(animationFrame);
}

function onTouchMove(e) {
  console.log('Mouse down');
  if (!isDragging) return;
  const deltaY = e.touches[0].clientY - lastY;
  velocity = deltaY * 0.15;
  angle += velocity;
  setRotation(angle);
  lastY = e.touches[0].clientY;
}

function onTouchEnd() {
  isDragging = false;
  animateInertia();
}

// Cargar datos y renderizar la rueda
loadData()
  .then(data => {
    document.querySelector('.central-circle').innerHTML = `
      <a href="index.html">
        <img src="assets/img/logo/kamon_logo.png" alt="Kamon Logo">
      </a>
    `;
    renderWheel(data.categorias);

    // Agregar eventos de interacción a la rueda
    const wheel = document.querySelector('.wheel');
    wheel.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    wheel.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  })
  .catch(error => console.error('Error al cargar el archivo JSON:', error));

