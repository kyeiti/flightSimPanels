function ground_range(lat1, lon1, lat2, lon2){
	/*
	var dlat = Math.abs(lat1 - lat2) * 60;
	var dlong = Math.abs(lon1 - lon2) * Math.cos((lat1 + lat2)/2) * 60;
	return pythagoras(dlat, dlong);
	*/

	var R = 6371e3; // metres
	var phi1 = lat1 * Math.PI / 180;
	var phi2 = lat2 * Math.PI / 180;
	var dphi = (lat2-lat1) * Math.PI / 180;
	var dlamda = (lon2-lon1) * Math.PI / 180;

	var a = Math.sin(dphi/2) * Math.sin(dphi/2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(dlamda/2) * Math.sin(dlamda/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c;
}

function pythagoras(a, b){
	return Math.sqrt(a*a + b*b);
}

function slant_range(ground_range, elevation){
	return pythagoras(ground_range, elevation);
}

function raw_bearing(lat1, lon1, lat2, lon2){
	var phi1 = lat1 * Math.PI / 180;
	var phi2 = lat2 * Math.PI / 180;
	var lamda1 = lon1 * Math.PI / 180;
	var lamda2 = lon2 * Math.PI / 180;
	var y = Math.sin(lamda2-lamda1) * Math.cos(phi2);
	var x = Math.cos(phi1)*Math.sin(phi2) -
        Math.sin(phi1)*Math.cos(phi2)*Math.cos(lamda2-lamda1);
	return Math.atan2(y, x) * 180 / Math.PI;
}

function target_bearing(lat1, lon1, lat2, lon2){
/*	var brng2 = raw_bearing(lat2, lon2, lat1, lon1);
	if(brng2 < 180){
		brng2 += 180;
	}
	else
		brng2 -= 180;
	return (raw_bearing(lat1, lon1, lat2, lon2) + brng2) / 2;
	*/

	return raw_bearing(lat1, lon1, lat2, lon2);
/*	var a = Math.abs(lat1 - lat2);
	var b = Math.abs(lon1 - lon2);
	var c = pythagoras(a, b);
	//var c = new Vector(lat1, lon1).sub(lat2, lon2).norm();
	var deg = Math.asin(a/c) * 180 / Math.PI;
	if(lat1 - lat2 < 0) { //target north of ownship
		if(lon1 - lon2 > 0){
			return 90 - deg;
		}
		else {
			return 90 + deg;
		}
	}
	else { //target south of ownship
		if(lon1 - lon2 > 0){
			return 270 - deg;
		}
		else {
			return 270 + deg;
		}
	} */
}

function delta_pitch_target(delta_height, slant_range){
	return Math.asin(delta_height/slant_range) * 180 / Math.PI;
}
