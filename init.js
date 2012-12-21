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
		"FeuerwehrRadius": new L.LayerGroup(),//new L.TileLayer.MaskCanvas({radius:1500,useAbsoluteRadius:true,color:'#000',opacity:0.5}),
		"Hydranten": new L.MarkerClusterGroup({maxClusterRadius:16}),
		"HydrantenRadius": new L.LayerGroup(),
		//"Wasser": new L.LayerGroup(),
		"Spital": new L.MarkerClusterGroup({maxClusterRadius:16}),
		"SpitalRadius": new L.LayerGroup()
	};
}

function addLayers(map,baseLayers,overlays){
	map.addLayer(baseLayers.OpenStreetMap);
	
	map.addLayer(overlays.Feuerwehr);
	//map.addLayer(overlays.FeuerwehrRadius);
	map.addLayer(overlays.Hydranten);
	//map.addLayer(overlays.HydrantenRadius);
	//map.addLayer(overlays.Wasser);
	map.addLayer(overlays.Spital);
	//map.addLayer(overlays.SpitalRadius);
}

function addControls(map,baseLayers,overlays){
	map.addControl(new L.Control.Scale());
	map.addControl(new L.Control.Layers(baseLayers,overlays));
	//map.addControl(new L.Control.Locate({follow: true}));
}

function getData(map,overlays){
	getFeuerwehr(map,overlays.Feuerwehr,overlays.FeuerwehrRadius);
	getHydranten(map,overlays.Hydranten,overlays.HydrantenRadius);
	//getWasser(map,overlays.Wasser);
	getSpital(map,overlays.Spital,overlays.SpitalRadius);
	
	map.on('moveend',function(){getFeuerwehr(map,overlays.Feuerwehr,overlays.FeuerwehrRadius)});
	map.on('moveend',function(){getHydranten(map,overlays.Hydranten,overlays.HydrantenRadius)});
	//map.on('moveend',function(){getWasser(map,overlays.Wasser)});
	map.on('moveend',function(){getSpital(map,overlays.Spital,overlays.SpitalRadius)});
}