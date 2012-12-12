function translate(key,value){
	switch(key){
		case 'fire_hydrant':
			return ['Hydrant',value];
		case 'fire_hydrant:type':
			key = 'Type:';
			switch(value){
				case 'pillar':
					return [key,'Überflur'];
				case 'underground':
					return [key,'Unterflur'];
				case 'wall':
					return [key,'Wandanschluss'];
				default:
					return [key,value];
			}
		case 'fire_hydrant:count':
			return ['Anzahl:',value];
		case 'fire_hydrant:position':
			return ['Position:',value];
		case 'addr:country':
			return ['Land:',value];
		case 'addr:postcode':
			return ['PLZ:',value];
		case 'addr:city':
			return ['Ort:',value];
		case 'addr:street':
			return ['Straße:',value];
		case 'addr:housenumber':
			return ['Hausnummer:',value];
		case 'phone':
			return ['Telefonnummer:',value];
		case 'email':
			return ['Email:',value];
		case 'website':
			return ['Webseite:',value];
		default:
			return [key,value];
	}
}