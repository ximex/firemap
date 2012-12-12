function getHydranten(map,featureLayer){	
	var nodes = {};
	var ways = {};
	var relations = {};
	
	featureLayer.clearLayers();
	
	if(map.getZoom() < 16){
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
	var icon = getFeatureIcon('emergency=fire_hydrant',16);
	var show = ['fire_hydrant:type','fire_hydrant:count','fire_hydrant:position'];
	
	for(var node in nodes){
		var obj = nodes[node];
		var point = new L.LatLng(obj.lat,obj.lon);
		var title = 'Hydrant';
		var tags = obj.tags;
		addPointFeature(featureLayer,point,icon,title,tags,show);
	}
}