function translate(key,value){
	switch(key){
		case 'ref':
			return ['Ref',value];
		case 'fire_hydrant':
			return ['Hydrant',value];
		case 'fire_hydrant:type':
			key = 'Type';
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
			return ['Anzahl',value];
		case 'fire_hydrant:position':
			key = 'Position';
			switch(value){
				case 'green':
					return [key,'Wiese'];
				case 'sidewalk':
					return [key,'Bürgersteig'];
				case 'lane':
					return [key,'Fahrbahn'];
				case 'parking_lot':
					return [key,'Parkbucht'];
				default:
					return [key,value];
			}
		case 'fire_hydrant:diameter':
			return ['Durchmesser',value];
		case 'fire_hydrant:pressure':
			return ['Druck',value];
		case 'fire_hydrant:reservoir':
			return ['Reservoir',value];
		case 'addr:country':
			return ['Land',value];
		case 'addr:postcode':
			return ['PLZ',value];
		case 'addr:city':
			return ['Ort',value];
		case 'addr:street':
			return ['Straße',value];
		case 'addr:housenumber':
			return ['Hausnummer',value];
		case 'phone':
			return ['Telefonnummer',value];
		case 'email':
			return ['Email',value];
		case 'website':
			return ['Webseite',value];
		default:
			return [key,value];
	}
}'ref','fire_hydrant:type','fire_hydrant:count','fire_hydrant:position','fire_hydrant:diameter','fire_hydrant:pressure','fire_hydrant:reservoir'