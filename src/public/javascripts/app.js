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
      };
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

function injectData(HUD, xplaneData){
  if(xplaneData.get("on_ground") > 0) {
    xplaneData.set("hpath", xplaneData.get("compass"));
    xplaneData.set("vpath", on_ground_vpath);
    xplaneData.set("pitch", on_ground_pitch);
    xplaneData.set("mag_var", 0);
  }
  HUD.updateSpeed(xplaneData.get("speed"));
  HUD.updateAltitude(xplaneData.get("altitude"));
  HUD.updateRoll(xplaneData.get("roll"));
  HUD.updatePitch(xplaneData.get("vpath"));
  HUD.updateCompass(xplaneData.get("compass"));
  HUD.updateCompassTarget(xplaneData.get("compass_target"));
  HUD.updateG(xplaneData.get("g"));
  HUD.updateMach(xplaneData.get("mach"));
  HUD.updateRadAlt(xplaneData.get("rad_alt"));
  HUD.updateArmed(xplaneData.get("is_armed_srm") + xplaneData.get("is_armed_gun"));
  HUD.updateWeapon([xplaneData.get("is_armed_gun"), xplaneData.get("is_armed_srm")], xplaneData.get("gun_ammo"));
  HUD.updateGear(xplaneData.get("aoa_bracket"));
  HUD.setGearOut(xplaneData.get("is_gear_out"));
  HUD.setAirBrakeOn(xplaneData.get("air_brake_on"));
  HUD.updateFPVPosition(new Vector(HUD.getYaw(xplaneData.get("hpath") + xplaneData.get("mag_var")), xplaneData.get("pitch") - xplaneData.get("vpath")));
  var targeted = xplaneData.get("is_armed_srm") + xplaneData.get("is_armed_gun");
  if(xplaneData.get("target_index") === 0){
    targeted = false;
  }
//  HUD.updateTarget(planes[xplaneData.get("target_index")], planes[0], targeted, xplaneData.get("compass"), xplaneData.get("pitch"), xplaneData.get("roll"));
  HUD.updateRotationRates(xplaneData.get("pitch_rate"), xplaneData.get("yaw_rate"), xplaneData.get("roll_rate"));
  HUD.resetErrors();
  // if(xplaneData.get("errors").length > 0){
  //   HUD.addError("Missing Data: " + xplaneData.get("errors").toString());
  // }
  HUD.draw();
}

function injectRadarData(Canvas, xplaneData){
  Canvas.updatePlanes(xplaneData.get("planes").slice(1));
  Canvas.updateOwnPlane(xplaneData.get("planes")[0]);
  Canvas.updateCompass(xplaneData.get("compass"));
  Canvas.updateRoll(xplaneData.get("roll"));
  Canvas.resetErrors();
  if(xplaneData.get("errors").length > 0){
    Canvas.addError("Missing Data: " + xplaneData.get("errors").toString());
  }
  Canvas.draw();
}

function injectSMSData(Canvas, xplaneData){
  for(var i = 0; i < xplaneData.get("stations").length; i++){
    Canvas.updateStation(i+1, xplaneData.get("stations")[i].type, xplaneData.get("stations")[i].status);
  }
  if(xplaneData.get("is_armed_srm")){
    Canvas.selectStationsByType(8);
  }
  else {
    Canvas.selectStationsByType(-1);
  }
  Canvas.updateGunAmmo(xplaneData.get("gun_ammo"));
  Canvas.updateOilTmp(xplaneData.get("oil_tmp"));
  Canvas.updateRPM(xplaneData.get("rpm"));
  Canvas.updateFTIT(xplaneData.get("ftit"));
  Canvas.updateFF(xplaneData.get("ff"))
  Canvas.updateFOB(xplaneData.get("fob") * 2.2)
  Canvas.resetErrors();
  if(xplaneData.get("errors").length > 0){
    Canvas.addError("Missing Data: " + xplaneData.get("errors").toString());
  }
  Canvas.draw();
}

function injectGaugeData(xplaneData){
  AOA.updateAOA(xplaneData.get("aoa_bracket"));
  AOA.draw();
  VS.updateVS(xplaneData.get("vertical_speed") * 60 * meter_in_feet);
  VS.draw();
  Altitude.updateAltitude(xplaneData.get("altitude"));
  Altitude.resetErrors();
  // if(xplaneData.get("errors").length > 0){
  //   Altitude.addError("Missing Data: " + xplaneData.get("errors").toString());
  // }
  Altitude.draw();
  Speed.updateSpeed(xplaneData.get("speed"));
  Speed.updateMach(xplaneData.get("mach"));
  Speed.resetErrors();
  // if(xplaneData.get("errors").length > 0){
  //   Speed.addError("Missing Data: " + xplaneData.get("errors").toString());
  // }
  Speed.draw();
  Attitude.setRoll(xplaneData.get("roll"));
  Attitude.setPitch(xplaneData.get("pitch"));
  // if(Attitude.setCompass)
	//   Attitude.setCompass(xplaneData.get("compass"));
  Attitude.draw();
}
