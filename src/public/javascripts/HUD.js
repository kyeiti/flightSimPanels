
// length of the pointer of the arrow
var arrow_length = 10;
var padding = 2;

var crosshairs_inner_size = 6.7;
var crosshairs_line_length = 10;

class HUD_Canvas extends Canvas {
  constructor(id, color, bg_color){
    super(id, color, bg_color);
    this.objects = {
      attitude: new Attitude(this, this.color, 20, this.getHeight()/2-20, pitch_ladder_5deg_in_pixel),
      speed: new Speed_Meter(this, this.color, 50, 150, 0, 100, 10, 5, 20),
      altitude: new Altitude_Meter(this, this.color, this.getWidth() - 150, 150, 0, 100, 10, 5, 20),
      crosshairs: new Crosshairs(this, this.color, this.getWidth()/2 - crosshairs_inner_size/2 - crosshairs_line_length, 50),
      compass: new Compass(this, this.color, this.getWidth()/2 - 75, 275, 150, 10, 30),
      fpv: new FPV(this, this.color, this.getWidth()/2, 50 + crosshairs_inner_size/2 + crosshairs_line_length, 17, 10, 10),
      roll: new Roll(this, this.color, this.getWidth()/2, 380, 90),
    };
    this.objects.gun_pipper = new GunPipper(this, this.color,this.objects.crosshairs, 30);
    this.objects.missile_pipper = new Pipper(this, this.color, this.getWidth()/2, this.getHeight()/2-20, this.objects.attitude.getCoordinateLength()*2.5);
    this.objects.air_brake = new AirBrake(this, this.color, this.objects.fpv, 30);
    this.objects.target = new Target(this, this.color, 50, this.objects.crosshairs);
    this.objects.g = new G(this, this.color, this.objects.speed.getCenterX(), this.objects.speed.getY());
    this.objects.gear = new Gear(this, this.color, this.getWidth()/2 - 20, 0, 30, new Vector(0, this.objects.attitude.getCoordinateLength()));
    this.objects.armed = new Armed(this, this.color, this.objects.speed.getCenterX(), this.objects.speed.getBottom() + font_size);
    this.objects.mach = new Mach(this, this.color, this.objects.speed.getCenterX(), this.objects.armed.getBottom());
    this.objects.weapon = new Weapon(this, this.color, this.objects.speed.getCenterX(), this.objects.mach.getBottom() + font_size);
    this.objects.rad_alt = new RadAlt(this, this.color, this.objects.altitude.getCenterX() - 20, this.objects.armed.getBottom() - font_size/2);
    this.objects.attitude.updateMarker(this.objects.fpv.getCircleCenter());
    this.objects.fpv.updateMovementVector(new Vector(-this.objects.compass.getCoordinateLength(), this.objects.attitude.getCoordinateLength()));
    this.objects.target.updateMovementVector(new Vector(target_box_movement_factor_x, target_box_movement_factor_y));
    this.objects.target.updateOffsetVector(new Vector(target_box_offset_x, target_box_offset_y));
    this.objects.gear.updatePosition(this.objects.fpv.getCircleCenter());
    this.objects.gun_pipper.setRotationMovement(this.objects.attitude.getCoordinateLength());
  }

  updateWeapon(weapons_array, ammo){
    this.objects.weapon.updateWeapon(weapons_array, ammo);
    this.objects.gun_pipper.setStatus(weapons_array[0] == 1);
    this.objects.missile_pipper.setStatus(weapons_array[1] == 1);
  }

  updateSpeed(speed){
    this.objects.speed.setSpeed(speed);
  }

  updateAltitude(height) {
    this.objects.altitude.setAltitude(height);
  }

  updateRoll(rotation){
    this.objects.attitude.rotate(rotation);
    this.objects.roll.setRoll(rotation);
  }

  updatePitch(pitch){
    this.objects.attitude.setPitch(pitch);
  }

  setAirBrakeOn(is_on){
    this.objects.air_brake.setValue(is_on);
  }

  updateFPVPosition(point){
    this.objects.fpv.move(point);
    this.objects.attitude.updateMarker(this.objects.fpv.getCircleCenter());
    this.objects.gear.updatePosition(this.objects.fpv.getCircleCenter());
    if(this.objects.compass.start_point.val(1) <= this.objects.fpv.getBottom()){
      this.objects.compass.moveDownTo(this.objects.fpv.getBottom() + 2);
    }
    else {
      this.objects.compass.moveDownTo(this.objects.compass.start_point.val(1));
    }
  }

  updateCompass(direction) {
    this.objects.compass.setValue(direction);
  }

  updateCompassTarget(target) {
    this.objects.compass.setTarget(target);
  }

  updateG(g){
    this.objects.g.setValue(g);
  }

  updateMach(val){
    this.objects.mach.setValue(val);
  }

  updateRadAlt(val){
    this.objects.rad_alt.setValue(val);
  }

  updateGear(val){
    this.objects.gear.setValue(val);
  }

  setGearOut(val){
    this.objects.gear.setActive(val);
  }

  updateArmed(val){
    this.objects.armed.updateArmed(val);
  }

  getYaw(val){
    return this.objects.compass.getYaw(val);
  }

  getNosePosition(){
    return this.objects.crosshairs.getCenter();
  }

  updateRotationRates(pitch, yaw, roll){
    this.objects.gun_pipper.setRotationRates(pitch, yaw, roll);
  }

  updateTarget(target, own_position, exists, compass, pitch, roll){
    this.objects.target.setPlane(target);
    this.objects.target.setRelativePosition(own_position, compass, pitch, roll);
    this.objects.target.setTargetStatus(exists);
    this.objects.gun_pipper.setDistance(this.objects.target.getDistance());
    this.objects.gun_pipper.setAspect(target.getHeading() - own_position.getHeading());
    this.objects.gun_pipper.setOwnPlane(own_position);
    this.objects.gun_pipper.setTargetPlane(target);
    this.objects.missile_pipper.setDistance(this.objects.target.getDistance());
    this.objects.missile_pipper.setAspect(target.getHeading() - own_position.getHeading());
  }

  draw () {
    super.draw();
    this.objects.attitude.updateMarker(this.objects.fpv.getCircleCenter());
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.objects[key].draw();
      }
    }
  }
}

class Pipper extends Canvas_Object {
  constructor(Canvas, color, center_x, center_y, radius){
      super(Canvas, color, center_x - radius, center_y - radius, 0, radius*2, radius*2);
      this.distance_val = 0;
      this.distance_max = 4000;
      this.aspect_val = 0;
      this.radius = radius;
      this.is_on = false;
  }

  setDistance(val){
    this.distance_val = val;
  }

  setDistanceMax(val){
    this.distance_max = val;
  }

  setAspect(val){
    this.aspect_val = val;
  }

  setStatus(stat){
    this.is_on = stat;
  }

  draw(){
    if(this.is_on){
      var center = this.getCenter();
      this.Canvas.circle(center, 4);
      this.Canvas.circle(center, this.radius);
      var deg = (this.distance_val * meter_in_yard)/this.distance_max * 360;
      if(deg > 360){
        deg = 360;
      }
      var part_deg = 90;
      if(deg < part_deg){
        part_deg = deg;
      }
      this.Canvas.setLineWidth(3);
      this.Canvas.circlePart(center, this.radius - 1, -90, -90 + part_deg);
      this.Canvas.setLineWidth(1);
      this.Canvas.rotateAround(deg, center);
      this.Canvas.drawRect(center.sub(2.5, this.radius), 5, 10, true);
      this.Canvas.rotateAround(-deg, center);

      this.Canvas.rotateAround(this.aspect_val, center);
      this.Canvas.drawPolygon([center.sub(0, this.radius + 1), center.sub(5, this.radius + 11), center.sub(-5, this.radius + 11)]);
      this.Canvas.rotateAround(-this.aspect_val, center);
    }
  }
}

class GunPipper extends Pipper {
  constructor(Canvas, color, relative_to, radius){
    super(Canvas, color, relative_to.getCenter().val(0), relative_to.getCenter().val(1), radius);
    this.relative_to = relative_to;
    this.distance_max = 4000;
    this.pitch_rate = 0;
    this.roll_rate = 0;
    this.yaw_rate = 0;
    this.rotation_movement = 1;
    this.own_plane = null;
    this.target_plane = null;
    this.cache = [];
  }

  setOwnPlane(plane){
    this.own_plane = plane;
  }

  setTargetPlane(plane){
    this.target_plane = plane;
  }

  setRotationMovement(mvmnt){
    this.rotation_movement = mvmnt;
  }

  setRotationRates(pitch, yaw, roll){
    this.pitch_rate = pitch;
    this.roll_rate = roll;
    this.yaw_rate = yaw;
  }

  // Gibt den Vektor für den Mittelpunkt des Canvas_Object zurück.
  getCenter(){
    // How to use this.own_plane:
    // var own_alt = this.own_plane.getAltitude();
    // Usage for this.target_plane is the same. Reference Plane-Class in canvas.js

    // To avoid the pipper going way outside
    var dist = this.distance_val;
    if(this.distance_val > this.distance_max)
      dist = this.distance_max
    var time_to_target = dist/muzzle_velocity;
    // Richtungsvektor mit Gradzahlen
    var rate_vector = new Vector(-this.yaw_rate, this.pitch_rate);//.rotate(-this.roll_rate);
    // Umrechnung Grad in Pixel (Grad * Grad_in_Pixel_Wert)
    rate_vector = rate_vector.mul(this.rotation_movement);
    // Verlängerung auf Zielentfernung
    rate_vector = rate_vector.mul(time_to_target);
    // Richtungsvektor in Position bringen
    this.cache.splice(0, 0, rate_vector);
    this.cache = this.cache.slice(0, c_flatten);
    var rate_sum = new Vector(0, 0);
    for(var i = 0; i < this.cache.length; i++){
      rate_sum = rate_sum.add(this.cache[i]);
    }
    console.log(rate_sum.values, rate_sum.mul(1/this.cache.length).values, rate_vector);
    return this.relative_to.getCenter().add(rate_sum.mul(1/this.cache.length));
  }

  draw(){
    if(this.is_on){
      super.draw();
      this.Canvas.drawLine(this.getCenter(), this.relative_to.getCenter());
    }
  }
}

class Armed extends Text_Object{
  constructor (Canvas, color, x, y){
    super(Canvas, color, x, y, 0, Canvas.measureText("ARM"));
    this.value = "NAV";
    this.values = ["NAV", "ARM"];
    this.is_centered = false;
  }

  updateArmed(armed){
    if(Boolean(armed)){
      this.value = this.values[1];
    }
    else{
      this.value = this.values[0];
    }
  }
}

class Weapon extends Text_Object {
  constructor (Canvas, color, x, y){
    super(Canvas, color, x, y, 0, Canvas.measureText("GUN"));
    this.value = "";
    this.values = ["", "GUN", "SRM"];
    this.is_centered = false;
    this.ammo = new Ammo(Canvas, color, x-2*padding, y, 0, Canvas.measureText("459"));
  }

  moveX(offset){
    super.moveX(offset);
    this.ammo.moveX(offset);
  }

  moveY(offset){
    super.moveY(offset);
    this.ammo.moveY(offset);
  }

  updateWeapon(weapon_selected, ammo){
    var i = weapon_selected.indexOf(1) + 1;
    this.value = this.values[i];
    if(i == 1){
      this.ammo.setValue(ammo);
    }
    else {
      this.ammo.setValue("");
    }
  }

  draw(){
    super.draw();
    this.ammo.draw();
  }
}

class Ammo extends Number_Object {
  numberFormat(val) {
    if(val != "")
      return number_format(val, 0, ".", ",");
    else
      return "";
  }

  draw() {
    this.Canvas.setBaseline("middle");
    this.Canvas.write(this.numberFormat(this.value), this.start_point.sub(this.Canvas.measureText(this.value), 0));
  }
}

class G extends Number_Object{
  constructor (Canvas, color, x, y){
    super(Canvas, color, x, y, Canvas.measureText("9.0"));
  }
}

class Mach extends Number_Object{
  constructor (Canvas, color, x, y){
    super(Canvas, color, x, y, Canvas.measureText("0.00"));
    this.value = 1;
  }

  numberFormat(val) {
    return number_format(val, 2, ".", ",");
  }
}

class RadAlt extends Number_Object{
  constructor (Canvas, color, x, y, width, height){
    super(Canvas, color, x, y, Canvas.measureText("R 9,000"), font_size);
    this.value = 1;
  }

  numberFormat(val) {
    return number_format(val, 0, ".", ",");
  }

  draw(){
    this.Canvas.setBaseline("middle");
    this.Canvas.write("R", this.start_point);
    this.Canvas.drawRect(this.start_point.add(this.Canvas.measureText("R "), - font_size/2), this.Canvas.measureText(this.numberFormat(this.value)), font_size, true, this.color);
    this.Canvas.write(this.numberFormat(this.value), this.start_point.add(this.Canvas.measureText("R "), 0));
  }
}

class AirBrake extends Canvas_Object {
  constructor (Canvas, color, relative_to, radius){
    super(Canvas, color, relative_to.getCircleCenter().val(0), relative_to.getCircleCenter().val(1), 0, radius, radius);
    this.is_on = false;
    this.relative_to = relative_to;
    this.radius = radius;
  }
  setValue(is_on){
    this.is_on = is_on;
  }
  draw(){
    if(this.is_on){
      this.Canvas.circlePart(this.relative_to.getCircleCenter(), this.radius, -45-90, 45-90);
    }
  }

}

class Attitude extends Line_Object {
  constructor (Canvas, color, y, y_center, line_distance){
    super(Canvas, color, 0, y - Canvas.getHeight(), 0, Canvas.getWidth(), Canvas.getHeight()*2, 5, line_distance, new Vector(0, y_center), false);
    this.line_length = 50;
    this.centerpadding = 40;
    this.value = 1;
    this.marker = super.getMarker();
  }

  rotate(degrees) {
    this.rotation = -degrees;
  }

  setPitch(angle) {
    this.value = angle;
  }

  drawLine(val, x, y){
    if(val == 0) {
      this.Canvas.drawLine(this.start_point.val(0), y, x - this.centerpadding, y);
      this.Canvas.drawLine(this.start_point.val(0) + this.width, y, x + this.centerpadding, y);
    }
    else if( val > 0 ) {
      this.Canvas.setBaseline("top");
      var line_end = x - this.centerpadding;
      this.Canvas.drawLine(line_end - this.line_length, y, line_end, y);
      this.Canvas.drawLine(line_end, y, line_end, y + font_size/2);
      this.Canvas.write(val, x - this.centerpadding - this.line_length, y + padding);
      var line_end = x + this.centerpadding;
      this.Canvas.drawLine(x + this.centerpadding + this.line_length, y, line_end, y);
      this.Canvas.drawLine(line_end, y, line_end, y + font_size/2);
      this.Canvas.write(val, x + this.centerpadding + this.line_length - this.Canvas.measureText(val), y + padding);
    }
    else if( val < 0 ) {
      this.Canvas.setBaseline("bottom");
      var line_end = x - this.centerpadding;
      this.Canvas.setLineStyle(line_end, 0, line_end - this.line_length, 0, 3);

      this.Canvas.drawLine(line_end - this.line_length, y, line_end, y);
      this.Canvas.drawLine(line_end, y, line_end, y - font_size/2);
      this.Canvas.setDefaultOptions();

      this.Canvas.write(this.formatNumber(val), x - this.centerpadding - this.line_length, y + padding);

      var line_end = x + this.centerpadding;

      this.Canvas.setLineStyle(line_end, 0, line_end + this.line_length, 0, 3);
      this.Canvas.drawLine(line_end + this.line_length, y, line_end, y);
      this.Canvas.drawLine(line_end, y, line_end, y - font_size/2);
      this.Canvas.setDefaultOptions();
      this.Canvas.write(this.formatNumber(val), x + this.centerpadding + this.line_length - this.Canvas.measureText(this.formatNumber(val)), y + padding);
    }
  }

  formatNumber(val) {
    return val;
  }

  getLineBottom() {
    return this.getMarker().val(0);
  }

  draw() {
    this.Canvas.rotateAround(this.rotation, this.getMarker());
    super.draw();
    this.Canvas.rotateAround(-this.rotation, this.getMarker());
  }

  updateMarker(marker){
    this.marker = marker;
  }

  getMarker(){
    return this.marker;
  }
}

class Crosshairs extends Canvas_Object {
  constructor (Canvas, color, x, y) {
    var line_length = crosshairs_line_length;
    var width = line_length * 2 + crosshairs_inner_size;
    super(Canvas, color, x, y, 0, width, width);
    this.line_length = line_length;
  }

  draw(){
    this.Canvas.drawLine(this.start_point.val(0), this.getCenter().val(1), this.start_point.val(0) + this.line_length, this.getCenter().val(1));
    this.Canvas.drawLine(this.start_point.val(0) + this.width - this.line_length, this.getCenter().val(1), this.start_point.val(0) + this.width, this.getCenter().val(1));
    this.Canvas.drawLine(this.getCenter().val(0), this.start_point.val(1), this.getCenter().val(0), this.start_point.val(1) + this.line_length);
    this.Canvas.drawLine(this.getCenter().val(0), this.start_point.val(1) + this.height - this.line_length, this.getCenter().val(0), this.start_point.val(1) + this.height);
  }
}

class Line_Meter_Object extends Line_Object {
  constructor (Canvas, color, x, y, rotation, height, direction, line_long_length, line_short_length, line_marker_length){
    var text_width = Canvas.measureText(100);
    var width = text_width + line_long_length + line_marker_length + 4*padding + arrow_length;
    super(Canvas, color, x, y, rotation, width, height, 10, 8, new Vector(width/2, height/2), false);
    this.text_width = text_width;
    this.value = 0;
    this.direction = direction;
    this.line_long = line_long_length;
    this.line_short = line_short_length;
    this.line_marker_length = line_marker_length;
    this.draw_negative = false;
  }

  getCenterX(){
    if(this.direction == 1)
    var end_x = this.start_point.val(0) + this.width;
    else
    var end_x = this.start_point.val(0);
    return end_x - this.direction * this.line_marker_length;
  }

  formatShort(val){
    return val/10;
  }

  getLineBottom() {
    return this.getCenterX();
  }

  drawLine(number_value, x, y) {
    if(this.draw_negative || number_value >= 0){
      if(number_value % 50 == 0) {
        this.Canvas.drawLine(x - this.direction * this.line_long, y, x, y);
        if(number_value % 100 == 0 && (y > this.getMarker().val(1) + font_size || y < this.getMarker().val(1) - font_size)){
          var number_string = this.formatShort(number_value);
          var x_num = x - this.direction * (this.line_long + 2);
          if(this.direction == 1){
            x_num = x_num - this.Canvas.measureText(number_string);
          }
          this.Canvas.write(number_string, x_num, y);
        }
      }
      else
      this.Canvas.drawLine( x - this.direction * this.line_short, y, x, y);
    }
  }

  draw () {
    this.Canvas.setBaseline("middle");
    super.draw();
    var text_width = this.Canvas.measureText(this.formatNumber(this.value));
    if(text_width < this.text_width)
    text_width = this.text_width;
    var box_start_x = this.getCenterX() - this.direction * (padding * 3 + arrow_length + text_width + this.line_long);
    var box_end_x = box_start_x + this.direction * (text_width + 4*padding);
    var box_arrow_x = box_end_x + this.direction * arrow_length;
    var box_top_y = this.getCenter().val(1) - font_size/2 - padding;
    var box_bottom_y = this.getCenter().val(1) + font_size/2 + padding;
    var number_start_x = (box_start_x + box_end_x) / 2 - (this.Canvas.measureText(this.formatNumber(this.value))/2);
    var points = [new Vector(box_start_x, box_top_y), new Vector(box_end_x, box_top_y), new Vector(box_arrow_x, this.getCenter().val(1)), new Vector(box_end_x, box_bottom_y), new Vector(box_start_x, box_bottom_y), new Vector(box_start_x, box_top_y)];
    this.Canvas.drawPolygon(points);
    this.Canvas.write(this.formatNumber(this.value), number_start_x, this.getCenter().val(1));
    this.Canvas.drawLine(this.getCenterX() + this.direction * padding, this.getCenter().val(1), this.getCenterX() + this.direction * this.line_marker_length, this.getCenter().val(1));
  }

  formatNumber(number){
    return number;
  }
}

class Speed_Meter extends Line_Meter_Object {
  constructor (Canvas, color, x, y, rotation, height, line_long_length, line_short_length, line_marker_length){
    super(Canvas, color, x, y, rotation, height, 1, line_long_length, line_short_length, line_marker_length);
  }

  setSpeed(speed) {
    this.value = speed;
  }

  formatNumber(number) {
    return number_format(number, 0, "", "");
  }

}

class Altitude_Meter extends Line_Meter_Object {
  constructor (Canvas, color, x, y, rotation, height, line_long_length, line_short_length, line_marker_length){
    super(Canvas, color, x, y, rotation, height, -1, line_long_length, line_short_length, line_marker_length);
    this.draw_negative = true;
  }

  setAltitude(height) {
    this.value = height;
  }

  formatNumber(number) {
    return number_format(number, 0, "", ",");
  }

  formatShort(number) {
    var num = this.formatNumber(number);
    return num.substring(0, num.length-2);
  }
}

class Compass extends Line_Object{
  constructor (Canvas, color, x, y, width, line_length, line_distance){
    var height = line_length + font_size;
    super(Canvas, color, x, y, 0, width, height, -5, line_distance, new Vector(width/2, 0), true);
    this.line_length = line_length;
    this.target = null;
    this.offset_y = 0;
  }

  drawLine(number_value, y, x){
    if(number_value % 10 == 0){
      this.Canvas.drawLine(x, y, x, y + this.line_length);
      var text = this.format(number_value);
      if (x + this.Canvas.measureText(text) + padding < this.getMarker().val(0) || x - this.Canvas.measureText(text) - padding > this.getMarker().val(0)){
        this.Canvas.write(text, x - this.Canvas.measureText(text)/2, y + this.line_length);
      }
    }
    else{
      this.Canvas.drawLine(x, y, x, y + this.line_length/2);
    }
  }

  draw() {
    this.Canvas.setBaseline("top");
    super.draw();
    var text_length = this.Canvas.measureText(this.format(this.value));
    this.Canvas.drawRect(this.getCenter().val(0) - text_length/2, this.getLineBottom() + this.line_length + padding, text_length, font_size, true);
    this.Canvas.drawLine(this.getCenter().val(0), this.getY(), this.getCenter().val(0), this.getY() + this.line_length*2);
    this.Canvas.write(this.format(this.value), this.getMarker().val(0) - text_length/2, this.getLineBottom() + this.line_length + padding);
    if(this.target != null){
      var dTarget = this.target - this.value;
      var dEdge = (-1 * this.line_value * this.compare_size/this.line_distance)/2;
      if(this.target + dEdge >= 360){
        if(dTarget > dEdge)
        dTarget -= 360;
      }
      var ratio = this.line_value / this.line_distance;
      if(dEdge >= Math.abs(dTarget)){
        var target_x = this.getCenter().val(0) - dTarget / this.line_value * this.line_distance;
        this.Canvas.drawLine(target_x - this.line_length/2, this.getY() + this.line_length, target_x, this.getY() + this.line_length * 2);
        this.Canvas.drawLine(target_x + this.line_length/2, this.getY() + this.line_length, target_x, this.getY() + this.line_length * 2);
      }
    }
  }

  getRealNumber(val) {
    return ((val % 360) + 360) % 360;
  }

  getYaw(angle){
    var ret = this.getRealNumber(this.getRealNumber(angle) - this.getRealNumber(this.value));
    if(ret + 180 >= 360)
    ret -= 360;
    return ret;
  }

  format(val){
    return pad(number_format(this.getRealNumber(val), 0, "", ""), 3); // To avoid negative numbers
  }

  getLineBottom() {
    return this.getY() + this.line_length*2 + padding;
  }

  setTarget(target) {
    if(target == null)
    this.target = null;
    else
    this.target = this.getRealNumber(target);
  }

  setValue(val) {
    this.value = this.getRealNumber(val);
  }

  getY(){
    return this.start_point.val(1) + this.offset_y;
  }

  moveDownTo(y){
    this.offset_y = y - this.start_point.val(1);
  }
}

class FPV extends Canvas_Object{
  constructor(Canvas, color, center_x, center_y, wing_length, tail_length, radius){
    var width = wing_length*2 + radius*2;
    var height = tail_length + radius*2;
    super(Canvas, color, center_x - width/2, center_y - tail_length - radius, 0, width, height);
    this.tail_length = tail_length;
    this.wing_length = wing_length;
    this.radius = radius;
    this.movement_vector = new Vector(0,0);
    this.offset = new Vector(0, 1);
  }

  updateMovementVector(point){
    this.movement_vector = point;
  }

  getCircleCenter(){
    return this.start_point.add(this.wing_length + this.radius, this.tail_length + this.radius).add(this.getCoordinateOffset());
  }

  draw(){
    this.Canvas.circle(this.getCircleCenter(), this.radius);
    this.Canvas.drawLine(this.getCircleCenter().add(- this.radius, 0), this.getCircleCenter().add (- this.radius - this.wing_length, 0));
    this.Canvas.drawLine(this.getCircleCenter().add(this.radius, 0), this.getCircleCenter().add(this.radius + this.wing_length, 0));
    this.Canvas.drawLine(this.getCircleCenter().add(0, - this.radius), this.getCircleCenter().add(0, - this.radius - this.tail_length));
  }

  move(point){
    this.offset = point;
  }

  getCoordinateOffset(){
    return new Vector(this.offset.val(0) * this.movement_vector.val(0), this.offset.val(1) * this.movement_vector.val(1));
  }

  getBottom(){
    var bot = super.getBottom();
    return bot + this.getCoordinateOffset().val(1);
  }
}

class Roll extends Canvas_Object{
  constructor(Canvas, color, center_x, bottom_y, radius){
    var width = 2 * Math.PI * radius / 4;
    var height = 2 * Math.PI * radius / 8;
    super(Canvas, color, center_x - width/2, bottom_y - height, 0, width, height);
    this.radius = radius;
    this.value = 0;
    this.max = 45;
  }

  getBottomCenter(){
    return this.start_point.add(this.width/2, this.height);
  }

  getCircleCenter(){
    return this.getBottomCenter().add(0, -this.radius);
  }

  setRoll(val){
    this.value = val;
  }

  draw(){
    var lines = [{deg: 45, length: 10}, {deg: 30, length: 10}, {deg: 0, length: 10}, {deg:10, length: 5}, {deg: 20, length:5}];
    for(var i = 0; i < lines.length; i++){
      this.Canvas.rotateAround(lines[i].deg, this.getCircleCenter());
      this.Canvas.drawLine(this.getBottomCenter(), this.getBottomCenter().add(0, -lines[i].length));
      this.Canvas.rotateAround(-(lines[i].deg * 2), this.getCircleCenter());
      this.Canvas.drawLine(this.getBottomCenter(), this.getBottomCenter().add(0, -lines[i].length));
      this.Canvas.rotateAround(lines[i].deg, this.getCircleCenter());
    }
    var roll = this.value;
    if(Math.abs(roll) > this.max){
      roll = Math.sign(roll) * this.max;
    }
    this.Canvas.rotateAround(-roll, this.getCircleCenter());
    this.Canvas.drawPolygon([this.getBottomCenter(), this.getBottomCenter().add(5, 10), this.getBottomCenter().add(-5, 10)]);
    this.Canvas.rotateAround(roll, this.getCircleCenter());
  }
}

class Gear extends Canvas_Object{
  constructor(Canvas, color, x, center_y, height){
    var width = 5;
    super(Canvas, color, x, center_y - height/2, 0, width, height);
    this.value = 0;
    this.max = 45;
    this.active = false;
    this.movement_vector = new Vector(0, this.height/4);
  }

  updatePosition(pos){
    this.start_point = pos.add(-30, -this.height/2);
  }

  setActive(val){
    this.active = Boolean(val);
  }

  setValue(val){
    this.value = - val + 13;
  }

  draw(){
    if(this.active){
      var y = this.start_point.val(1) + this.movement_vector.val(1) * this.value;
      this.Canvas.drawLine(this.start_point.val(0), y, this.start_point.val(0) + this.width, y);
      this.Canvas.drawLine(this.start_point.val(0), y, this.start_point.val(0), y + this.height);
      this.Canvas.drawLine(this.start_point.val(0), y + this.height, this.start_point.val(0) + this.width, y + this.height);
    }
  }
}

class Target extends Canvas_Object{
  constructor(Canvas, color, height, relative_to){
    super(Canvas, color, 0, 0, 0, height, height);
    this.plane = new Plane(new Vector(1,1,1));
    this.is_on = false;
    this.relative_to = relative_to;
    this.distance = 0;
    this.movement_vector = new Vector(0,0);
      this.offset_vector = new Vector(0,0);
  }

  getDistance(){
    return this.distance;
  }

  updateMovementVector(point){
    this.movement_vector = point;
  }

  updateOffsetVector(point){
    this.offset_vector = point;
  }

  setPlane(plane){
    this.plane = plane;
  }

  setTargetStatus(has_target){
    this.is_on = has_target;
  }

  setRelativePosition(own_plane, compass, pitch, roll){
    this.distance = slant_range(ground_range(own_plane.getLat(), own_plane.getLon(), this.plane.getLat(), this.plane.getLon()), (own_plane.getAltitude() - this.plane.getAltitude()));
    //var dx = target_bearing(own_plane.getLat(), own_plane.getLon(), this.plane.getLat(), this.plane.getLon());
    var dx = this.plane.getBearing();
    dx = this.Canvas.getYaw(dx);
    var dy = delta_pitch_target((this.plane.getAltitude() - own_plane.getAltitude()), this.distance);
    dy = pitch - dy;
    this.start_point = this.relative_to.getCenter().add(new Vector(dx * this.movement_vector.val(0), dy * this.movement_vector.val(1)).add(this.offset_vector).rotate(-roll));
    if(this.getCenter().val(0) > this.Canvas.getRight()){
      this.start_point = this.start_point.add(-this.start_point.val(0) + this.Canvas.getRight() - this.width/2, 0);
    }
    if(this.getCenter().val(1) > this.Canvas.getBottom()){
      this.start_point = this.start_point.add(0, -this.start_point.val(1) + this.Canvas.getBottom() - this.height/2);
    }
    if(this.getCenter().val(0) < this.Canvas.getLeft()){
      this.start_point = this.start_point.add(-this.start_point.val(0) + this.Canvas.getLeft() - this.width/2, 0);
    }
    if(this.getCenter().val(1) < this.Canvas.getTop()){
      this.start_point = this.start_point.add(0, -this.start_point.val(1) + this.Canvas.getTop() - this.height/2);
    }
  }

  formatNumber(num){
    return number_format(num / nm_in_meter, 0, ".", ",");
  }

  draw(){
    if(this.is_on){
      this.Canvas.drawRect(this.start_point, this.height, this.height, false, this.color);
      this.Canvas.setBaseline("top");
      this.Canvas.write(this.formatNumber(this.distance), this.start_point.add(this.height/2 - this.Canvas.measureText(this.formatNumber(this.distance))/2, this.height));
    }
  }
}
