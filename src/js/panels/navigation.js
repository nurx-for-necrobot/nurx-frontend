
window.nurx.registerPanel("navigation", function(nurx) {
    var LOCATION_HISTORY_MAX_POINTS = 200;

    var map;
    var playerMarker;
    var fortMarkers = [];
    var encounterMarkers = [];

    //var mapStyle = [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}];
    //var mapStyle = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#193341"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2c5a71"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#29768a"},{"lightness":-37}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#406d80"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#3e606f"},{"weight":2},{"gamma":0.84}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"weight":0.6},{"color":"#1a3541"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#2c5a71"}]}];
    var mapStyle = [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}];


    var locationHistory = [];
    var locationLine;

    function init() {
        // Initialize the map.
        var mapOptions = {
            zoom:18,
            center: new google.maps.LatLng(51.5073509,-0.12775829999998223),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: mapStyle,
            mapTypeControl: false,
            scaleControl: false,
            zoomControl: false,
        };
        map = new google.maps.Map(document.getElementById('gmap-' + nurx.instanceId), mapOptions);

        playerMarker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(51.5073509,-0.12775829999998223),
            icon: "img/marker_50.png",
            zIndex: 200
        }); 
    }


    /**
     * Handle location updates.
     */
    function updateLocation(message) {

        // Set the center and player marker.
        var pos = new google.maps.LatLng(message.Data.Lat, message.Data.Lng);
        map.setCenter(pos);
        playerMarker.setPosition(pos);

        // Setup the location history line.
        locationHistory.push({ lat: message.Data.Lat, lng: message.Data.Lng });
        while(locationHistory.length > LOCATION_HISTORY_MAX_POINTS) {
            locationHistory.splice(0, 1);
        }

        if(locationLine != null)
            locationLine.setMap(null);

        locationLine = new google.maps.Polyline({
            path: locationHistory,
            geodesic: true,
            strokeColor: '#5691FF',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        locationLine.setMap(map);
    }

    /**
     * Handle loading of pokestops.
     */
    function loadPokestops(message) {
        console.log(message);

        ko.utils.arrayForEach(fortMarkers, function(item) {
            item.setMap(null);
        });
        fortMarkers = [];

        ko.utils.arrayForEach(message.Data, function(fortData) {
            var fortMarker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(fortData.Latitude, fortData.Longitude),
                icon: "img/pokestop_25.png",
                zIndex: 100
            });
            fortMarkers.push(fortMarker);
        });
    }

    /**
    * Handle forUsed.
    */
    function fortUsed(message) {
        var fortPos = new google.maps.LatLng(message.Data.Latitude, message.Data.Longitude);

        // Find the fort that was used.
        var matchFort;
        for (var i = 0; i < fortMarkers.length; i++) {            
            if (fortPos.equals(fortMarkers[i].position)){
                matchFort = fortMarkers[i];
                break;
            }
        }

        if (matchFort != null) {
            matchFort.setIcon("img/pokestop_50.png");
            window.setTimeout(function() { matchFort.setIcon("img/pokestop_25.png"); }, 1000 * 60 * 5);
        }
    }


    /**
     * Show an encounter on the map.     
     */
    function showEncounter(encounter) {
        /*var pokeMarker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(encounter.Lat, encounter.Lng),
            icon: "img/pokemon/" + encounter.PokemonData.PokemonId + ".png",
            zIndex: 100
        });*/

        var pokeMarker = new EncounterMarker(
            new google.maps.LatLng(encounter.Lat, encounter.Lng), 
            map,
            {
                PokemonId:  encounter.PokemonData.PokemonId
            }
        );

        encounterMarkers.push(pokeMarker);
        setTimeout(function() {
            console.log("removing pokemon marker");

            try {
                for(var i = 0; i < encounterMarkers.length; i++) {
                    if(encounterMarkers[i] == pokeMarker) {
                        encounterMarkers.splice(i, 1);
                        return;
                    }                    
                }
                
                pokeMarker.remove();
                pokeMarker.setMap(null);
            } catch(err) {
                console.log("Error removing encounter marker: ", err);
            }
        }, 1000 * 60 * 3);
    }

    /**
     * Handle nearby encounters.
     */
    function encounterNearby(message) { 
        console.log("Nearby encounter: ", message);

        showEncounter({
            PokemonData: message.Data.PokemonData,
            Lat: message.Data.Latitude,
            Lng: message.Data.Longitude,
            SpawnId: message.Data.SpawnPointId,
            EncounterId: message.Data.EncounterId
        });
    }


    /**
     * Handle lure encounters.
     */
    function encounterLure(message) { }


    /**
     * Handle incense encounters.
     */
    function encounterIncense(message) { }


    // Setup websockets command listners.
    nurx.commandListeners["fortused"] = fortUsed;
    nurx.commandListeners["update_location"] = updateLocation;
    nurx.commandListeners["pokestops"] = loadPokestops;
    nurx.commandListeners["encounter_nearby"] = encounterNearby;
    nurx.commandListeners["encounter_lure"] = encounterLure;
    nurx.commandListeners["encounter_incense"] = encounterIncense;
    

    return {   
        init: init
    };
});