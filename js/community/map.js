var mymap = {};
var greenIcon = {};
var currentPopup = false;

var geodecode = function (query, callback) {
    // will not call back if no data was found
    var geodecoder = "https://nominatim.openstreetmap.org/search?format=json&q=";
    var reqUrl = geodecoder + encodeURI(query);
    loadJSON(reqUrl, function (data) {
        // use only first entry, if any
        if (data.length >= 1) {
            callback(data[0]);
        }
    });
}

var hoverMarker = function (lat, lon, body, color) {
    if (color == "green") {
        var icon = {icon: greenIcon};
    } else {
        var icon = {};
    }
    var marker = L.marker([lat, lon], icon).addTo(mymap);
    var markerPopUp = marker.bindPopup(body);
    marker.on({
        mouseover: function() {
            if (currentPopup) {
                currentPopup.closePopup();
            }
            markerPopUp.openPopup();
            currentPopup = markerPopUp;
        },
        //   mouseout: function() { markerPopUp.closePopup(); },
    });
}

var loadMapData = function () {
    var person = people[0];
    var description = "<b>{0}</b><br>Field: {1}<br>From: {2}<br>Currently at: {3}<br><a href=\"{4}\">Home page</a>".format(
        person.name, person.field, person.origin, person.current, person.homepage
    );
    // console.log("Name: " + person.name);
    // console.log("Field: " + person.field);
    geodecode(person.origin, function (data) {
        // console.log("Origin: lat " + data.lat + " lon " + data.lon);
        hoverMarker(data.lat, data.lon, description, "green");
    });
    geodecode(person.current, function (data) {
        // console.log("Current: lat " + data.lat + " lon " + data.lon);
        hoverMarker(data.lat, data.lon, description);
    })
    // console.log(description);
    if (people.length > 1) {
        people.shift();
        loadMapData();
    }
};

var init_map = function () {
    // create map node, center it
    mymap = L.map('people-map').setView([15, 0], 2);

    // load tiles
    if (false) { // 'osm' in $_GET) { // Use OpenStreetMaps
        var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var tileOptions = {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            tileSize: 512,
            zoomOffset: -1
        };
    } else { // use Mapbox
        var tileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
        var tileOptions = {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        };
    }
    L.tileLayer(tileUrl, tileOptions).addTo(mymap);

    // load green marker icon
    greenIcon = L.icon({
        iconUrl:       'js/community/lib/leaflet/images/marker-green-icon.png',
        iconRetinaUrl: 'js/community/lib/leaflet/images/marker-green-icon-2x.png',
        shadowUrl:     'js/community/lib/leaflet/images/marker-shadow.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize:  [41, 41]
    });

    // load map data
    loadMapData();
};
window.addEventListener('load', init_map, false);
