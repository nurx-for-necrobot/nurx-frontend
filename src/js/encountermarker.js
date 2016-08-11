function EncounterMarker(latlng, map, args) {
	this.latlng = latlng;	
	this.args = args;	
	this.setMap(map);	
}

EncounterMarker.prototype = new google.maps.OverlayView();

EncounterMarker.prototype.draw = function() {
	
	var self = this;
	
	var div = this.div;
	
	if (!div) {
	
		div = this.div = document.createElement('div');
		var innerdiv = document.createElement('div');
		
		var d = $(div);
		var i = $(innerdiv);

		d.addClass('marker');
		d.css({			
			'position': "absolute",
			'width': "60px",
			'height': "60px",
			'border-radius': '30px',
			'border': '4px solid rgba(61, 134, 165, 0.5)',
			'background-color': 'rgba(255, 255, 255, 0.75)',
			'z-index': "90"
		})	

		if(self.args.PokemonId !== 'undefined')
			i.css({'background-image': "url(img/pokemon/" + self.args.PokemonId + ".png)"});

		i.css({
			'background-size': "contain",
			'background-position': "center center",
			'background-repeat': 'no-repeat',
			'width': "40px",
			'height': "40px",
			'border-radius': '20px',
			'margin': "5px"
		})

		d.append(i);
			
		if (typeof(self.args.marker_id) !== 'undefined') {
			div.dataset.marker_id = self.args.marker_id;
		}
		
		/*google.maps.event.addDomListener(div, "click", function(event) {
			alert('You clicked on a custom marker!');			
			google.maps.event.trigger(self, "click");
		});*/
		
		var panes = this.getPanes();
		panes.overlayImage.appendChild(div);
	}
	
	var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
	
	if (point) {
		div.style.left = (point.x - 10) + 'px';
		div.style.top = (point.y - 20) + 'px';
	}
};

EncounterMarker.prototype.remove = function() {
	if (this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}	
};

EncounterMarker.prototype.getPosition = function() {
	return this.latlng;	
};