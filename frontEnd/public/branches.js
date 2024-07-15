function loadMap() {
    var map = new Microsoft.Maps.Map('#map', {
        credentials: 'ApsBmst2FQ5jNlB3rU2ru-aDMWpo1s6ydhgmVhIoqgUqxlJcnbEZGJ_EY9V6-De4',
        center: new Microsoft.Maps.Location(32.0853, 34.7818), // Coordinates for Tel Aviv
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 8
    });

    // Add a central pushpin for reference
    var center = map.getCenter();
    var centralPin = new Microsoft.Maps.Pushpin(center, {
        title: 'Tel Aviv',
        subTitle: 'Israel',
        text: 'TLV'
    });
    map.entities.push(centralPin);

    // Add random pushpins within Israel
    addRandomPushpins(map, 10); // 10 random pins within Israel
}

// Function to add random pushpins within Israel
function addRandomPushpins(map, numPins) {
    var randomLocations = getRandomLocations(numPins);

    randomLocations.forEach((location, index) => {
        var pin = new Microsoft.Maps.Pushpin(location, {
            title: `Location ${index + 1}`,
            subTitle: `Random pin in Israel`,
            text: `${index + 1}`
        });
        map.entities.push(pin);
    });
}

// Function to get random locations within Israel
function getRandomLocations(numLocations) {
    var locations = [];
    var israelCenterLat = 32.0853,
        israelCenterLng = 34.7818,
        radiusKm = 8; // Adjust radius as needed (in kilometers)

    for (var i = 0; i < numLocations; i++) {
        var lat = getRandomInRange(israelCenterLat - 0.29, israelCenterLat + 0.01);
        var lng = getRandomInRange(israelCenterLng - 0.05, israelCenterLng + 0.01);
        locations.push(new Microsoft.Maps.Location(lat, lng));
    }

    return locations;
}

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function loadMapScenario() {
    loadMap();
}

window.addEventListener('load', function() {
    if (window.Microsoft && Microsoft.Maps) {
        loadMap();
    } else {

        window.loadMapScenario = function() {
            loadMap();
        };
    }
});
