function getFeatureIcon(iconType,size){
	return new L.Icon({
		iconUrl: 'icons/' + iconType + '.png',
		iconSize: new L.Point(size,size),
		iconAnchor: new L.Point(size/2,size/2)
	});
}

function addMarkerFeature(featureLayer,point,icon,title,tags,show){
	featureLayer.addLayer(
		new L.Marker(
			point,
			{
				icon: icon,
				title: title
			}
		).bindPopup(getPopupContent(title,tags,show),{maxWidth:512})
	);
}
/*
function addPointFeature(featureLayer,point,style_obj){
	featureLayer.addLayer(
		new L.Circle(point,style_obj.radius,
		{
			weight: 1,
			clickable: false,
			color: style_obj.color,
			fillColor: style_obj.color
		})
	);
}

function addLineFeature(featureLayer,points,title,tags,show,style_obj){
	featureLayer.addLayer(
		new L.Polyline(
			points,
			{
				icon: icon,
				title: title
			}
		).bindPopup(getPopupContent(title,tags,show))
	);
}

function addAreaFeature(featureLayer,points,title,tags,show,style_obj){
	featureLayer.addLayer(
		new L.Polygon(
			points,
			{
				weight: 1,
				color: style_obj.color,
				fillColor: style_obj.color
			}
		).bindPopup(getPopupContent(title,tags,show))
	);
}*/

function getPopupContent(title,tags,show){
	var headline = $('<h2>').text(title);
	
	var table = $('<table>')//.attr('border','2').css('border','solid 1px #000');
	for(var i in show){
		for(var key in tags){
			if(show[i] == key){
				var value = checkValueFormat(key,tags[key]);
				var trans = translate(key,value);
				var form_key = trans[0]
				var form_value = trans[1];
				table.append($('<tr>').append($('<th>').css('text-align','left').append($('<nobr>').text(form_key + ':'))).append($('<td>').append($('<nobr>').append(form_value).css('padding-left','8px'))));
			}
		}
	}
	return $('<div>').append(headline).append(table).html();
}

function checkValueFormat(key,value){
	switch(key){
		case 'website':
			return $('<a>').attr('href',value).text(value);
		case 'email':
			return $('<a>').attr('href','mailto:' + value).text(value);
		default:
			return value;
	}
}

function rounding(value,digits){
	return Math.round(value*Math.pow(10,digits))/Math.pow(10,digits);
}
function baselayer_change(){
	var layer = $('#baselayers').val();
	alert(layer);
	switch(layer){
		case 'OpenStreetMap_Mapnik':
			map.addLayer(baseLayers.OpenStreetMap_Mapnik,true);
		case 'OpenStreetMap_DE':
			map.addLayer(baseLayers.OpenStreetMap_DE,true);
		default:
			map.addLayer(baseLayers.OpenStreetMap_Mapnik,true);
	}
}
function layer_fire_station_change(){
	if($('#layer_fire_station').is(':checked')){
		map.addLayer(overlays.fire_station);
	}else{
		map.removeLayer(overlays.fire_station);
	}
}
function layer_fire_station_coverage_change(){
	if($('#layer_fire_station_coverage').is(':checked')){
		map.addLayer(overlays.fire_station_coverage);
	}else{
		map.removeLayer(overlays.fire_station_coverage);
	}
}
function layer_fire_hydrant_change(){
	if($('#layer_fire_hydrant').is(':checked')){
		map.addLayer(overlays.fire_hydrant);
	}else{
		map.removeLayer(overlays.fire_hydrant);
	}
}
function layer_fire_hydrant_coverage_change(){
	if($('#layer_fire_hydrant_coverage').is(':checked')){
		map.addLayer(overlays.fire_hydrant_coverage);
	}else{
		map.removeLayer(overlays.fire_hydrant_coverage);
	}
}
function layer_hospital_change(){
	if($('#layer_hospital').is(':checked')){
		map.addLayer(overlays.hospital);
	}else{
		map.removeLayer(overlays.hospital);
	}
}

function zoomChanged(){
	$('#layer_zoom').text(map.getZoom());
}