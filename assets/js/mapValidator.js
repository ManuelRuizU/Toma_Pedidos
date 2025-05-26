// assets/js/mapValidator.js


// Variables globales para el mapa y el geocodificador
let map;
let marker;
let geocoder;
// ✅ Flag para saber si la dirección ha sido validada con éxito.
export let addressValidated = false;
// ✅ Exporta la función showMessage para que whatsapp.js o utilsPedido.js puedan usarla
export { showMessage };

// Elementos del DOM (obtenidos directamente aquí o importados si fuera un módulo de elementos)
const addressInput = document.getElementById('direccion');
const validateAddressBtn = document.getElementById('validateAddressBtn');
const addressMessageDiv = document.getElementById('address-message');
const mapContainer = document.getElementById('map-container');
const tipoEntregaSelect = document.getElementById('tipoentrega');

// ✅ Exporta handleTipoEntregaChange directamente
export function handleTipoEntregaChange() {
    // Busca el div padre que contiene el input de dirección para ocultarlo/mostrarlo
    // Usamos .closest('.mb-3') para encontrar el contenedor Bootstrap
    const direccionInputGroup = addressInput ? addressInput.closest('.mb-3') : null;
    // Busca el div padre que contiene el botón de validar para ocultarlo/mostrarlo
    const validateButtonContainer = validateAddressBtn ? validateAddressBtn.closest('.mb-3') : null;

    if (tipoEntregaSelect && tipoEntregaSelect.value === 'Domicilio') {
        if (direccionInputGroup) direccionInputGroup.style.display = 'block';
        if (validateButtonContainer) validateButtonContainer.style.display = 'block';
        if (addressInput) addressInput.required = true; // Hace el campo requerido

        // Solo muestra el mapa si ya hay una dirección validada y el input tiene contenido
        if (addressValidated && (addressInput && addressInput.value.trim())) {
            if (mapContainer) mapContainer.style.display = 'block';
        } else {
            if (mapContainer) mapContainer.style.display = 'none'; // Oculta si no está validado o no hay texto
        }
    } else {
        // Retiro en local o tipo de entrega no seleccionado
        if (direccionInputGroup) direccionInputGroup.style.display = 'none';
        if (validateButtonContainer) validateButtonContainer.style.display = 'none';
        if (addressInput) addressInput.required = false; // Quita el requisito
        if (mapContainer) mapContainer.style.display = 'none'; // Siempre oculta el mapa si no es a domicilio
        showMessage('', ''); // Limpia cualquier mensaje de dirección
        addressValidated = true; // ✅ Considera la dirección "validada" para retiro en local
                               // Así no bloqueamos el envío de pedidos para retiro en local
    }
}


/**
 * Función de inicialización del mapa de Google.
 * Es llamada por el parámetro 'callback' en la URL de la API de Google Maps.
 * DEBE ser global (adjunta a window) porque el callback de la API no soporta módulos directamente.
 */
window.initMap = function() {
    // Inicializa el mapa con una vista por defecto (ej: Angol, Chile)
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: -37.7981, lng: -72.7145 } // Coordenadas de Angol, Chile
    });

    // Inicializa el geocodificador
    geocoder = new google.maps.Geocoder();

    // Oculta el contenedor del mapa y el mensaje al inicio (si los elementos existen)
    if (mapContainer) mapContainer.style.display = 'none';
    if (addressMessageDiv) addressMessageDiv.style.display = 'none';


    // ✅ Agrega el evento de clic al botón de validar dirección
    if (validateAddressBtn) {
        validateAddressBtn.addEventListener('click', () => {
            const address = addressInput ? addressInput.value.trim() : '';
            if (address) {
                geocodeAddress(address);
            } else {
                showMessage('Por favor, introduce una dirección para validar.', 'error');
                if (mapContainer) mapContainer.style.display = 'none';
                addressValidated = false; // Resetear el estado de validación
            }
        });
    }

    // ✅ Agrega un listener para el cambio en el tipo de entrega
    // y llama al handler al inicio para establecer el estado correcto si ya hay un valor
    if (tipoEntregaSelect) {
        tipoEntregaSelect.addEventListener('change', handleTipoEntregaChange);
        handleTipoEntregaChange();
    }
};

/**
 * Realiza la geocodificación de una dirección.
 * Usa el Geocoder de Google Maps para convertir una dirección en coordenadas.
 * @param {string} address - La dirección a geocodificar.
 */
function geocodeAddress(address) {
    showMessage('Validando dirección...', '');
    if (mapContainer) mapContainer.style.display = 'none';
    addressValidated = false; // Resetear antes de intentar validar

    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
            if (results[0]) {
                const location = results[0].geometry.location;
                if (map) { // Asegurarse de que el mapa está inicializado
                    map.setCenter(location);
                    map.setZoom(16);
                }

                if (marker) {
                    marker.setMap(null); // Elimina el marcador anterior
                }

                marker = new google.maps.Marker({
                    map: map,
                    position: location,
                    title: results[0].formatted_address
                });

                showMessage(`Dirección validada: ${results[0].formatted_address}`, 'success');
                if (mapContainer) mapContainer.style.display = 'block';
                addressValidated = true; // ✅ La dirección ha sido validada con éxito
                if (addressInput) addressInput.value = results[0].formatted_address; // Autocompleta
            } else {
                showMessage('No se encontraron resultados para la dirección. Intenta ser más específico.', 'error');
                if (mapContainer) mapContainer.style.display = 'none';
                addressValidated = false;
            }
        } else {
            let errorMessage = 'Error al validar la dirección: ';
            switch (status) {
                case 'ZERO_RESULTS':
                    errorMessage += 'No se encontró ninguna dirección.';
                    break;
                case 'OVER_QUERY_LIMIT':
                    errorMessage += 'Has excedido el límite de solicitudes. Intenta de nuevo más tarde.';
                    break;
                case 'REQUEST_DENIED':
                    errorMessage += 'La solicitud fue denegada. Verifica tu clave de API y las restricciones.';
                    console.error('Google Maps Geocoding API Error:', status);
                    break;
                case 'INVALID_REQUEST':
                    errorMessage += 'Solicitud inválida. Asegúrate de que la dirección sea correcta.';
                    break;
                default:
                    errorMessage += `Error desconocido (${status}).`;
            }
            showMessage(errorMessage, 'error');
            if (mapContainer) mapContainer.style.display = 'none';
            addressValidated = false;
        }
    });
}

/**
 * Muestra un mensaje al usuario en el div de mensajes de dirección.
 * @param {string} msg - El mensaje a mostrar.
 * @param {string} type - El tipo de mensaje ('success' o 'error').
 */
function showMessage(msg, type) {
    if (addressMessageDiv) {
        addressMessageDiv.textContent = msg;
        addressMessageDiv.className = 'message'; // Limpia clases anteriores
        if (msg) {
            addressMessageDiv.style.display = 'block';
            if (type) {
                addressMessageDiv.classList.add(type);
            }
        } else {
            addressMessageDiv.style.display = 'none'; // Oculta si el mensaje está vacío
        }
    }
}


