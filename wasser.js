function getWasser(map,featureLayer){	
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
	//var query = '[out:json];(way(BBOX)TAGS;way(BBOX)TAGS;>;);out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/TAGS/g, '[building=yes]');
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
		getWasserObjects(featureLayer,objects.nodes,objects.ways,objects.relations);
	});
}

function getWasserObjects(featureLayer,nodes,ways,relations){
	/*var k = 0;
	for(var wayId in ways){
		var way_nodes = [];
		var j = 0;
		for(var i=0;i<ways[wayId].nodes.length;i++){
			var nodeId = ways[wayId].nodes[i];
			way_nodes[i] = new L.LatLng(nodes[nodeId].lat,nodes[nodeId].lon);
			j++;
		}
		k = k + j;
		var poly = new L.Polygon(way_nodes)
		featureLayer.addLayer(poly);
		featureLayer.addLayer(new L.Marker(poly.getCenter()).bindPopup('Sportplatz'));
	}
	alert(k);
	
	var j = 0;
	for(var relId in relations){
		var rel_ways = relations[relId].members;
		var rel_nodes = [];
		var i = 0;
		var last_nodeId;
		var last_way_nodeId;
		for(var way in rel_ways){
			if(rel_ways[way].role == 'outer'){
				var wayId = rel_ways[way].ref;
				if(last_way_nodeId != ways[wayId].nodes[0] && i > 0){
					var way_nodes = ways[wayId].nodes.reverse();
				}else{
					var way_nodes = ways[wayId].nodes;
				}
				for(var node in way_nodes){
					var nodeId = way_nodes[node];
					var new_node = new L.LatLng(nodes[nodeId].lat,nodes[nodeId].lon);
					if(nodeId != last_nodeId){
						rel_nodes[i] = new_node;
						i++;
					}
					last_nodeId = nodeId;
				}
				last_way_nodeId = last_nodeId;
			}
		}
		var poly = new L.Polygon(rel_nodes).bindPopup(relations[relId].tags.name);
		featureLayer.addLayer(poly);
		//featureLayer.addLayer(new L.Marker(poly.getCenter()).bindPopup(relations[relId].tags.name));
		j = j+i;
	}
	alert(j);*/
}

function addWasserFeature(featureLayer,point,tags){
	var featureIcon = getFeatureIcon('amenity=fire_station',16);
	
	if(!tags.name){
		tags.name = 'Wasser';
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