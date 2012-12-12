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
	var feuerwehr = new L.LayerGroup();
	var hydranten = new L.LayerGroup();
	var wasser = new L.LayerGroup();
	
	return {
		"Feuerwehr": feuerwehr,
		"Hydranten": hydranten,
		"Wasser": wasser
	};
}

function addLayers(map,baseLayers,overlays){
	map.addLayer(baseLayers.OpenStreetMap);
	
	map.addLayer(overlays.Feuerwehr);
	map.addLayer(overlays.Hydranten);
	map.addLayer(overlays.Wasser);
}

function addControls(map,baseLayers,overlays){	
	map.addControl(new L.Control.Scale());
	map.addControl(new L.Control.Layers(baseLayers,overlays));
	map.addControl(new L.Control.Locate({follow: true}));
}

function getData(){
	getFeuerwehr(map,overlays.Feuerwehr);
	getHydranten(map,overlays.Hydranten);
	getWasser(map,overlays.Wasser);
	
	map.on('moveend',function(){getFeuerwehr(map,overlays.Feuerwehr)});
	map.on('moveend',function(){getHydranten(map,overlays.Hydranten)});
	map.on('moveend',function(){getWasser(map,overlays.Wasser)});
}