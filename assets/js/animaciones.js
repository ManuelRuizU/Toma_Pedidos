// assets/js/animaciones.js

// Mostrar mensaje al agregar un producto al carrito
function mostrarMensajeCarrito() {
    const button = document.getElementById('cart-button');
    if (!button) return;

    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('img');
        heart.classList.add('heart-animation');
        heart.src = 'assets/img/icono/santa-claus.png';

        const rect = button.getBoundingClientRect();
        heart.style.position = 'fixed';
        heart.style.left = `${rect.left + rect.width / 2}px`;
        heart.style.top = `${rect.top}px`;

        heart.animate(
            [
                { transform: 'translateY(0)', opacity: 1 },
                { transform: 'translateY(-50px)', opacity: 0 }
            ],
            {
                duration: 1200,
                easing: 'ease-out',
            }
        );

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    }
}

// Mostrar corazones animados desde un botón
function showHearts(button) {
    const heart = document.createElement('div');
    heart.classList.add('heart-animation');
    heart.innerHTML = '❤️';

    const rect = button.getBoundingClientRect();
    heart.style.left = `${rect.left + rect.width / 2}px`;
    heart.style.top = `${rect.top - 10}px`;

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

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

// Exportar funciones de animación
export { mostrarMensajeCarrito, showHearts };
