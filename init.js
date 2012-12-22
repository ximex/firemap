var language = window.navigator.userLanguage || window.navigator.language;

$(function(){
	var map = initMap();
	var baseLayers = getBaseLayers();
	var overlays = getOverlays();
	addLayers(map,baseLayers,overlays);
	addControls(map,baseLayers,overlays);
	
	getData(map,overlays);
});

function initMap(){
	return new L.Map('map',
	{
		minZoom: 0,
		maxZoom: 18,
		center: new L.LatLng(0,0),
		zoom: 3
	}).locate({
		setView: true,
		maxZoom: 12
	});
}

function getBaseLayers(){
	var osm = new L.TileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{ attribution: 'Map data © OpenStreetMap contributors' }
	);
	
	return {
		"OpenStreetMap": osm
	};
}

function getOverlays(){
	return {
		"Feuerwehr": new L.MarkerClusterGroup({maxClusterRadius:16}),
		"FeuerwehrCoverage": new L.TileLayer.MaskCanvas({radius:1500,useAbsoluteRadius:true,color:'#000'}),
		"Hydranten": new L.MarkerClusterGroup({maxClusterRadius:16}),
		"HydrantenCoverage": new L.TileLayer.MaskCanvas({radius:150,useAbsoluteRadius:true,color:'#000'}),
		//"Wasser": new L.LayerGroup(),
		"Spital": new L.MarkerClusterGroup({maxClusterRadius:16})
	};
}

function addLayers(map,baseLayers,overlays){
	map.addLayer(baseLayers.OpenStreetMap);
	
	map.addLayer(overlays.Feuerwehr);
	//map.addLayer(overlays.FeuerwehrCoverage);
	map.addLayer(overlays.Hydranten);
	//map.addLayer(overlays.HydrantenCoverage);
	//map.addLayer(overlays.Wasser);
	map.addLayer(overlays.Spital);
}

function addControls(map,baseLayers,overlays){
	map.addControl(new L.Control.Scale());
	map.addControl(new L.Control.Layers(baseLayers,overlays));
	//map.addControl(new L.Control.Locate({follow: true}));
}

function getData(map,overlays){
	getFeuerwehr(map,overlays.Feuerwehr,overlays.FeuerwehrCoverage);
	getHydranten(map,overlays.Hydranten,overlays.HydrantenCoverage);
	//getWasser(map,overlays.Wasser);
	getSpital(map,overlays.Spital);
	
	map.on('moveend',function(){getFeuerwehr(map,overlays.Feuerwehr,overlays.FeuerwehrCoverage)});
	map.on('moveend',function(){getHydranten(map,overlays.Hydranten,overlays.HydrantenCoverage)});
	//map.on('moveend',function(){getWasser(map,overlays.Wasser)});
	map.on('moveend',function(){getSpital(map,overlays.Spital)});
}