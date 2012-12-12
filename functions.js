function getFeatureIcon(iconType,size){
	return new L.Icon({
		iconUrl: 'icons/' + iconType + '.png',
		iconSize: new L.Point(size,size),
		iconAnchor: new L.Point(size/2,size/2)
	});
}

function getPopupContent(id,tags,title,showTags){
	var headline = '';
	for(var key in tags){
		if(key == title){
			headline = $('<h2>').text(translate(app_lang,tags[key])).append(' - ').append($('<small>')).append($('<a>').attr({href: 'http://www.openstreetmap.org/browse/node/'+ id, target: '_blank'}).text('Browse'));
			break;
		}
	}
	var table = $('<table>');//.attr('border','1').css('border-collapse','collapse');
	for(var key in tags){
		for(var i=0;i<showTags.length;i++){
			if(showTags[i] == key){
				table.append($('<tr>').append($('<th>').text(translate(app_lang,key)).css('text-align','left')).append($('<td>').text(translate(app_lang,tags[key])).css('padding-left','8px')));
			}
		}
	}
	return $('<div>').append(headline).append(table).html();
}