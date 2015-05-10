// Code goes here

var map;
(function () {
    "use strict";
    var interval = 1000;
    var startLoadAfter = 5000;
    var loadPercent = 0.0;
    var times = 1;
    var boundaryUS = {northEast:{},southWest :{}};
    var featureLayer;
    var highlightLayer;
    var currentLocationLabel = document.getElementById('currentCoords');
    L.mapbox.accessToken = 'pk.eyJ1IjoiZ29ya2VtdCIsImEiOiJTazZUYnZFIn0.0pX7pPRMh7swa1Yju29-5Q';
    
    map = L.mapbox.map('map', 'mapbox.streets').setView([40, -100], 6);
    
    map.on('mousemove click', function (e) {
        currentLocationLabel.innerHTML = e.latlng.toString();
    });

    var calcPercentage = function () {
        loadPercent = times * interval * 100 / startLoadAfter;
        loadPercent >= 100?clearInterval(loaderInterval):times++;
        document.getElementById("loadLabel").innerText = "Loading " + loadPercent + "%";
    }
    
    var calculateCenter = function (ne, sw) {
        return [((Math.abs(ne.lat) + Math.abs(sw.lat)) / 2), (Math.abs(ne.lng) + Math.abs(sw.lng)) / 2];
    }
    
    var createLabel = function (obj) {
        var icon = "<i class='fa fa-chevron-right'></i>";
        var str = "";
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                str += icon + "<b>" + prop + ":</b>" + obj[prop] + "<br/>";
            }
        }
        return str;
    }
    
    var showhideMaskArea = function (value) {
        document.getElementById('mask').style.display = value;
    }
   
    var initMap = function () {
        showhideMaskArea('none');
        
        featureLayer = L.mapbox.featureLayer(statesJson).on('ready', function () {
            alert('ready');
        }).addTo(map);
        
        featureLayer.on('click', function (e) {
            if (highlightLayer) {
                map.removeLayer(highlightLayer);
            }
           highlightLayer= L.polyline(e.layer._latlngs, { color: 'blue' }).addTo(map);
        });
        
        featureLayer.setStyle({
            fillColor: "#992244",
            color: "#FFEB12",
            fillOpacity: 0.9
        });

        var first = true;
        featureLayer.eachLayer(function (layer) {
            
            var label = createLabel(layer.feature.properties);
            if (layer.feature.properties.NAME != "Hawaii" && layer.feature.properties.NAME != "Puerto Rico" && layer.feature.properties.NAME != "Alaska") {
                var tempBoundary = layer.getBounds();
                if (first) {
                    boundaryUS = tempBoundary;
                    //boundaryUS.northEast.lat = tempBoundary.northEast.lat;
                    //boundaryUS.southWest.lng = tempBoundary.southWest.lng;
                    //boundaryUS.southWest.lat = tempBoundary.southWest.lat;
                    first = false;
                } else {
                    if (boundaryUS._northEast.lng < tempBoundary._northEast.lng)
                        boundaryUS._northEast.lng = tempBoundary._northEast.lng;
                    if (boundaryUS._northEast.lat < tempBoundary._northEast.lat)
                        boundaryUS._northEast.lat = tempBoundary._northEast.lat;
                    if (boundaryUS._southWest.lng > tempBoundary._southWest.lng)
                        boundaryUS._southWest.lng = tempBoundary._southWest.lng;
                    if (boundaryUS._southWest.lat > tempBoundary._southWest.lat)
                        boundaryUS._southWest.lat = tempBoundary._southWest.lat;
                }
            }
            layer.bindPopup(label);
        });
        
        
        //var bounds = featureLayer.getBounds();
        var centerPoint = boundaryUS.getCenter();
        map.panTo(centerPoint);
    }
    
    showhideMaskArea('display');
    var loaderInterval = setInterval(calcPercentage, interval);
    setTimeout(initMap, startLoadAfter);

})();


//map.panTo(centerPoint);
//.on('ready', function () {
//    alert('hi');
//    //map.fitBounds(featureLayer.getBounds());

//    //    featureLayer.bindPopup(featureLayer.feature.properties.NAME);

//}).addTo(map);

