// Planes will be available as refrences, so here is a global array for these to update all refrences
planes = [];

// Cache to flatten float-Values
cache = {};

function parse(data, config){
  var data = data.split(",");
  var parsed_data = {errors: []};
  getSingleAttribute(config, data, parsed_data, "speed", "float");
  getSingleAttribute(config, data, parsed_data, "altitude", "float");
  getSingleAttribute(config, data, parsed_data, "pitch", "float");
  getSingleAttribute(config, data, parsed_data, "roll", "float");
  getSingleAttribute(config, data, parsed_data, "compass", "float");
  getSingleAttribute(config, data, parsed_data, "g", "float");
  getSingleAttribute(config, data, parsed_data, "rad_alt", "float");
  getSingleAttribute(config, data, parsed_data, "mach", "float");
  getSingleAttribute(config, data, parsed_data, "is_armed_gun", "int");
  getSingleAttribute(config, data, parsed_data, "is_armed_srm", "int");
  getSingleAttribute(config, data, parsed_data, "gun_ammo", "int");
  getSingleAttribute(config, data, parsed_data, "compass_target", "float");
  getSingleAttribute(config, data, parsed_data, "aoa_bracket", "float");
  getSingleAttribute(config, data, parsed_data, "is_gear_out", "float");
  getSingleAttribute(config, data, parsed_data, "hpath", "float");
  getSingleAttribute(config, data, parsed_data, "vpath", "float");
  getSingleAttribute(config, data, parsed_data, "on_ground", "bool");
  getSingleAttribute(config, data, parsed_data, "latitude", "float");
  getSingleAttribute(config, data, parsed_data, "longitude", "float");
  getSingleAttribute(config, data, parsed_data, "target_index", "int");
  getSingleAttribute(config, data, parsed_data, "air_brake_on", "bool");
  getSingleAttribute(config, data, parsed_data, "mag_var", "float");
  getSingleAttribute(config, data, parsed_data, "roll_rate", "float");
  getSingleAttribute(config, data, parsed_data, "pitch_rate", "float");
  getSingleAttribute(config, data, parsed_data, "yaw_rate", "float");
  getSingleAttribute(config, data, parsed_data, "oil_tmp", "float");
  getSingleAttribute(config, data, parsed_data, "rpm", "float");
  getSingleAttribute(config, data, parsed_data, "ftit", "float");
  getSingleAttribute(config, data, parsed_data, "ff", "float");
  getSingleAttribute(config, data, parsed_data, "vertical_speed", "float");
  parsed_data.fob = 0;
  for(var i = 0; i < c_tanks; i++){
      parsed_data.fob += parseElement(data, config["tank0"] + i, "float");
  }
  parsed_data["planes"] = planes;
  if(parsed_data.planes[0] == null){
    parsed_data["planes"][0] = new Plane(new Vector(0,0,0));
  }
  parsed_data["planes"][0].updatePosition(
    new Vector(
      parseElement(data, config["latitude_own"], "float"),
      parseElement(data, config["longitude_own"], "float"),
      parseElement(data, config["elevation_own"], "float")
    )
  );
  parsed_data["planes"][0].setHeading(parsed_data.compass);
  parsed_data["planes"][0].setSpeed(new Vector(parseElement(data, config["ground_speed"], "float"), 0).rotate(parsed_data.compass));
  //
  // Add Setters for new Planes up here and down there
  // Ex: parsed_data["planes"][0].setSomeFancyAttribute(parseElement(data, config["fancy_stuff"], "float"));
  // Reference the parseElement-Function for other possible variable-types
  // (Remember to put new DataRefs into the config.js as well!)
  //
  for(var i = 0; i < c_planes; i++){
    if(parsed_data.planes[i+1] == null)
    parsed_data["planes"][i+1] = new Plane(new Vector(0,0,0));
    conf_offset = i * c_plane_values;
    try{
      parsed_data["planes"][i+1].updatePosition(
        new Vector(
          parseElement(data, config["plane1_lat"] + conf_offset, "float"),
          parseElement(data, config["plane1_long"] + conf_offset, "float"),
          parseElement(data, config["plane1_el"] + conf_offset, "float")
        )
      );
      parsed_data["planes"][i+1].setBearing(parseElement(data, config["plane1_bearing"] + conf_offset, "float"));
      parsed_data["planes"][i+1].setHeading(parseElement(data, config["plane1_hdg"] + conf_offset, "float"));
      parsed_data["planes"][i+1].setSpeed(new Vector(parseElement(data, config["plane1_gs_x"] + conf_offset, "float"), parseElement(data, config["plane1_gs_y"] + i, "float")));
      parsed_data["planes"][i+1].setTarget(parsed_data.target_index == i+1);
      //
      // Add Setters for new Planes down here and up there
      // Ex: parsed_data["planes"][i+1].setSomeFancyAttribute(parseElement(data, config["fancy_stuff"], "float"));
      //
    }
    catch(er) {
      parsed_data.errors.push("Some data for plane"+(i+1));
    }
  }
  parsed_data["stations"] = [];
  for(var i = 0; i < c_stations; i++){
    try{
      parsed_data["stations"][i] = {
        type: parseElement(data, config["station1_type"] + i, "int"),
        status: parseElement(data, config["station1_status"] + i, "int")
      }
    }
    catch(er) {
      parsed_data.errors.push("Some data for station" + (i+1));
    }
  }
  return parsed_data;
}

function getSingleAttribute(config, data, parsed_data, element, type){
  try{
    parsed_data[element] = parseElement(data, config[element], type);
  }
  catch(er) {
    parsed_data.errors.push(element);
  }
}

function parseElement(src, src_i, type){
  if(src_i != null){
    if(src[src_i]){
      if(type == "float"){
        return parseFloat(src[src_i]);
      }
      else if(type == "int"){
        return parseInt(src[src_i]);
      }
      else if(type == "bool"){
        return Boolean(parseInt(src[src_i]));
      }
      else{
        return src[src_i];
      }
    }
    else {
      throw "Missing src_i";
    }
  }
  else{
    return null;
  }
}

function injectData(HUD, data, config){
  var parsed = parse(data, config);
  if(parsed.on_ground){
    parsed.hpath = parsed.compass;
    parsed.vpath = on_ground_vpath;
    parsed.pitch = on_ground_pitch;
    parsed.mag_var = 0;
  }
  HUD.updateSpeed(parsed.speed);
  HUD.updateAltitude(parsed.altitude);
  HUD.updateRoll(parsed.roll);
  HUD.updatePitch(parsed.vpath);
  HUD.updateCompass(parsed.compass);
  HUD.updateCompassTarget(parsed.compass_target);
  HUD.updateG(parsed.g);
  HUD.updateMach(parsed.mach);
  HUD.updateRadAlt(parsed.rad_alt);
  HUD.updateArmed(parsed.is_armed_srm + parsed.is_armed_gun);
  HUD.updateWeapon([parsed.is_armed_gun, parsed.is_armed_srm], parsed.gun_ammo);
  HUD.updateGear(parsed.aoa_bracket);
  HUD.setGearOut(parsed.is_gear_out);
  HUD.setAirBrakeOn(parsed.air_brake_on);
  HUD.updateFPVPosition(new Vector(HUD.getYaw(parsed.hpath + parsed.mag_var), parsed.pitch - parsed.vpath));
  var targeted = parsed.is_armed_srm + parsed.is_armed_gun;
  if(parsed.target_index == 0){
    targeted = false;
  }
  HUD.updateTarget(planes[parsed.target_index], planes[0], targeted, parsed.compass, parsed.pitch, parsed.roll);
  HUD.updateRotationRates(parsed.pitch_rate, parsed.yaw_rate, parsed.roll_rate);
  HUD.resetErrors();
  if(parsed.errors.length > 0){
    HUD.addError("Missing Data: " + parsed.errors.toString());
  }
  HUD.draw();
}

function injectRadarData(Canvas, data, config){
  var parsed = parse(data, config);
  Canvas.updatePlanes(parsed.planes.slice(1));
  Canvas.updateOwnPlane(parsed.planes[0]);
  Canvas.updateCompass(parsed.compass);
  Canvas.updateRoll(parsed.roll);
  Canvas.resetErrors();
  if(parsed.errors.length > 0){
    Canvas.addError("Missing Data: " + parsed.errors.toString());
  }
  Canvas.draw();
}

function injectSMSData(Canvas, data, config){
  var parsed = parse(data, config);
  for(var i = 0; i < parsed.stations.length; i++){
    Canvas.updateStation(i+1, parsed.stations[i].type, parsed.stations[i].status);
  }
  if(parsed.is_armed_srm){
    Canvas.selectStationsByType(8);
  }
  else {
    Canvas.selectStationsByType(-1);
  }
  Canvas.updateGunAmmo(parsed.gun_ammo);
  Canvas.updateOilTmp(parsed.oil_tmp);
  Canvas.updateRPM(parsed.rpm);
  Canvas.updateFTIT(parsed.ftit);
  Canvas.updateFF(parsed.ff)
  Canvas.updateFOB(parsed.fob * 2.2)
  Canvas.resetErrors();
  if(parsed.errors.length > 0){
    Canvas.addError("Missing Data: " + parsed.errors.toString());
  }
  Canvas.draw();
}

function injectGaugeData(data, config){
  var parsed = parse(data, config);
  AOA.updateAOA(parsed.aoa_bracket);
  AOA.draw();
  VS.updateVS(parsed.vertical_speed * 60 * meter_in_feet);
  VS.draw();
  Altitude.updateAltitude(parsed.altitude);
  Altitude.resetErrors();
  if(parsed.errors.length > 0){
    Altitude.addError("Missing Data: " + parsed.errors.toString());
  }
  Altitude.draw();
  Speed.updateSpeed(parsed.speed);
  Speed.updateMach(parsed.mach);
  Speed.resetErrors();
  if(parsed.errors.length > 0){
    Speed.addError("Missing Data: " + parsed.errors.toString());
  }
  Speed.draw();
  Attitude.setRoll(parsed.roll);
  Attitude.setPitch(parsed.pitch);
  if(Attitude.setCompass)
	  Attitude.setCompass(parsed.compass);
  Attitude.draw();
}
