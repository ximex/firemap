function getFeuerwehr(map,featureLayer){	
	var nodes = {};
	var ways = {};
	var relations = {};
	
	featureLayer.clearLayers();
	
	if(map.getZoom() < 12){
		return;
	}
	
	//var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var url = 'http://overpass-api.de/api/interpreter?data=';
	//var query = '[out:json];node(BBOX)TAGS;out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/TAGS/g, '[amenity=fire_station]');
	var query = '[out:json];(way(BBOX)TAGS;way(BBOX)TAGS;node(w);node(BBOX)TAGS;);out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/TAGS/g, '[amenity=fire_station]');
	//var query = '[out:json];(relationTAGS;relationTAGS;way(r);relationTAGS;>;);out qt;'.replace(/TAGS/g, '[type=multipolygon][admin_level=4][name~"Vorarlberg|Tirol|Kärnten|Steiermark|Salzburg|Oberösterreich|Niederösterreich|Wien|Burgenland"]');
	var overpass_query = url + query;
	
	$.getJSON(
		overpass_query,
		function(data, textStatus){
			//alert(textStatus);
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
		getFeuerwehrObjects(featureLayer,objects.nodes,objects.ways);
	});
}

function getFeuerwehrObjects(featureLayer,nodes,ways){
	for(var wayId in ways){
		var way = ways[wayId];
		var way_nodes = [];
		for(var i=0;i<ways[wayId].nodes.length;i++){
			var nodeId = ways[wayId].nodes[i];
			way_nodes[i] = new L.LatLng(nodes[nodeId].lat,nodes[nodeId].lon);
		}
		addFeuerwehrFeature(featureLayer,new L.Polygon(way_nodes).getCenter(),way.tags);
	}
	
	for(var nodeId in nodes){
		var node = nodes[nodeId];
		if(node.tags){
			if(node.tags.amenity == 'fire_station'){
				if(!node.tags.name){
					node.tags.name = 'Feuerwehrhaus';
				}
				addFeuerwehrFeature(featureLayer,new L.LatLng(node.lat,node.lon),node.tags);
			}
		}
	}
}

function addFeuerwehrFeature(featureLayer,point,tags){
	var featureIcon = getFeatureIcon('amenity=fire_station',16);
	
	if(!tags.name){
		tags.name = 'Feuerwehrhaus';
	}
	
	featureLayer.addLayer(
		new L.Marker(
			point,
			{
				icon: featureIcon,
				title: tags.name
			}
		).bindPopup(tags.name)
	);
}