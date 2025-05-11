// assets/js/animaciones.js

// Mostrar mensaje al agregar un producto al carrito
function mostrarMensajeCarrito() {
    const button = document.getElementById('cart-button');
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const delayIncrement = 200; // Retraso entre cada ícono en milisegundos

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const icon = document.createElement('img');
            icon.classList.add('icon-animation');
            icon.src = 'assets/img/icono/santa-claus.png'; // Ruta del ícono

            // Posicionar el ícono cerca del botón
            icon.style.position = 'fixed';
            icon.style.left = `${rect.left + rect.width / 2 + (Math.random() * 20 - 10)}px`; // Variación horizontal
            icon.style.top = `${rect.top + (Math.random() * 10 - 5)}px`; // Variación vertical

            // Añadir animación al ícono
            document.body.appendChild(icon);

            // Remover el ícono después de 1.2 segundos (ajustado al tiempo de la animación CSS)
            setTimeout(() => icon.remove(), 1200);
        }, i * delayIncrement); // Retraso progresivo para cada ícono
    }
}



export { mostrarMensajeCarrito };
