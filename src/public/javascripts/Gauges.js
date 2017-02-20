
class Attitude extends Canvas_Object {
  constructor (Canvas, color, x, y, width, height, line_distance, compass_value, color_top, color_bg_top, color_bottom, color_bg_bottom){
    super(Canvas, color, x, y, 0, width, height);
    this.compass_value = compass_value;
    this.line_distance = line_distance;
    this.color_top = color_top;
    this.color_bg_top = color_bg_top;
    this.color_bottom = color_bottom;
    this.color_bg_bottom = color_bg_bottom;
    this.pitch = 0;
    this.roll = 0;
  }

  setRoll(val) {
    this.roll = val;
  }

  setPitch(angle) {
    this.pitch = angle;
  }

  draw() {
    var ctx = this.Canvas.getContext();
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.getCenter().val(0), this.getCenter().val(1), this.height/2, 0, 2*Math.PI);
    ctx.clip();

    // color Bottom Half
    ctx.beginPath();
    var c_x = this.getCenter().val(0);
    var c_y = this.getCenter().val(1);
    ctx.moveTo(c_x - this.width/2, c_y);
    ctx.quadraticCurveTo(
      c_x - this.width/2, c_y + this.pitch,
      c_x, c_y + this.pitch
    );
    ctx.quadraticCurveTo(
      c_x + this.width/2, c_y + this.pitch,
      c_x + this.width/2, c_y
    );
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fillStyle = this.color_bg_bottom;
    ctx.fill();

    // color Top half
    ctx.beginPath();
    var c_x = this.getCenter().val(0);
    var c_y = this.getCenter().val(1);
    ctx.moveTo(c_x - this.width/2, c_y);
    ctx.quadraticCurveTo(
      c_x - this.width/2, c_y + this.pitch,
      c_x, c_y + this.pitch
    );
    ctx.quadraticCurveTo(
      c_x + this.width/2, c_y + this.pitch,
      c_x + this.width/2, c_y
    );
    ctx.lineTo(this.width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = this.color_bg_top;
    ctx.fill();


    var n_lines = this.height/this.line_distance;
    for(var i = -n_lines; i <= n_lines; i++){
      var color = this.color_top;
      if(i > 0)
        color = this.color_bottom;
      var current_height = this.pitch + i*this.line_distance;
      this.Canvas.drawQuadraticLine(
        this.getCenter().add(-this.width/2, 0),
        this.getCenter().add(-this.width/2, current_height),
        this.getCenter().add(0, current_height),
        color
      );
      this.Canvas.drawQuadraticLine(
        this.getCenter().add(0, current_height),
        this.getCenter().add(this.width/2, current_height),
        this.getCenter().add(this.width/2, 0),
        color
      );
    }

    var n_c_lines = this.width/this.compass_value;
    for(var i = -n_c_lines; i <= n_c_lines; i++){
      var current_height = this.compass_value + i*this.line_distance;
      this.Canvas.drawQuadraticLine(
        this.getCenter().add(0, -this.width/2),
        this.getCenter().add(current_height, -this.width/2),
        this.getCenter().add(current_height, 0),
        color
      );
      this.Canvas.drawQuadraticLine(
        this.getCenter().add(current_height, 0),
        this.getCenter().add(current_height, this.width/2),
        this.getCenter().add(0, this.width/2),
        color
      );
    }
    ctx.restore();
  }
}
