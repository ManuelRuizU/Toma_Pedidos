
function mostrarFuegosArtificiales() {
    const button = document.getElementById('cart-button');
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const cantidadChispas = 20; // Número de chispas por explosión

    // Crear el contenedor de la explosión
    const contenedor = document.createElement('div');
    contenedor.classList.add('explosion-container');
    contenedor.style.left = `${rect.left + rect.width / 2}px`;
    contenedor.style.top = `${rect.top}px`;
    document.body.appendChild(contenedor);

    for (let i = 0; i < cantidadChispas; i++) {
        const chispa = document.createElement('div');
        chispa.classList.add('spark');

        // Animación aleatoria para cada chispa
        chispa.style.setProperty('--angle', `${Math.random() * 360}deg`);
        chispa.style.setProperty('--distance', `${30 + Math.random() * 50}px`);
        chispa.style.setProperty('--duration', `${800 + Math.random() * 400}ms`);

        contenedor.appendChild(chispa);
    }

    // Eliminar la explosión después de 1.5 segundos
    setTimeout(() => contenedor.remove(), 1500);
}


export { mostrarMensajeCarrito };