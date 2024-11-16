// navbar.js

function renderNavbar(categorias) {
    const navbarCategories = document.getElementById('navbarCategories');
    navbarCategories.innerHTML = '';
  
    categorias.forEach(categoria => {
      const navItem = document.createElement('li');
      navItem.classList.add('nav-item', 'dropdown', 'text-center', );
      navItem.style.marginRight = "15px";
  
      const navLink = document.createElement('a');
      navLink.classList.add('nav-link', 'dropdown-toggle');
      navLink.href = `#categoria-${categoria.id}`; // Actualizar enlace a la categoría
      navLink.setAttribute('role', 'button');
      navLink.setAttribute('data-bs-toggle', 'dropdown');
      navLink.setAttribute('aria-expanded', 'false');
  
      // Agregar imagen a la categoría (opcional)
      if (categoria.imagen) {
        const img = document.createElement('img');
        img.src = categoria.imagen;
        img.alt = categoria.nombre;
        img.classList.add('img-circle');
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.borderRadius = '50%';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        navLink.appendChild(img);
      }
  
      const span = document.createElement('span');
      span.style.display = 'block';
      span.style.marginTop = '5px';
      span.style.color = '#ff5733';
      span.textContent = categoria.nombre;
      navLink.appendChild(span);
  
      navItem.appendChild(navLink);
  
      const dropdownMenu = document.createElement('ul');
      dropdownMenu.classList.add('dropdown-menu');
  
      categoria.subcategorias.forEach(subcategoria => {
        const dropdownItem = document.createElement('li');
        const subcategoriaLink = document.createElement('a');
        subcategoriaLink.classList.add('dropdown-item');
        subcategoriaLink.href = `#subcategoria-${subcategoria.id}`; // Actualizar enlace a la subcategoría
        subcategoriaLink.textContent = subcategoria.nombre;
        
        dropdownItem.appendChild(subcategoriaLink);
        dropdownMenu.appendChild(dropdownItem);
      });
  
      navItem.appendChild(dropdownMenu);
      navbarCategories.appendChild(navItem);
    });
  }
  
  // Exporta la función para que pueda ser usada en otros archivos
  export { renderNavbar };





