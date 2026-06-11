$(() => {
  const map = $('#map').dxMap({
    center: 'Los Angeles, CA',
    zoom: 14,
    height: 440,
    width: '100%',
    provider: 'google',
    apiKey: {
      google: 'YOUR-API-KEY',
    },
    onReady(e) {
      const originalMap = e.originalMap;

      const input = document.getElementById('pac-input');
      const types = document.getElementById('type-selector');

      originalMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      originalMap.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', originalMap);

      const infoWindow = new google.maps.InfoWindow();
      const marker = new google.maps.Marker({
        map: originalMap,
        anchorPoint: new google.maps.Point(0, -29),
      });

      autocomplete.addListener('place_changed', () => {
        infoWindow.close();
        marker.setVisible(false);
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          originalMap.fitBounds(place.geometry.viewport);
        } else {
          originalMap.setCenter(place.geometry.location);
          originalMap.setZoom(17); // Why 17? Because it looks good.
        }

        marker.setIcon({
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35),
        });
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        let address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name) || '',
            (place.address_components[1] && place.address_components[1].short_name) || '',
            (place.address_components[2] && place.address_components[2].short_name) || '',
          ].join(' ');
        }

        infoWindow.setContent(`<div><strong>${place.name}</strong><br>${address}`);
        infoWindow.open(originalMap, marker);
      });

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      function setupClickListener(id, placeTypes) {
        const radioButton = document.getElementById(id);
        radioButton.addEventListener('click', () => {
          autocomplete.setTypes(placeTypes);
        });
      }

      setupClickListener('changetype-all', []);
      setupClickListener('changetype-address', ['address']);
      setupClickListener('changetype-establishment', ['establishment']);
      setupClickListener('changetype-geocode', ['geocode']);
    },
  }).dxMap('instance');
});
