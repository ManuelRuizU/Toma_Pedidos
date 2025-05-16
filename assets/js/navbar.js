// navbar.js
function renderNavbar(categorias) {
  const navbarCategories = document.getElementById('navbarCategories');
  navbarCategories.innerHTML = ''; // Limpiar el contenido del navbar

  // Crear las categorías
  categorias.forEach(categoria => {
    const navItem = document.createElement('li');
    navItem.classList.add('nav-item', 'dropdown', 'text-center');
    navItem.style.marginRight = "15px";

    const navLink = document.createElement('a');
    navLink.classList.add('nav-link', 'dropdown-toggle');
    navLink.href = `#categoria-${categoria.id}`; // Link a la categoría
    navLink.setAttribute('role', 'button');
    navLink.setAttribute('data-bs-toggle', 'dropdown');
    navLink.setAttribute('aria-expanded', 'false');

    // Agregar imagen de categoría (si tiene)
    if (categoria.imagen) {
      // Crear el contenedor circular
      const imgContainer = document.createElement('div');
    
      // Estilos para el contenedor circular
      imgContainer.style.width = '80px'; // Ancho del círculo
      imgContainer.style.height = '80px'; // Alto del círculo
      imgContainer.style.borderRadius = '50%'; // Crear círculo
      imgContainer.style.overflow = 'hidden'; // Imagen no se sale del círculo
      imgContainer.style.backgroundColor = '#ff5405'; // Fondo naranja del círculo
      imgContainer.style.display = 'flex'; // Centrar contenido
      imgContainer.style.alignItems = 'center'; // Centrar verticalmente
      imgContainer.style.justifyContent = 'center'; // Centrar horizontalmente
      imgContainer.style.margin = '0 auto'; // Centrar el círculo en el contenedor padre
    
      // Crear la imagen
      const img = document.createElement('img');
      img.src = categoria.imagen;
      img.alt = categoria.nombre;
    
      // Estilos para la imagen
      img.style.width = '120%'; // Asegura que la imagen ocupe el ancho del círculo
      img.style.height = '120%'; // Asegura que la imagen ocupe el alto del círculo
      img.style.objectFit = 'cover'; // Ajusta la imagen dentro del círculo sin deformarse
    
      // Añadir la imagen al contenedor circular
      imgContainer.appendChild(img);
    
      // Añadir el contenedor circular al enlace
      navLink.appendChild(imgContainer);
    }
      

    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.marginTop = '5px';
    span.style.color = '#ff5733';
    span.textContent = categoria.nombre;
    navLink.appendChild(span);

    navItem.appendChild(navLink);

    // Crear el dropdown para las subcategorías
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu');

    categoria.subcategorias.forEach(subcategoria => {
      const dropdownItem = document.createElement('li');
      const subcategoriaLink = document.createElement('a');
      subcategoriaLink.classList.add('dropdown-item');
      subcategoriaLink.href = `#subcategoria-${subcategoria.id}`; // Enlace a la subcategoría
      subcategoriaLink.textContent = subcategoria.nombre;

      // Añadir evento de clic para desplazamiento suave
      subcategoriaLink.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el comportamiento de navegación predeterminado

        // Desplazamiento suave a la subcategoría
        const target = document.querySelector(subcategoriaLink.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn(`El destino #${targetId} no se encontró en la página.`);
        }
      });

      dropdownItem.appendChild(subcategoriaLink);
      dropdownMenu.appendChild(dropdownItem);
    });

    navItem.appendChild(dropdownMenu);
    navbarCategories.appendChild(navItem);
  });
}

export { renderNavbar };









