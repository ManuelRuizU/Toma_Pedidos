// assets/js/mapValidator.js

let map;
let marker;
let geocoder;
export let addressValidated = false;
export { showMessage };

const linkMapaEl = document.getElementById("linkMapa");
if (linkMapaEl) linkMapaEl.textContent = '';
const addressInput = document.getElementById('direccion');
const deliveryAddressInput = document.getElementById('deliveryAddress');
const validateAddressBtn = document.getElementById('validateAddressBtn');
const addressMessageDiv = document.getElementById('address-message');
const mapContainer = document.getElementById('map-container');
const tipoEntregaSelect = document.getElementById('tipoentrega');
const differentDeliveryAddress = document.getElementById('differentDeliveryAddress');

let mapsLoaded = false;

function cargarGoogleMapsAPI() {
    if (mapsLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDsJJmGdCZ6RWQ3ZP12NgdtKaiG43KpnHk&libraries=places&callback=initMap';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            mapsLoaded = true;
            resolve();
        };
        script.onerror = () => reject(new Error('Error al cargar Google Maps API'));
        document.head.appendChild(script);
    });
}

window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: -37.7981, lng: -72.7145 }
    });

    geocoder = new google.maps.Geocoder();

    if (addressInput) {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            types: ['address'],
            componentRestrictions: { country: 'cl' }
        });
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && !differentDeliveryAddress.checked) {
                addressInput.value = place.formatted_address;
                geocodeAddress(place.formatted_address);
            }
        });
    }

    if (deliveryAddressInput) {
        const autocomplete = new google.maps.places.Autocomplete(deliveryAddressInput, {
            types: ['address'],
            componentRestrictions: { country: 'cl' }
        });
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && differentDeliveryAddress.checked) {
                deliveryAddressInput.value = place.formatted_address;
                geocodeAddress(place.formatted_address);
            }
        });
    }

    if (mapContainer) mapContainer.style.display = 'none';
    if (addressMessageDiv) addressMessageDiv.style.display = 'none';

    if (validateAddressBtn) {
        validateAddressBtn.addEventListener('click', () => {
            const address = differentDeliveryAddress.checked && deliveryAddressInput.value.trim()
                ? deliveryAddressInput.value.trim()
                : addressInput.value.trim();
            if (address) {
                geocodeAddress(address);
            } else {
                showMessage('Por favor, introduce una dirección para validar.', 'error');
                if (mapContainer) mapContainer.style.display = 'none';
                addressValidated = false;
            }
        });
    }
};

export function handleTipoEntregaChange() {
    const deliveryAddressContainer = document.getElementById('deliveryAddressContainer');
    if (addressInput) {
        addressInput.required = true;
    }

    if (tipoEntregaSelect.value === 'Domicilio') {
        cargarGoogleMapsAPI().then(() => {
            if (validateAddressBtn) validateAddressBtn.closest('.mb-3').style.display = 'block';
            if (deliveryAddressContainer) deliveryAddressContainer.style.display = differentDeliveryAddress.checked ? 'block' : 'none';

            if (addressValidated && (differentDeliveryAddress.checked ? deliveryAddressInput.value.trim() : addressInput.value.trim())) {
                if (mapContainer) mapContainer.style.display = 'block';
            } else {
                if (mapContainer) mapContainer.style.display = 'none';
                if ((differentDeliveryAddress.checked && deliveryAddressInput.value.trim()) || (!differentDeliveryAddress.checked && addressInput.value.trim())) {
                    showMessage('Por favor, valida la dirección ingresada.', 'error');
                }
            }
        }).catch((error) => {
            showMessage('Error al cargar el mapa. Por favor, intenta de nuevo.', 'error');
            console.error(error);
        });
    } else {
        if (validateAddressBtn) validateAddressBtn.closest('.mb-3').style.display = 'none';
        if (mapContainer) mapContainer.style.display = 'none';
        if (deliveryAddressContainer) deliveryAddressContainer.style.display = 'none';
        addressValidated = true;
        showMessage('', '');
    }
}

function geocodeAddress(address) {
    showMessage('Validando dirección...', '');
    if (mapContainer) mapContainer.style.display = 'none';
    addressValidated = false;

    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(16);

            if (marker) marker.setMap(null);
            marker = new google.maps.Marker({
                map: map,
                position: location,
                title: results[0].formatted_address
            });

            showMessage(`Dirección validada: ${results[0].formatted_address}`, 'success');
            if (mapContainer) mapContainer.style.display = 'block';
            addressValidated = true;
            const targetInput = differentDeliveryAddress.checked ? deliveryAddressInput : addressInput;
            targetInput.value = results[0].formatted_address;
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
                    errorMessage += 'La solicitud fue denegada. Verifica tu clave de API.';
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

function showMessage(msg, type) {
    if (addressMessageDiv) {
        addressMessageDiv.textContent = msg;
        addressMessageDiv.className = 'message';
        if (msg) {
            addressMessageDiv.style.display = 'block';
            if (type) addressMessageDiv.classList.add(type);
        } else {
            addressMessageDiv.style.display = 'none';
        }
    }
}




