


// Grabbing our GeoJSON data.
//L.geoJSON(sanFranAirport, {
  // We turn each feature into a marker on the map.
//  pointToLayer: function(feature, latlng) {
//    console.log(feature);
//    return L.marker(latlng)
//    .bindPopup("<h2>" + feature.properties.city + "</h2>");
//  }

//}).addTo(map);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// We create the satellite tile layer that will be the background of our map.
let satelliteStreets  = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// We create the  night nav tile layer that will be the background of our map.
let darkNavigation  = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/navigation-night-v1',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// Create base layer that holds both maps
let baseMaps = {
  "Streets":streets,
  "Satellite": satelliteStreets,
  "Dark-Nav" : darkNavigation
};  

// Create the map object with a center and zoom level.
let map = L.map("mapid", {
  center: [39.5, -98.5],
  zoom: 3,
  layers: [streets]
});

//Pass our map layers into our layer control and add the layer control to the map
//L.control.layers(baseMaps).addTo(map);

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();
let tectonicplates = new L.layerGroup();
let majorQuakes = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes,
  Tectonic: tectonicplates,
  Major_Quakes: majorQuakes
};

// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the earthquake GeoJSON URL
let earthQuakedata = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 console.log(earthQuakedata);
// Grabbing our GeoJSON data.
d3.json(earthQuakedata).then(function(data) {
 
  // This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}
// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
};
// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
};
// Creating a GeoJSON layer with the retrieved data.
L.geoJSON(data, {
  // Turn each feature to a circleMarker
  pointToLayer: function( feature, latlng) {
    
    return L.circleMarker(latlng);
  },
  //Set teh sytle for each marker using styleInfo
  style: styleInfo,
  // Create a popup for each marker to display magnitude and 
  // location of the earthquake after each marker has been styled.
  onEachFeature: function( feature, layer) {
    layer.bindPopup( "Magnitude: " + feature.properties.mag + "<br> Location: " + feature.properties.place);
  }
 }).addTo(earthquakes);

 // Then add the earthquake layer to our map
  earthquakes.addTo(map);
  
// 3. Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
let bigQuakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

d3.json(bigQuakes).then(function(data) {

    // 4. Use the same style as the earthquake data.
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getMajorColor(feature.properties.mag),
          color: "#000000",
          radius: getMajorRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
    // 5. Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.
    function getMajorColor(magnitude) {
        if (magnitude < 5) {
          return "orange";
        }
        if (magnitude > 6) {
          return "darkred";
        }
        if (magnitude >= 5 & magnitude < 6) {
          return "red";
        }         
        return "#98ee00";
      };
    
    // 6. Use the function that determines the radius of the earthquake marker based on its magnitude.
    function getMajorRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 5;
      };
    
    // 7. Creating a GeoJSON layer with the retrieved data that adds a circle to the map 
    // sets the style of the circle, and displays the magnitude and location of the earthquake
    //  after the marker has been created and styled.
    L.geoJSON(data, {
        // Turn each feature to a circleMarker
        pointToLayer: function( feature, latlng) {
            
            return L.circleMarker(latlng);
        },
        //Set teh sytle for each marker using styleInfo
        style: styleInfo,
        // Create a popup for each marker to display magnitude and 
        // location of the earthquake after each marker has been styled.
        onEachFeature: function( feature, layer) {
            layer.bindPopup( "Magnitude: " + feature.properties.mag + "<br> Location: " + feature.properties.place);
        }
        }).addTo(majorQuakes);
        
        // Then add the Major earthquake layer to our map
        majorQuakes.addTo(map);

    });


// Use d3.json to make a call to get our Tectonic Plate geoJSON data.
let plateData = "https://raw.githubusercontent.com/fraxen/tectonicplates/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_boundaries.json";


// Set the style parameters for the tectonic plate feature
function polystyle(feature) {
    return { weight: 4,
             opacity: 1,
             color: 'yellow',
              };
}
// Add Tectonic Plates to map
d3.json(plateData).then(function(data) {
     console.log(data);
     L.geoJson(data, { style: polystyle }).addTo(tectonicplates);
     
   });
  tectonicplates.addTo(map);

 // Adding legend to the map in bottom right corner  
 let  legend = L.control({position: 'bottomright'});

 legend.onAdd = function () {
  var div = L.DomUtil.create('div','info legend');
  
   
  const magnitudes = [ 0, 1, 2, 3, 4, 5];
  const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];
  //loop through density intervals and gen a lable with colored square for each interval
  for ( var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      magnitudes[i] + (magnitudes[i+1] ? '&ndash;' + magnitudes[i+1] + '<br>' : '+');
  } 
  return div; 
 };
 legend.addTo(map);
});





