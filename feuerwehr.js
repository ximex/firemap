function getFeuerwehr(map,featureLayer,featureLayerR){	
	var nodes = {};
	var ways = {};
	var relations = {};
	
	featureLayer.clearLayers();
	featureLayerR.clearLayers();
	
	if(map.getZoom() < 12){
		return;
	}
	
	//var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var url = 'http://overpass-api.de/api/interpreter?data=';
	var query = '[out:json];(way(BBOX)TAGS;way(BBOX)TAGS;node(w);node(BBOX)TAGS;);out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/TAGS/g, '[amenity=fire_station]');
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
		featureLayerR.clearLayers();
		
		getFeuerwehrObjects(featureLayer,featureLayerR,objects.nodes,objects.ways);
	});
}

function getFeuerwehrObjects(featureLayer,featureLayerR,nodes,ways){
	var icon = getFeatureIcon('amenity=fire_station',16);
	var show = ['addr:postcode','addr:city','addr:street','addr:housenumber','phone','email','website'];
	var radius_obj = {radius: 1500, color: '#f00'};
	
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
			var title = 'Feuerwehr';
		}
		var tags = obj.tags;
		addPointFeature(featureLayer,featureLayerR,point,icon,title,tags,show,radius_obj);
	}
	
	for(var nodeId in nodes){
		var obj = nodes[nodeId];
		if(obj.tags){
			if(obj.tags.amenity == 'fire_station'){
				var point = new L.LatLng(obj.lat,obj.lon);
				if(obj.tags.name){
					var title = obj.tags.name;
				}else{
					var title = 'Feuerwehr';
				}
				var tags = obj.tags;
				addPointFeature(featureLayer,featureLayerR,point,icon,title,tags,show,radius_obj);
			}
		}
	}
}