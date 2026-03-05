// 1. Setup Peta (Fokus ke Johor Bahru)
const map = L.map('map').setView([1.4927, 103.7414], 14); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Integrasi Sentinel Hub
const instanceId = 'af969b2c-1f36-4605-891f-754518019c5c'; 

const ndviLayer = L.tileLayer.wms(`https://services.sentinel-hub.com/ogc/wms/${instanceId}`, {
    layers: 'NDVI',
    format: 'image/png',
    transparent: true
});

const naturalLayer = L.tileLayer.wms(`https://services.sentinel-hub.com/ogc/wms/${instanceId}`, {
    layers: 'NATURAL-COLOR',
    format: 'image/png',
    transparent: true
});

naturalLayer.addTo(map);

// 3. Fungsi Tukar Lapisan & Kemas kini Legend
function setLayer(type) {
    const healthValue = document.getElementById('health-value');
    const barFill = document.getElementById('bar-fill');
    const legend = document.getElementById('ndvi-legend');

    if (type === 'NDVI') {
        map.removeLayer(naturalLayer);
        ndviLayer.addTo(map);
        legend.style.display = 'block';
        healthValue.innerText = "Menganalisis Kesihatan...";
        barFill.style.width = "100%";
    } else {
        map.removeLayer(ndviLayer);
        naturalLayer.addTo(map);
        legend.style.display = 'none';
        healthValue.innerText = "Warna Sebenar Aktif";
        barFill.style.width = "0%";
    }
}

// 4. Sistem Carian Lokasi
L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: "Cari lokasi ladang...",
    position: 'topright'
})
.on('markgeocode', function(e) {
    const latlng = e.geocode.center;
    map.setView(latlng, 15);
    document.getElementById('location-name').innerText = e.geocode.name;
    L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();
})
.addTo(map);

// 5. Klik Peta untuk maklumat koordinat
map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(5);
    const lng = e.latlng.lng.toFixed(5);
    L.popup().setLatLng(e.latlng)
        .setContent(`<strong>Koordinat Ladang:</strong><br>${lat}, ${lng}`)
        .openOn(map);
});
