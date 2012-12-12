function getFeatureIcon(iconType,size){
	return new L.Icon({
		iconUrl: 'icons/' + iconType + '.png',
		iconSize: new L.Point(size,size),
		iconAnchor: new L.Point(size/2,size/2)
	});
}

function addPointFeature(featureLayer,featureLayerR,point,icon,title,tags,show,radius_obj){
	featureLayerR.addLayer(
		new L.Circle(point,radius_obj.radius,
		{
			weight: 1,
			clickable: false,
			color: radius_obj.color,
			fillColor: radius_obj.color
		})
	);
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

/*function addLineFeature(featureLayer,point,icon,title,tags,show){
	featureLayer.addLayer(
		new L.Marker(
			point,
			{
				icon: icon,
				title: title
			}
		).bindPopup(getPopupContent(title,tags,show))
	);
}

function addAreaFeature(featureLayer,point,icon,title,tags,show){
	featureLayer.addLayer(
		new L.Marker(
			point,
			{
				icon: icon,
				title: title
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
				key = trans[0]
				value = trans[1];
				table.append($('<tr>').append($('<th>').css('text-align','left').append($('<nobr>').text(key))).append($('<td>').append($('<nobr>').append(value).css('padding-left','8px'))));
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