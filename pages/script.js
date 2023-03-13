    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FsYXJjb24iLCJhIjoiY2w1bGdwcG1nMDFicjNicWlmcGVuN2JrdyJ9.7_1YOzG2Yjwr4trkN6bGbQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-90.53, 14.6], // Coordenadas del centro del mapa
        zoom: 13 // Nivel de zoom inicial
    });

    // Add geolocate control to the map
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }));

    // Add navigation control to the map
    map.addControl(new mapboxgl.NavigationControl());

    // Add scale control to the map
    map.addControl(new mapboxgl.ScaleControl());

    map.on('click', function(e) {
        // Obtener los límites alrededor del punto donde se hizo clic
        var bounds =  (e.lngLat.lat - 0.005) + ',' +(e.lngLat.lng - 0.005) + ',' + (e.lngLat.lat + 0.005)+ ',' + (e.lngLat.lng + 0.005);
      
        // Ejecutar el query de Overpass
        searchAmenities(bounds);
      });

      // Crear el botón
        var button = document.createElement("button");
        button.innerHTML = "Dibujar rectángulo";

        // Agregar el botón al div
        var div = document.getElementById("myDiv");
            div.appendChild(button);

        // Agregar evento al botón
        button.addEventListener("click", function() {
        // Tu código para dibujar el rectángulo
        });

   /* var draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        }
      });
      map.addControl(draw);
      
      map.on('draw.create', function(e) {
        var type = e.features[0].geometry.type;
        var coordinates = e.features[0].geometry.coordinates;
        console.log(type, coordinates);
      });
      
      map.on('draw.update', function(e) {
        var type = e.features[0].geometry.type;
        var coordinates = e.features[0].geometry.coordinates;
        console.log(type, coordinates);
      });
      
      map.on('draw.delete', function(e) {
        console.log('drawing deleted');
      });*/
      
      function searchAmenities(bounds) {
        var query = `[out:json][timeout:25];
            node["amenity"](${bounds});
          out body;
          >;
          out skel qt;`;

          console.log(query)
          
      
        $.ajax({
          url: 'https://z.overpass-api.de/api/interpreter',
          type: 'POST',
          data: { data: query },
          dataType: 'json',
          success: function(data) {
            var amenities = [];
            var counts = {};

            data.elements.forEach(function(element) {
              if (element.tags.amenity) {
                var amenity = element.tags.amenity;
                amenities.push({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [element.lon, element.lat]
                  },
                  properties: {
                    amenity: element.tags.amenity
                  }
                });

                if (!counts[amenity]) {
                    counts[amenity] = 0;
                  }
                  counts[amenity]++;

              }
            });

            //console.log(counts)
      
            map.addLayer({
              id: 'amenities',
              type: 'symbol',
              source: {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: amenities
                }
              },
              layout: {
                'icon-image': '{amenity}-15',
                'icon-allow-overlap': true
              },
              paint: {}
            });

            countAmenities(amenities);
          },
          error: function(error) {
            //console.log(`Error ${error}`)
            alert('No se pudieron encontrar amenidades cercanas.');
          }
        });
      }

      function countAmenities(amenities) {
        var counts = {};
        amenities.forEach(function(amenity) {
          var type = amenity.properties.amenity;
          if (counts[type]) {
            counts[type]++;
          } else {
            counts[type] = 1;
          }
        });

        console.log(counts);
        var list = document.getElementById('amenities-count');
        list.innerHTML = '';
        for (var type in counts) {
          var item = document.createElement('li');
          item.textContent = type + ': ' + counts[type];
          list.appendChild(item);
        }
        var panel = document.getElementById('panel');
        panel.classList.remove('hidden');
      }