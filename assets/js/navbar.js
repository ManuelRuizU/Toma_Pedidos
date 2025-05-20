// navbar.js



function renderNavbar(categorias) {
    const navbarCategories = document.getElementById('navbarCategories');
    navbarCategories.innerHTML = ''; // Limpiar contenido

    const fragment = document.createDocumentFragment();

    categorias.forEach(categoria => {
        const navItem = document.createElement('li');
        navItem.classList.add('nav-item', 'dropdown', 'text-center');
        navItem.style.marginRight = "15px";

        const navLink = document.createElement('a');
        navLink.classList.add('nav-link', 'dropdown-toggle');
        navLink.href = `#categoria-${categoria.id}`;
        navLink.setAttribute('role', 'button');
        navLink.setAttribute('data-bs-toggle', 'dropdown');
        navLink.setAttribute('aria-expanded', 'false');

        if (categoria.imagen) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('categoria-img');

            const img = document.createElement('img');
            img.src = categoria.imagen;
            img.alt = categoria.nombre;
            img.classList.add('img-fluid');

            imgContainer.appendChild(img);
            navLink.appendChild(imgContainer);
        }

        const span = document.createElement('span');
        span.classList.add('categoria-nombre');
        span.textContent = categoria.nombre;
        navLink.appendChild(span);

        navItem.appendChild(navLink);

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown-menu');

        categoria.subcategorias.forEach(subcategoria => {
            const dropdownItem = document.createElement('li');
            const subcategoriaLink = document.createElement('a');
            subcategoriaLink.classList.add('dropdown-item');
            subcategoriaLink.href = `#subcategoria-${subcategoria.id}`;
            subcategoriaLink.setAttribute('data-id', `subcategoria-${subcategoria.id}`);
            subcategoriaLink.textContent = subcategoria.nombre;

            // 🔹 Cerrar el navbar en modo móvil con un retraso de 1.5 segundos
            subcategoriaLink.addEventListener('click', (event) => {
                event.preventDefault();
                const target = document.querySelector(subcategoriaLink.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // 🔹 Esperar 1.5 segundos antes de cerrar el navbar
                setTimeout(() => {
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        new bootstrap.Collapse(navbarCollapse).hide();
                    }
                }, 1200); // 1.2 segundos de espera
            });

            dropdownItem.appendChild(subcategoriaLink);
            dropdownMenu.appendChild(dropdownItem);
        });

        navItem.appendChild(dropdownMenu);
        fragment.appendChild(navItem);
    });

    navbarCategories.appendChild(fragment);
}


// 🔹 Delegación de eventos para mejor rendimiento
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("dropdown-item")) {
        event.preventDefault();
        const target = document.getElementById(event.target.getAttribute("data-id"));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});


export { renderNavbar };








