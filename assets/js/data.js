// data.js
export function loadData() {
    return fetch('assets/json/productos.json')
      .then(response => response.json())
      .catch(error => console.error('Error al cargar el archivo JSON:', error));
  }


