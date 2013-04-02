var language = window.navigator.userLanguage || window.navigator.language;
var map,baseLayers,overlays;

$(function(){
	map = initMap();
	baseLayers = getBaseLayers();
	overlays = getOverlays();
	addLayers();
	addControls();
	
	getData();
	
	map.on('zoomend',function(){zoomChanged();});
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
	return {
		'OpenStreetMap_Mapnik': new L.TileLayer.Provider('OpenStreetMap.Mapnik'),
		'OpenStreetMap_DE': new L.TileLayer.Provider('OpenStreetMap.DE'),
		'OpenStreetMap_BlackandWhite': new L.TileLayer.Provider('OpenStreetMap.BlackAndWhite'),
		'Thunderforest_OpenCycleMap': new L.TileLayer.Provider('Thunderforest.OpenCycleMap'),
		'Thunderforest_Transport': new L.TileLayer.Provider('Thunderforest.Transport'),
		'Thunderforest_Landscape': new L.TileLayer.Provider('Thunderforest.Landscape'),
		'MapQuest_OSM': new L.TileLayer.Provider('MapQuestOpen.OSM'),
		'MapQuest_Aerial': new L.TileLayer.Provider('MapQuestOpen.Aerial'),
		'MapBox_Simple': new L.TileLayer.Provider('MapBox.Simple'),
		'MapBox_Streets': new L.TileLayer.Provider('MapBox.Streets'),
		'MapBox_Light': new L.TileLayer.Provider('MapBox.Light'),
		'MapBox_Lacquer': new L.TileLayer.Provider('MapBox.Lacquer'),
		'MapBox_Warden': new L.TileLayer.Provider('MapBox.Warden'),
		'Stamen_Toner': new L.TileLayer.Provider('Stamen.Toner'),
		'Stamen_Terrain': new L.TileLayer.Provider('Stamen.Terrain'),
		'Stamen_Watercolor': new L.TileLayer.Provider('Stamen.Watercolor'),
		'Esri_WorldStreetMap': new L.TileLayer.Provider('Esri.WorldStreetMap'),
		'Esri_DeLorme': new L.TileLayer.Provider('Esri.DeLorme'),
		'Esri_WorldTopoMap': new L.TileLayer.Provider('Esri.WorldTopoMap'),
		'Esri_WorldImagery': new L.TileLayer.Provider('Esri.WorldImagery'),
		'Esri_OceanBasemap': new L.TileLayer.Provider('Esri.OceanBasemap'),
		'Esri_NatGeoWorldMap': new L.TileLayer.Provider('Esri.NatGeoWorldMap')
	};
}

function getOverlays(){
	return {
		'fire_station': new L.MarkerClusterGroup({maxClusterRadius:16}),
		'fire_station_coverage': new L.TileLayer.MaskCanvas({radius:1500,useAbsoluteRadius:true,color:'#000'}),
		'fire_hydrant': new L.MarkerClusterGroup({maxClusterRadius:16}),
		'fire_hydrant_coverage': new L.TileLayer.MaskCanvas({radius:200,useAbsoluteRadius:true,color:'#000'}),
		//'water': new L.LayerGroup(),
		'hospital': new L.MarkerClusterGroup({maxClusterRadius:16}),
		'search_results': new L.LayerGroup()
	};
}

function addLayers(){
	map.addLayer(baseLayers.OpenStreetMap_Mapnik);
	
	map.addLayer(overlays.fire_station);
	//map.addLayer(overlays.fire_station_coverage);
	map.addLayer(overlays.fire_hydrant);
	//map.addLayer(overlays.fire_hydrant_coverage);
	//map.addLayer(overlays.water);
	map.addLayer(overlays.hospital);
	map.addLayer(overlays.search_results);
}

function addControls(){
	map.addControl(new L.Control.Scale());
	map.addControl(new L.Control.Layers(baseLayers,overlays));
	//map.addControl(new L.Control.Locate({follow: true}));
}

function getData(){
	getFeuerwehr(overlays.fire_station,overlays.fire_station_coverage);
	getHydranten(overlays.fire_hydrant,overlays.fire_hydrant_coverage);
	//getWasser(overlays.water);
	getSpital(overlays.hospital);
	
	map.on('moveend',function(){getFeuerwehr(overlays.fire_station,overlays.fire_station_coverage)});
	map.on('moveend',function(){getHydranten(overlays.fire_hydrant,overlays.fire_hydrant_coverage)});
	//map.on('moveend',function(){getWasser(overlays.water)});
	map.on('moveend',function(){getSpital(overlays.hospital)});
}