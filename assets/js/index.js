
import { loadData } from './data.js';
import { renderNavbar } from './navbar.js';
import { renderProducts } from './productRenderer.js';
import { renderSubcategories } from './filtros.js';
import './eventListeners.js';

loadData()
  .then(data => {
    renderNavbar(data.categorias);
    renderProducts(data);
    renderSubcategories(data.categorias);
  })
  .catch(error => console.error('Error al cargar el archivo JSON:', error));