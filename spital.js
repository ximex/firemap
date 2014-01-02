function getSpital(featureLayer){
	
	featureLayer.clearLayers();
	
	if(map.getZoom() < 10 || !$('#layer_hospital').is(':checked')){
		return;
	}
	
	var nodes = {};
	var ways = {};
	var relations = {};
	
	//var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var url = 'http://overpass-api.de/api/interpreter?data=';
	var query = '[out:json];(node(BBOX)TAGS;way(BBOX)TAGS;relation(BBOX)TAGS;);out body;>;out skel;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/TAGS/g, '[amenity=hospital][emergency=yes]');
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
		featureLayer.clearLayers();
		
		getSpitalObjects(featureLayer,objects.nodes,objects.ways);
	});
}

function getSpitalObjects(featureLayer,nodes,ways){
	var icon = getFeatureIcon('amenity=hospital',16);
	var show = ['addr:housenumber','addr:street'];
	
	for(var wayId in ways){
		var obj = ways[wayId];
		var way_nodes = [];
		for(var i=0;i<obj.nodes.length;i++){
			var nodeId = obj.nodes[i];
			way_nodes[i] = new L.LatLng(nodes[nodeId].lat,nodes[nodeId].lon);
		}
		var point = new L.Polygon(way_nodes).getCenter();
		if(obj.tags.name){
			var title = obj.tags.name;
		}else{
			var title = 'Spital';
		}
		var tags = obj.tags;
		addMarkerFeature(featureLayer,point,icon,title,tags,show);
	}
	
	for(var nodeId in nodes){
		var obj = nodes[nodeId];
		if(obj.tags){
			if(obj.tags.amenity == 'fire_station'){
				var point = new L.LatLng(obj.lat,obj.lon);
				if(obj.tags.name){
					var title = obj.tags.name;
				}else{
					var title = 'Spital';
				}
				var tags = obj.tags;
				addMarkerFeature(featureLayer,point,icon,title,tags,show);
			}
		}
	}
}