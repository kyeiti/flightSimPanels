// Die Reihenfolge der DataRefs, wie sie von X-Plane übergeben werden (zählen fängt bei 0 an).
// Wird ein Wert nicht übergeben, kann er mit null ignoriert werden.
var xplane_data = {
	compass_target: null,
	speed: 'sim/flightmodel/position/indicated_airspeed', // IAS #indicated_airspeed
	mach: 'sim/flightmodel/misc/machno', // Mach number #machno
	ground_speed: 'sim/flightmodel/position/groundspeed', // Own ground speed
	altitude: 'sim/cockpit2/gauges/indicators/altitude_ft_pilot', // Indicated altitude
	rad_alt: 'sim/flightmodel/position/y_agl', // AGL in meters #y_agl
	compass: 'sim/flightmodel/position/mag_psi', // Magnetic heading #mag_psi
	mag_var: 'sim/flightmodel/position/magnetic_variation', // Present magnetic variation #magnetic_variation
	hpath: 'sim/flightmodel/position/hpath', // True track #hpath
	vpath: 'sim/flightmodel/position/vpath', // True theta - alpha #vpath
	pitch: 'sim/flightmodel/position/true_theta', // Pitch #true_theta
	aoa_bracket: 'sim/flightmodel/position/alpha', // Angle of attack #alpha
	roll: 'sim/flightmodel/position/true_phi', // #true_phi
	g: 'sim/flightmodel/forces/g_nrml', // Current g-forces #g_nrml
	vertical_speed: 'sim/flightmodel/position/vh_ind', // #vh_ind
	roll_rate: 'sim/flightmodel/position/P',
	pitch_rate: 'sim/flightmodel/position/Q',
	yaw_rate: 'sim/flightmodel/position/R',
	oil_tmp: 'sim/cockpit2/annunciators/oil_temperature',
	rpm: 'sim/cockpit2/engine/indicators/N1_percent',
	ftit: 'sim/cockpit2/engine/indicators/ITT_deg_C',
	ff: 'sim/cockpit2/engine/indicators/fuel_flow_kg_sec',
	tank0: 'sim/cockpit2/fuel/fuel_quantity',


	is_gear_out: 'sim/aircraft/parts/acf_gear_deploy[0]', // #acf_gear_deploy
	air_brake_on: 'sim/cockpit/warnings/annunciators/speedbrake', // Is the speedbrake extended #sim/cockpit/warnings/annunciators/speedbrake
	on_ground: 'sim/flightmodel/failures/onground_all', // Are all wheels on the ground #onground_all
	latitude_own: 'sim/flightmodel/position/latitude', // latitude
	longitude_own: 'sim/flightmodel/position/longitude', // longitude
	elevation_own: 'sim/flightmodel/position/elevation',
	is_armed_gun: 'sim/cockpit/weapons/guns_armed', // Is the gun active? #guns_armed
	is_armed_srm: 'sim/cockpit/weapons/missiles_armed', // Is the missle active?
	gun_ammo: 'sim/weapons/bul_rounds',
	station1_type: 'sim/weapons/type', // Weapon Station 1 #/sim/weapons/type








	station1_status: 'sim/weapons/action_mode', // Weapon Station 1 Status #/sim/weapons/action_mode








	target_index: 'sim/cockpit/weapons/plane_target_index', // Which plane is targeted? #target_index
	plane1_lat: 'sim/multiplayer/position/plane1_lat', // First multiplayer plane lattitude #plane1_lat
	plane1_long: 'sim/multiplayer/position/plane1_lon', // First multiplayer plane longitude #plane1_lon
	plane1_el: 'sim/multiplayer/position/plane1_el', // First multiplayer plane elevation above msl #plane1_el
	plane1_hdg: 'sim/multiplayer/position/plane1_psi', // First multiplayer plane heading #plane1_psi
	plane1_gs_x: 'sim/multiplayer/position/plane1_v_x', // First multiplayer plane ground speed #plane1_
	plane1_gs_y: 'sim/multiplayer/position/plane1_v_y', // First multiplayer plane ground speed #plane1_
	plane1_bearing: 'sim/cockpit2/tcas/indicators/relative_bearing_degs' // Bearing to the first multiplayer plane #sim/cockpit2/tcas/indicators/relative_bearing_degs
}

// Nummer der Flugzeuge deren Werte übergeben werden (Für Radar und Targeting)
var c_planes = 2;
var c_plane_values = 7;
var c_stations = 9;
var c_tanks = 3;

var c_flatten = 15; //number of last values to save for flattening the values;

/************************/
/* Settings for the HUD */
/************************/
// Zum horizontalen Verschieben des Bildes (HUD)
var offset_x = 90;
// Zum senkrechten Verschieben des Bildes (HUD)
var offset_y = 300;

var hud_scale = 1;

var pitch_ladder_5deg_in_pixel = 200;
//how many pixels are 5 degrees pitch mapping to? (for fpv calibration)

var on_ground_pitch = 1;
var on_ground_vpath = 0;

var target_box_offset_x = -50;
var target_box_offset_y = 150;
var target_box_movement_factor_x = 28;
var target_box_movement_factor_y = 28;


/******************/
/* Radar-Settings */
/******************/
// Zum horizontalen Verschieben des Bildes (Radar)
var radar_offset_x = 200;
// Zum senkrechten Verschieben des Bildes (Radar)
var radar_offset_y = 80;

var radar_angle = 120;
var radar_range = 40;
var radar_size = 600;
var radar_update_rate = 3000 // in milliseconds
var radar_no_trails = 5 // number of positions to show per plane
var radar_closure_kts_to_px = 50;
var radar_min_speed = 20; // minimum ground speed a plane needs to have to be picked up by the radar

/*******************************/
/* Settings for the SMS-Canvas */
/*******************************/
// Zum horizontalen Verschieben des Bildes
var sms_offset_x = 180;
// Zum senkrechten Verschieben des Bildes
var sms_offset_y = 40;

var sms_size = 500;

var weapon_types = {
	1: "MAU",
	2: "Weapontype2",
	3: "",
	8: "AIM-9"
}


/*******************************/
/* Settings for the Gauges     */
/*******************************/
var altitude_offset_x = 340;
var altitude_offset_y = 65;
var altitude_size = 250;

var speed_offset_x = 10;
var speed_offset_y = 65;
var speed_size = 250;

var aoa_offset_x = 30;
var aoa_offset_y = 410;
var aoa_size = 1.2;

var vs_offset_x = 500;
var vs_offset_y = 410;
var vs_size = 1.2;

var attitude_offset_x = 170;
var attitude_offset_y = 395;
var attitude_size = 270;

var attitude_three = true; // Use 3D-Attitude (requires WebGL), restart grunt when changed
var instrument_border_color = "#333333";

/*********************************/
/* Some constants for conversion */
/*********************************/

var meter_in_feet = 3.28084;
var meter_s_in_kts = 1.94384;
var nm_in_meter = 1852;
var meter_in_yard = 1.09361;
var kg_in_lbs = 2.20462;

var muzzle_velocity = 1052;

var error_color = "red";

var refresh_timer = 100; // in ms

// Do NOT touch!
module.exports = { attitude_three: attitude_three };