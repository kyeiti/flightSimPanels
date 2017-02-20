// Die Reihenfolge der DataRefs, wie sie von X-Plane übergeben werden (zählen fängt bei 0 an).
// Wird ein Wert nicht übergeben, kann er mit null ignoriert werden.
var config = {
	compass_target: null,
	speed: 0, // IAS #indicated_airspeed
	mach: 1, // Mach number #machno
	ground_speed: 2, // Own ground speed
	altitude: 3, // Indicated altitude
	rad_alt: 4, // AGL in meters #y_agl
	compass: 5, // Magnetic heading #mag_psi
	mag_var: 6, // Present magnetic variation #magnetic_variation
	hpath: 7, // True track #hpath
	vpath: 8, // True theta - alpha #vpath
	pitch: 9, // Pitch #true_theta
	aoa_bracket: 10, // Angle of attack #alpha
	roll: 11, // #true_phi
	g: 12, // Current g-forces #g_nrml
	vertical_speed: 13, // #vh_ind
	roll_rate: 14,
	pitch_rate: 15,
	yaw_rate: 16,
	oil_tmp: 17,
	rpm: 18,
	ftit: 19,
	ff: 20,
	tank0: 21,


	is_gear_out: 24, // #acf_gear_deploy
	air_brake_on: 25, // Is the speedbrake extended #sim/cockpit/warnings/annunciators/speedbrake
	on_ground: 26, // Are all wheels on the ground #onground_all
	latitude_own: 27, // latitude
	longitude_own: 28, // longitude
	elevation_own: 29,
	is_armed_gun: 30, // Is the gun active? #guns_armed
	is_armed_srm: 31, // Is the missle active?
	gun_ammo: 32,
	station1_type: 33, // Weapon Station 1 #/sim/weapons/type








	station1_status: 42, // Weapon Station 1 Status #/sim/weapons/action_mode








	target_index: 51, // Which plane is targeted? #target_index
	plane1_lat: 52, // First multiplayer plane lattitude #plane1_lat
	plane1_long: 53, // First multiplayer plane longitude #plane1_lon
	plane1_el: 54, // First multiplayer plane elevation above msl #plane1_el
	plane1_hdg: 55, // First multiplayer plane heading #plane1_psi
	plane1_gs_x: 56, // First multiplayer plane ground speed #plane1_
	plane1_gs_y: 57, // First multiplayer plane ground speed #plane1_
	plane1_bearing: 58 // Bearing to the first multiplayer plane #sim/cockpit2/tcas/indicators/relative_bearing_degs
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
var offset_y = 600;

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

// Do NOT touch!
module.exports = { attitude_three: attitude_three };