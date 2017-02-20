font_size = 18;
font = "Arial";
// "longest" speed number which might appear
var max_speed = 100;

// length of the pointer of the arrow
var arrow_length = 10;
var padding = 2;

var target_color = "yellow";
var plane_color = "white";

class Radar_Canvas extends Canvas {
  constructor(id, color, bg_color){
    super(id, color, bg_color);
    // This is the Array of the Planes on the Radar (Objects of Type Radar_Plane)
    this.planes = [];
    this.own_plane = new Plane(new Vector(1,1,1));
    this.objects = {
      antenna_scale: new Antenna_Scale(this, this.color, 20),
      antenna_azimuth: new Antenna_Azimuth(this, this.color, 20),
      range_caret: new Range_Caret(this, this.color, 20),
      target_aspect: new Target_Aspect(this, this.color, 100, 20, 0, 0),
      target_heading: new Target_Heading(this, this.color, 200, 20, 0, 0),
      target_ground_speed: new Target_Ground_Speed(this, this.color, 300, 20, 0, 0),
      closure_speed: new Closure_Speed(this, this.color, 400, 20, 0, 0),
      range: new Number_Object(this, this.color, 30, 100, this.measureText(40), 0),
      roll: new Roll(this, this.color, 30, 120),
      x_lines: new Lines(this, this.color, this.getWidth()/radar_angle * 30, this.getWidth()/radar_angle * 60, new Vector(1, 0), new Vector(0, this.getHeight())),
      y_lines: new Lines(this, this.color, this.getHeight()/radar_range * (radar_range/4), this.getHeight()/radar_range * (radar_range/4), new Vector(0, 1), new Vector(this.getWidth(), 0))
    };
    this.compass = 0;
    this.objects.range.setValue(radar_range);
  }

  updatePlanes(planes){
    for(var i = 0; i < planes.length; i++){
      if(!(this.planes[i] instanceof Radar_Plane))
        this.planes[i] = new Radar_Plane(this, this.color, planes[i], 5);
      else
        this.planes[i].updatePlane(planes[i]);
    }
  }

  updateRoll(roll){
    this.objects.roll.setValue(roll);
  }


  updateTarget(){
    for(var i = 0; i < this.planes.length; i++){
      if(this.planes[i].isTarget()){
        this.planes[i].updatePosition(this.own_plane, this.compass);
      }
    }
  }

  refreshPlanes(){
    for(var i = 0; i < this.planes.length; i++){
      this.planes[i].updatePosition(this.own_plane, this.compass);
      this.applyOffset(this.planes[i]);
    }
  }

  updateTargetHeading(val){
    this.objects.target_heading.setValue(val);
  }

  updateTargetAspect(val){
    this.objects.target_aspect.setValue(val);
  }

  updateTargetGroundSpeed(val){
    this.objects.target_ground_speed.setValue(val);
  }

  updateTargetDistance(dis){
    this.objects.range_caret.updateDistance(dis);
  }

  updateClosureSpeed(speed){
    this.objects.range_caret.setSpeed(speed);
    this.objects.closure_speed.setValue(speed);
  }

  updateCompass(compass){
    this.compass = (compass);
  }

  getCompass(compass){
    return this.compass;
  }

  updateOwnPlane(plane){
    this.own_plane = plane;
  }

  // Sets transparency (0 = fully transparent, 1 = no transparency)
  setAlpha(alpha){
    this.context.globalAlpha = alpha;
  }

  draw () {
    this.objects.range.setValue(radar_range);
    super.draw();
    this.updateTarget();
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.objects[key].draw();
      }
    }
    this.context.translate(this.getWidth()/2, this.getHeight());
    for(var i = 0; i < this.planes.length; i++){
      this.planes[i].draw();
    }
    this.context.translate(-this.getWidth()/2, -this.getHeight()/2);
  }
}

class Lines extends Canvas_Object {
  constructor(Canvas, color, start, frequency, direction_vector, line_length_vector){
    super(Canvas, color, 0, 0, 0, Canvas.getWidth(), Canvas.getHeight());
    this.start = start;
    this.frequency = frequency;
    this.direction_vector = direction_vector;
    this.line_length_vector = line_length_vector;
  }

  draw(){
    for(var i = this.start; i < this.width; i = i + this.frequency){
      this.Canvas.drawLine(this.direction_vector.mul(i), this.direction_vector.mul(i).add(this.line_length_vector));
    }
  }
}

class Roll extends Canvas_Object {
  constructor(Canvas, color, center_distance, line_length){
    super(Canvas, color, 0, 0, 0, Canvas.getWidth(), Canvas.getHeight());
    this.value = 0;
    this.center_distance = center_distance;
    this.line_length = line_length;
  }

  setValue(val){
    this.value = val;
  }

  draw() {
      this.Canvas.rotateAround(this.value, this.getCenter());
      this.Canvas.setLineWidth(4);
      this.Canvas.drawLine(this.getCenter().sub(this.center_distance, 0), this.getCenter().sub(this.line_length, 0));
      this.Canvas.drawLine(this.getCenter().sub(this.line_length, 0), this.getCenter().sub(this.line_length, -10));
      this.Canvas.drawLine(this.getCenter().add(this.center_distance, 0), this.getCenter().add(this.line_length, 0));
      this.Canvas.drawLine(this.getCenter().add(this.line_length, 0), this.getCenter().add(this.line_length, 10));
      this.Canvas.setLineWidth(1);
      this.Canvas.rotateAround(-this.value, this.getCenter());
  }
}

// Just some Deko-Lines
class Antenna_Scale extends Canvas_Object {
  constructor(Canvas, color, height){
    super(Canvas, color, 0, Canvas.getHeight() - height, 0, Canvas.getWidth(), height);
  }

  draw(){
    var lines = radar_angle / 20;
    this.Canvas.drawLine(this.start_point.add(this.width/2, 0), this.start_point.add(this.width/2, this.height));
    for(var i = 0; i < lines; i++){
      this.Canvas.drawLine(this.start_point.add(this.width / lines * i, this.height/2), this.start_point.add(this.width / lines * i, this.height));
    }
  }
}

// Just some Deko-Lines
class Antenna_Azimuth extends Canvas_Object {
  constructor(Canvas, color, width){
    super(Canvas, color, 0, 0, 0, width, Canvas.getHeight());
  }

  draw(){
    var lines = radar_range / 5;
    this.Canvas.drawLine(this.start_point.add(0, this.height/2), this.start_point.add(this.width, this.height/2));
    for(var i = 0; i < lines; i++){
      this.Canvas.drawLine(this.start_point.add(this.width/2, this.height  / lines * i), this.start_point.add(0, this.height / lines * i));
    }
  }
}

class Range_Caret extends Canvas_Object {
  constructor(Canvas, color, width){
    super(Canvas, color, Canvas.getWidth() - width, 0, 0, width, Canvas.getHeight());
    this.range = 0;
    this.speed = 0;
  }

  updateDistance(val){
    if(val > radar_range){
      this.range = 0;
    }
    else if(val < 0){
      this.range = radar_range;
    }
    else {
      this.range = radar_range - val;
    }
  }

  setSpeed(val){
    this.speed = val;
  }

  draw(){
    var rel_point = this.start_point.add(10, this.height  * this.range / radar_range);
    this.Canvas.drawPolygon([rel_point, rel_point.add(-10, 5), rel_point.add(-10, - 5)]);
    this.Canvas.write(this.formatNumber(this.speed), rel_point.sub(this.Canvas.measureText(this.formatNumber(this.speed) + this.width + 5), font_size/2));
  }


  formatNumber(val){
    var sym = "";
    if(val >= 0){
      sym = "+";
    }
    return sym + number_format(val, 0);
  }
}

class Target_Aspect extends Text_Object {
  setValue(val){
    if(val != ""){
      if(val > 180){
        val = val - 360;
      }
      if(val < -180){
        val += 360;
      }
      var direction = "";
      if(val < 0){
        direction = "L";
      }
      else if(val > 0){
        direction = "R"
      }
      val = number_format(Math.abs(val)/10, 0) + direction;
    }
    this.value = val;
  }
}

class Target_Heading extends Text_Object {
  setValue(val){
    if(val != ""){
      val = number_format(val, 0) + "°";
    }
    this.value = val;
    }
}

class Target_Ground_Speed extends Text_Object {
  setValue(val){
    if(val != ""){
      val = number_format(val, 0);
    }
    this.value = val;
  }
}

class Closure_Speed extends Text_Object {
  setValue(val){
    if(val != ""){
    var sym = "";
    if(val >= 0){
      sym = "+";
    }
    val = sym + number_format(val, 0) + "K";
  }
  this.value = val;
  }
}

class Radar_Plane extends Canvas_Object {
  constructor(Canvas, color, plane, size){
    var x = plane.getPosition().val(0);
    var y = plane.getPosition().val(1);
    super(Canvas, color, x, y, 0, size, size);
    // Plane-Object, which is referenced by this Radar_Plane
    this.plane = plane;
    // Array of previous Positions to create Radar Trails
    this.positions = [[this.start_point, plane.getHeading(), 0]];
    this.is_on_radar = false;
  }

  updatePlane(plane){
    this.plane = plane;
  }

  updatePosition(own_plane, compass){
    var distance_ground = ground_range(own_plane.getLat(), own_plane.getLon(), this.plane.getLat(), this.plane.getLon()) / nm_in_meter;
    var rel_bearing = this.plane.getBearing();
    var other_rel_bearing = rel_bearing + compass - 180 - this.plane.getHeading();
    //    var other_rel_bearing = other_bearing - this.plane.getHeading();
    //    var rel_bearing = own_bearing - compass;
    if(other_rel_bearing < -180){
      other_rel_bearing += 360;
    }
    else if(other_rel_bearing > 180){
      other_rel_bearing -= 360;
    }
    if(rel_bearing < -180)
      rel_bearing += 360;
    else if(rel_bearing > 180)
      rel_bearing -= 360;
    if(Math.abs(rel_bearing) <= radar_angle/2 && distance_ground <= radar_range){
      this.is_on_radar = true;
    }
    else {
      this.is_on_radar = false;
    }
    var trg_speed = this.plane.getSpeed();
    var own_speed = own_plane.getSpeed();
    var closure_speed = own_speed.norm() * Math.cos(rel_bearing * Math.PI/180)
        + trg_speed.norm() * Math.cos(other_rel_bearing * Math.PI/180);;
    closure_speed *= meter_s_in_kts;
    if(this.plane.getSpeedValue() < radar_min_speed){
      this.start_point = new Vector(-10000000, -1000000);
      this.is_on_radar = false;
    }
    else {
      this.start_point = new Vector(rel_bearing * this.Canvas.getWidth()/radar_angle, -distance_ground * this.Canvas.getHeight()/radar_range);
    }
    this.positions.splice(0, 0, [this.start_point, this.plane.getHeading(), closure_speed]);
    this.positions = this.positions.slice(0, radar_no_trails);
    if(this.isTarget()){
      if(this.isOnRadar()){
        this.Canvas.updateClosureSpeed(closure_speed);
        this.Canvas.updateTargetDistance(distance_ground);
        this.Canvas.updateTargetHeading(this.plane.getHeading());
        this.Canvas.updateTargetAspect( this.plane.getHeading() - own_plane.getHeading());
        this.Canvas.updateTargetGroundSpeed(this.plane.getSpeedValue() * meter_s_in_kts);
      }
      else{
        this.Canvas.updateClosureSpeed("");
        this.Canvas.updateTargetDistance("");
        this.Canvas.updateTargetHeading("");
        this.Canvas.updateTargetAspect("");
        this.Canvas.updateTargetGroundSpeed("");
      }
    }
    /*
    this.start_point = new Vector(0, distance_ground); // Vector is pointing up with the distance of the plane.
    this.start_point = this.start_point.rotate(+ bearing - compass); // Now rotate the Vector, so direction is also correct.
    */
  }

  isOnRadar(){
    return this.is_on_radar;
  }

  draw(){
    if(!this.isTarget()){
      for(var i = 0; i < this.positions.length; i++){
        this.Canvas.setAlpha((radar_no_trails-i)/radar_no_trails);
        this.Canvas.drawRect(this.positions[i][0], this.height, this.width, true, plane_color, plane_color);
      }
      this.Canvas.setAlpha(1);
      this.Canvas.drawLine(this.getCenter(), this.getCenter().add(0, this.width/2 + this.positions[0][2]/radar_closure_kts_to_px), plane_color);
    }
    else{
      this.Canvas.rotateAround(this.plane.getHeading() - this.Canvas.getCompass(), this.getCenter().val(0), this.getCenter().val(1));
      this.Canvas.drawRect(this.start_point, this.height, this.width, false, target_color);
      this.Canvas.drawLine(this.getCenter().add(0, -this.width/2), this.getCenter().add(0, -this.width * 2), target_color);
      this.Canvas.rotateAround(-(this.plane.getHeading() - this.Canvas.getCompass()), this.getCenter().val(0), this.getCenter().val(1));
      this.Canvas.circle(this.getCenter(), this.width, false, target_color);
      this.Canvas.setBaseline("top");
      var altitude = this.formatNumber(this.plane.getAltitude() * meter_in_feet);
      this.Canvas.write(altitude, this.start_point.add(this.width/2 - this.Canvas.measureText(altitude)/2, this.height * 2), target_color);
    }
  }

  isTarget(){
    return this.plane.isTarget();
  }

  formatNumber(num){
    return number_format(num, -3, "", ",");
  }
}
