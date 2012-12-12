function getHydranten(map,featureLayer){	
	var nodes = {};
	var ways = {};
	var relations = {};
	
	featureLayer.clearLayers();
	
	if(map.getZoom() < 15){
		return;
	}
	
	//var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var url = 'http://overpass-api.de/api/interpreter?data=';
	var query = '[out:json];node(BBOX)TAGS;out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/TAGS/g, '[emergency=fire_hydrant]');
	var overpass_query = url + query;
	
	$.getJSON(
		overpass_query,
		function(data, textStatus){
			$.each(
				data.elements,
				function(index,obj){
					switch(obj.type){
						case 'node':
							nodes[obj.id] = obj;
						break;
						case 'way':
							ways[obj.id] = obj;
						break;
						case 'relation':
							relations[obj.id] = obj;
						break;
						default:
							alert('ERROR');
					}
				}
			);
		}
	).complete(function(){
		var objects = 
		{
			'nodes': nodes,
			'ways': ways,
			'relations': relations
		}
		getHydrantenObjects(featureLayer,objects.nodes);
	});
}

function getHydrantenObjects(featureLayer,nodes){	
	for(var node in nodes){
		var obj = nodes[node];
		addHydrantenFeature(featureLayer,new L.LatLng(obj.lat,obj.lon),obj.tags);
	}
}

function addHydrantenFeature(featureLayer,point,tags){
	var featureIcon = getFeatureIcon('amenity=fire_station',16);
	
	featureLayer.addLayer(
		new L.Marker(
			point,
			{
				//icon: featureIcon,
				title: 'Hydrant'
			}
		).bindPopup('Hydrant')
	);
}