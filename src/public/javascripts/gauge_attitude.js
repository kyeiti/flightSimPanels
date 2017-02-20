var padding = 5;

class Attitude_Canvas extends Canvas {
  constructor(id, color, bg_color){
    super(id, color, bg_color);
    this.objects = {
      attitude: new Stby_Attitude(this, this.color, 0, this.width/2, 10),
      attitude_marker: new PlaneMarker(this, this.color, this.width/2 - 40, this.height/2 - 5, 0, 80, 10),
      roll: new Roll(this, this.color, this.width/2, 0, this.height/2 - 10)
    };
    this.objects.attitude.updateMarker(this.objects.attitude_marker.getCenter());
  }

  setRoll(val){
    this.objects.attitude.rotate(val);
    this.objects.roll.setRoll(val);
  }

  setPitch(val){
    this.objects.attitude.setPitch(val);
  }

  updateAltitude(val){
    this.objects.alt.setValue(val);
    this.objects.altitude.setValue(val);
  }

  draw(){
    super.draw();
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.objects[key].draw();
      }
    }
    this.setLineWidth(8);
    this.drawRect(0,0, this.width, this.height, false, instrument_border_color);
    this.setLineWidth(1);
  }
}


class Stby_Attitude extends Line_Object {
  constructor (Canvas, color, y, y_center, line_distance){
    super(Canvas, color, 0, y - Canvas.getHeight(), 0, Canvas.getWidth(), Canvas.getHeight()*2, 2.5, line_distance, new Vector(0, y_center), false);
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
      this.Canvas.drawLine(this.start_point.val(0) - this.width, y, this.width * 3, y);
    }
    else if( val % 10 == 0){
      this.Canvas.setBaseline("middle");
      if(val >= 90 || val <= -90){
        var valT = 90 - Math.abs((val - 90) % 90);
        this.Canvas.rotateAround(180, this.start_point.val(0) + this.width * 3/4 + this.Canvas.measureText(this.formatNumber(valT))/2, y);
        this.Canvas.write(this.formatNumber(valT), this.start_point.val(0) + this.width * 3/4 - 5, y);
        this.Canvas.rotateAround(-180, this.start_point.val(0) + this.width * 3/4 + this.Canvas.measureText(this.formatNumber(valT))/2, y);
      }
      if(val <= 90 && val >= -90){
        this.Canvas.write(this.formatNumber(val), this.start_point.val(0) + this.width/4 - this.Canvas.measureText(this.formatNumber(val)) - 5, y);
      }
      this.Canvas.drawLine(this.start_point.val(0) + this.width/4, y, this.width * 3/4, y);
    }
    else if( val % 5 == 0){
      var line_length = this.width/8;
      this.Canvas.drawLine(this.start_point.val(0) + this.width/2 - line_length, y, this.width/2 + line_length, y);
    }
    else {
      var line_length = this.width/16;
      this.Canvas.drawLine(this.start_point.val(0) + this.width/2 - line_length, y, this.width/2 + line_length, y);
    }
  }

  formatNumber(val) {
    return Math.abs(val);
  }

  getLineBottom() {
    return this.getMarker().val(0);
  }

  draw() {
    this.Canvas.rotateAround(this.rotation, this.getMarker());
    this.Canvas.drawRect(this.getZeroMark().val(0)-this.width, this.getZeroMark().val(1), this.width*3, this.height*3, true, "#f3602a", "#f3602a");
    this.Canvas.drawRect(this.getZeroMark().val(0)-this.width, this.getZeroMark().val(1)-this.height*3, this.width *3, this.height*3, true, "#0d8bc6", "#0d8bc6");
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

class PlaneMarker extends Canvas_Object {
  draw(){
    var center_space = this.width/4;
    var rect_size = this.width/8;
    var points = [
      this.start_point,
      this.start_point.add(this.width/2 - center_space+5, 0),
      this.start_point.add(this.width/2 - center_space+5, this.height),
      this.start_point.add(this.width/2 - center_space, this.height),
      this.start_point.add(this.width/2 - center_space, this.height/2),
      this.start_point.add(0, this.height/2)
    ];
    this.Canvas.drawPolygon(points, "white", "black");

      var points = [
        this.start_point.add(this.width, 0),
        this.start_point.add(this.width/2 + center_space - 5, 0),
        this.start_point.add(this.width/2 + center_space - 5, this.height),
        this.start_point.add(this.width/2 + center_space, this.height),
        this.start_point.add(this.width/2 + center_space, this.height/2),
        this.start_point.add(this.width, this.height/2)
      ];
      this.Canvas.drawPolygon(points, "white", "black");
      this.Canvas.drawRect(this.start_point.val(0) + this.width/2 - rect_size/2, this.start_point.val(1), rect_size, rect_size, true, "white", "black");
  }
}


class Roll extends Canvas_Object{
  constructor(Canvas, color, center_x, top_y, radius){
    var width = 2 * Math.PI * radius / 4;
    var height = 2 * Math.PI * radius / 8;
    super(Canvas, color, center_x - width/2, top_y, 0, width, height);
    this.radius = radius;
    this.value = 0;
  }

  getBottomCenter(){
    return this.start_point.add(this.width/2, this.radius*2);
  }

    getTopCenter(){
      return this.start_point.add(this.width/2, 0);
    }

  getCircleCenter(){
    return this.start_point.add(this.width/2, this.radius);
  }

  setRoll(val){
    this.value = val;
  }

  draw(){
    var lines = [{deg: 90, length: 10}, {deg: 60, length: 5}, {deg: 45, length: 5}, {deg: 30, length: 10}, {deg: 0, length: 10},
      {deg:10, length: 5}, {deg: 20, length:5}];
    for(var i = 0; i < lines.length; i++){
      this.Canvas.rotateAround(lines[i].deg, this.getCircleCenter());
      this.Canvas.drawLine(this.getTopCenter(), this.getTopCenter().add(0, lines[i].length));
      this.Canvas.rotateAround(-(lines[i].deg * 2), this.getCircleCenter());
      this.Canvas.drawLine(this.getTopCenter(), this.getTopCenter().add(0, lines[i].length));
      this.Canvas.rotateAround(lines[i].deg, this.getCircleCenter());
    }
    this.Canvas.rotateAround(-this.value, this.getCircleCenter());
    this.Canvas.drawPolygon([this.getTopCenter().add(0, 10), this.getTopCenter().add(5, 20), this.getTopCenter().add(-5, 20)], "white", "black");
    this.Canvas.drawPolygon([this.getBottomCenter(), this.getBottomCenter().add(5, -10), this.getBottomCenter().add(-5, -10)], "white", "black");
    this.Canvas.rotateAround(this.value, this.getCircleCenter());
  }
}
