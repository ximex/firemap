function getHydranten(featureLayer,featureLayerC){
	
	featureLayer.clearLayers();
	
	if(map.getZoom() < 16 || (!$('#layer_fire_hydrant').is(':checked') && !$('#layer_fire_hydrant_coverage').is(':checked'))){
		featureLayerC.setOpacity(0);
		return;
	}
	
	var nodes = {};
	var ways = {};
	var relations = {};
	
	//var url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var url = 'http://overpass-api.de/api/interpreter?data=';
	var query = '[out:json];(node(BBOX)[emergency=fire_hydrant];node(BBOX)[amenity=fire_hydrant];);out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString());
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
		
		getHydrantenObjects(featureLayer,featureLayerC,objects.nodes);
	});
}

function getHydrantenObjects(featureLayer,featureLayerC,nodes){
	featureLayerC.setOpacity(0.3);
	var data = new Array();
	var dataid = 0;
	
	var icon = getFeatureIcon('emergency=fire_hydrant',16);
	var show = ['ref','fire_hydrant:type','fire_hydrant:count','fire_hydrant:position','fire_hydrant:diameter','fire_hydrant:pressure','fire_hydrant:reservoir'];
	
	for(var node in nodes){
		var obj = nodes[node];
		var point = new L.LatLng(obj.lat,obj.lon);
		var title = 'Hydrant';
		var tags = obj.tags;
		data[dataid] = [point.lat,point.lng];
		dataid++;
		addMarkerFeature(featureLayer,point,icon,title,tags,show);
	}
	featureLayerC.setData(data);
}