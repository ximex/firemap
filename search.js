function search_option_change(){
	if($('#search_type').val() == 'google'){
		$('#search_option_objects').css('display','none');
		$('#search_option_google').css('display','inline');
	}else{
		$('#search_option_objects').css('display','inline');
		$('#search_option_google').css('display','none');
	}
}

function searching(){
	var search_value = $('#search_value').val();
	if(search_value == ''){
		alert('Bitte geben Sie einen Suchbergriff ein!');
	}else{
		if($('#search_type').val() == 'google'){
			address_search(search_value);
		}else{
			object_search(search_value);
		}
	}
}

function address_search(search_value){
	var search_options;
	if($('#search_option_regional').is(':checked')){
		var bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(
				map.getBounds().getSouthWest().lat,
				map.getBounds().getSouthWest().lng),
			new google.maps.LatLng(
				map.getBounds().getNorthEast().lat,
				map.getBounds().getNorthEast().lng));
		search_options = {'address': search_value,'bounds': bounds};
	}else{
		search_options = {'address': search_value};
	}
    var geocoder = new google.maps.Geocoder();
	geocoder.geocode(
		search_options,
		function(results, status){
			clear_search();
			$('#search_objects').css('display','block');
			if(status == google.maps.GeocoderStatus.OK){
				for(var i in results){
					var lat = results[i].geometry.location.lat();
					var lng = results[i].geometry.location.lng();
					
					var bottom = results[i].geometry.viewport.getSouthWest().lat();
					var left = results[i].geometry.viewport.getSouthWest().lng();
					var top = results[i].geometry.viewport.getNorthEast().lat();
					var right = results[i].geometry.viewport.getNorthEast().lng();
					
					$('#search_results').append('<li><a href="#" onClick="jump_to(\'' + bottom + '\',\'' + left + '\',\'' + top + '\',\'' + right + '\')">' + results[i].formatted_address + '</a></li>');
					
					overlays.search_results.addLayer(new L.Marker(new L.LatLng(lat,lng),{title:results[i].formatted_address}));
				}
			}else if(status == google.maps.GeocoderStatus.ZERO_RESULTS){
				$('#search_results').append('<li>Keine Ergebnisse</li>');
			}else{
				alert("Geocode was not successful for the following reason: " + status);
			}
		}
	);
}

function object_search(search_value){
	clear_search();
	$('#search_objects').css('display','block');
	
	if(map.getZoom() < 11){
		$('#search_results').append('<li>Zu großer Suchbereich!</li>');
		return;
	}
	var results = {};
	
	//var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var url = 'http://overpass-api.de/api/interpreter?data=';
	var query;
	if($('#search_option_accurate').is(':checked')){
		query = '[out:json];(way(BBOX)[name="VALUE"];node(BBOX)[name="VALUE"];);out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/VALUE/g, search_value);
	}else{
		query = '[out:json];(way(BBOX)[name~"VALUE"];node(BBOX)[name~"VALUE"];);out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/VALUE/g, search_value);
	}
	var overpass_query = url + query;
	
	$.getJSON(
		overpass_query,
		function(data, textStatus){
			$.each(
				data.elements,
				function(index,obj){
					results[index] = obj;
				}
			);
		}
	).complete(function(){
		for(var i in results){
			var display = false;
			var filters = ['amenity','highway','place','building'];
			var title = '';
			var tags = results[i].tags;
			for(var key in tags){
				title = title + '[' + key + '=' + tags[key] + ']';
				for(var filter in filters){
					if(filters[filter] == key){
						display = true;
					}
				}
			}
			if(display == true){
				$('#search_results').append('<li><a href="#" title="' + title + '">' + results[i].tags.name + '</a></li>');
			}
		}
	});
}

function jump_to(bottom,left,top,right){
	var sw = new L.LatLng(bottom,left);
    var ne = new L.LatLng(top,right);
    var bounds = new L.LatLngBounds(sw,ne);
	map.fitBounds(bounds);
}

function clear_search(){
	$('#search_results').empty();
	$('#search_objects').css('display','none');
	overlays.search_results.clearLayers();
}