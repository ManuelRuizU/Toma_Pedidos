// data.js
// assets/js/data.js
let cachedData = null;

export function loadData() {
    if (cachedData) {
        return Promise.resolve(cachedData); // Retornar datos cacheados si ya están disponibles
    }

    return fetch('assets/json/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            cachedData = data; // Guardar los datos en caché
            return cachedData;
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
            throw error;
        });
}




