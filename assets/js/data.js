// data.js
let cachedData = null; // Definir la variable antes de usarla
export async function loadData() {
    if (cachedData) {
        return cachedData;
    }

    const storedData = localStorage.getItem('productos');
    if (storedData) {
        cachedData = JSON.parse(storedData);
        return cachedData;
    }

    try {
        const response = await fetch('assets/json/productos.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
        }
        cachedData = await response.json();
        localStorage.setItem('productos', JSON.stringify(cachedData)); // Guardar en localStorage
        return cachedData;
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
        alert('No se pudo cargar los productos.');
        throw error;
    }
}



