var map;

function openMap(lineNumber) {
    var frameContainer = document.getElementById('content');
    var htmlContent = '';

    // Contenido HTML para la información de la ruta y los botones
    htmlContent += `<div class="contHeder contHeder${lineNumber}A">`;
    htmlContent += `<h2 class="Title_i Title_i${lineNumber}A">Línea ${lineNumber}</h2>`;
    htmlContent += `<h3 class="parafo parafo${lineNumber}A">Unidades Disponibles</h3>`;
    htmlContent += `<button id="ruta${lineNumber}A" class="button_ruta button_ruta${lineNumber}A" onclick="obtenerRuta(${lineNumber})"> ver ruta ${lineNumber}</button>`;
    htmlContent += `</div>`;
    htmlContent += `<div id="radioButtons" class="cont_radioButtons cont_radioButtons${lineNumber}A">`;
    // Generar botones de radio para las unidades
    for (var i = 1; i <= 8; i++) {
        htmlContent += `<input type="radio" id="radio${lineNumber}${i}A" class="itemRadio itemRadio${lineNumber}${i}A" name="unidad" value="unidad${lineNumber}${i}">
                        <label for="radio${lineNumber}${i}A">Unidad ${lineNumber}${i}</label><br>`;
    }
    htmlContent += `</div>`;
    htmlContent += `<div id="map" class="div_Map div_Map${lineNumber}A" style="position: relative;"></div>`;
    // Controles para el tipo de mapa
    htmlContent += `<div class="map-controls map-controls${lineNumber}A">`;
    htmlContent += `<input type="radio" name="map-type" id="satellite${lineNumber}" value="satellite">`;
    htmlContent += `<label for="satellite${lineNumber}">Satélite</label>`;
    htmlContent += `<input type="radio" name="map-type" id="terrain${lineNumber}" value="terrain">`;
    htmlContent += `<label for="terrain${lineNumber}">Relieve</label>`;
    htmlContent += `</div>`;
    frameContainer.innerHTML = htmlContent;
    initMap(lineNumber);
}

function obtenerRuta(lineNumber) {
    // Realizar la solicitud al servidor para obtener la ruta
    fetch(`conexionesPHP/optener_ruta.php?lineNumber=${lineNumber}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Error al obtener la ruta desde la base de datos.');
        })
        .then(data => {
            if (data.success) {
                // Llamar a la función mostrarRutaMapbox con las coordenadas obtenidas
                mostrarRutaMapbox(lineNumber, data.coordenadas);
            } else {
                throw new Error(data.error || 'Error al obtener la ruta desde la base de datos.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al obtener la ruta desde la base de datos.');
        });
}

function mostrarRutaMapbox(lineNumber) {
    var divMap = document.getElementById(`map`);
    if (!divMap) {
        console.error(`Elemento divMap no encontrado.`);
        return;
    }

    // Limpiar el contenido existente del contenedor del mapa
    divMap.innerHTML = '';

    // Crear un nuevo div para el mapa y la ruta
    var mapContainer = document.createElement('div');
    mapContainer.className = 'map-container';
    mapContainer.id = `mapRuta${lineNumber}`;

    // Agregar el nuevo div al contenedor del mapa
    divMap.appendChild(mapContainer);

    // Obtener la ruta correspondiente del servidor
    fetch(`conexionesPHP/optener_ruta.php?lineNumber=${lineNumber}`)
        .then(response => response.json())
        .then(data => {
            // Imprimir los datos de la ruta en la consola
            console.log('Datos de la ruta:', data);

            // Verificar si la respuesta del servidor indica éxito y contiene coordenadas
            if (data.success && data.coordenadas) {
                const ruta = JSON.parse(data.coordenadas);

                // Inicializar el mapa de Mapbox y mostrar la ruta
                mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0dXIyMDAwbHAiLCJhIjoiY2x1anl6MXM0MGxoeTJ2bzFmODVlOGZ0MSJ9._K2GYzR2Obyc1Yi4yxQ81g';

                const map = new mapboxgl.Map({
                    container: mapContainer,
                    style: 'mapbox://styles/mapbox/streets-v12', // Estilo de mapa deseado
                    center: [0, 0], // Centrar en el ecuador
                    zoom: 1 // Nivel de zoom inicial para mostrar todo el planeta
                });

                // Añadir marcador de inicio
                new mapboxgl.Marker()
                    .setLngLat([ruta[0][0], ruta[0][1]])
                    .setPopup(new mapboxgl.Popup().setHTML('<h3>Inicio</h3>'))
                    .addTo(map);

                // Añadir marcador de fin
                new mapboxgl.Marker()
                    .setLngLat([ruta[ruta.length - 1][0], ruta[ruta.length - 1][1]])
                    .setPopup(new mapboxgl.Popup().setHTML('<h3>Fin</h3>'))
                    .addTo(map);

                // Añadir la capa de la ruta al mapa
                map.on('load', function () {
                    map.addLayer({
                        'id': `route${lineNumber}`,
                        'type': 'line',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': ruta
                                }
                            }
                        },
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#00D149',
                            'line-width': 5
                        }
                    });

                    // Obtener los límites de la ruta
                    var bounds = ruta.reduce(function(bounds, coord) {
                        return bounds.extend(coord);
                    }, new mapboxgl.LngLatBounds(ruta[0], ruta[0]));

                    // Ajustar el mapa para que los límites de la ruta estén visibles
                    map.fitBounds(bounds, {
                        padding: 50, // Añadir un espacio alrededor de los límites de la ruta
                        duration: 3000 // Duración de la animación en milisegundos (3 segundos)
                    });
                });

                // Escuchar cambios en el tipo de mapa seleccionado
                document.querySelectorAll(`input[name="map-type"]`).forEach(function (input) {
                    input.addEventListener('change', function () {
                        var mapType = this.value;
                        if (mapType === 'satellite') {
                            map.setStyle('mapbox://styles/mapbox/satellite-v9');
                        } else if (mapType === 'terrain') {
                            map.setStyle('mapbox://styles/mapbox/outdoors-v11');
                        }
                    });
                });

            } else {
                console.error(`No se encontró la ruta ${lineNumber} en la respuesta del servidor.`);
            }
        })
        .catch(error => {
            console.error('Error al obtener la ruta desde el servidor:', error);
        });
}


function initMap(lineNumber) {
    var myLatLng = { lat: -13.6175533, lng: -72.8681635 };

    map = new google.maps.Map(document.getElementById(`map`), {
        center: myLatLng,
        zoom: 15,
        mapTypeId: 'roadmap'
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Universidad Nacional Micaela Bastidas de Apurímac'
    });

    // Escuchar cambios en el tipo de mapa seleccionado
    document.querySelectorAll(`input[name="map-type"]`).forEach(function (input) {
        input.addEventListener('change', function () {
            var mapType = this.value;
            if (mapType === 'satellite') {
                map.setMapTypeId('satellite');
            } else if (mapType === 'terrain') {
                map.setMapTypeId('terrain');
            }
        });
    });
}

// Abrir el mapa al cargar la página
openMap(1);
