function translate(language,value){
	switch(value){
		case 'fire_hydrant':
			return 'Hydrant';
			break;
		case 'fire_hydrant:type':
			return 'Type:';
			break;
		case 'pillar':
			return 'Überflur';
			break;
		case 'underground ':
			return 'Unterflur';
			break;
		case 'wall':
			return 'Wandanschluss';
			break;
		case 'fire_hydrant:count':
			return 'Anzahl:';
			break;
		case 'addr:country':
			return 'Land:';
			break;
		case 'addr:postcode':
			return 'PLZ:';
			break;
		case 'addr:city':
			return 'Ort:';
			break;
		case 'addr:street':
			return 'Straße:';
			break;
		case 'addr:housenumber':
			return 'Hausnummer:';
			break;
		default:
			return value;
			break;
	}
}