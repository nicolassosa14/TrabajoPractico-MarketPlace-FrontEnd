<template>
  <div ref="mapContainer" style="height: 100%; width: 100%; border-radius: 15px; box-shadow: 0 0 10px rgba(0,0,0,0.1);"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  address: {
    type: Object,
    default: null
  },
  isEditable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['address-updated']);

const mapContainer = ref(null);
let map = null;
let marker = null;

const initMap = () => {
  if (map || !mapContainer.value) return;
  
  map = L.map(mapContainer.value).setView([-31.430203, -62.085264], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  if (props.isEditable) {
    map.on('click', handleMapClick);
  }
};

const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
    const data = await response.json();
    if (data && data.address) {
      const street = data.address.road || '';
      const houseNumber = data.address.house_number || '';
      
      const street_address = houseNumber ? `${street} ${houseNumber}` : street;

      emit('address-updated', {
        street_address: street_address,
        city: data.address.city || data.address.town || data.address.village || '',
        postal_code: data.address.postcode || ''
      });
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }
};

const handleMapClick = (e) => {
  const { lat, lng } = e.latlng;
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    addMarker([lat, lng]);
  }
  reverseGeocode(lat, lng);
};

const addMarker = (latlng) => {
    if (marker) map.removeLayer(marker);

    marker = L.marker(latlng, { draggable: props.isEditable }).addTo(map);

    if (props.isEditable) {
        marker.on('dragend', (e) => {
            const { lat, lng } = e.target.getLatLng();
            reverseGeocode(lat, lng);
        });
    }
}

const updateMap = (newAddress) => {
  if (!newAddress || !map || !newAddress.latitude || !newAddress.longitude) {
    if (marker) {
        map.removeLayer(marker);
        marker = null;
    }
    return;
  }

  const { latitude, longitude } = newAddress;
  map.flyTo([latitude, longitude], 16);
  addMarker([latitude, longitude]);
  marker.bindPopup(`<b>${newAddress.street_address}</b><br>${newAddress.city}`).openPopup();
};

onMounted(() => {
  initMap();
  if (props.address) {
    updateMap(props.address);
  }
});

watch(() => props.address, (newAddress) => {
  updateMap(newAddress);
});

</script>
