
class Speed_Canvas extends Canvas {
  constructor(id, color, bg_color){
    super(id, color, bg_color);
    this.objects = {
      speed_mach: new Speed_Mach(this, this.color, 0, 0, this.width, this.height, 0, 850, 10)
    };
  }

  updateSpeed(val){
    this.objects.speed_mach.setSpeed(val);
  }


  updateMach(val){
    this.objects.speed_mach.setMach(val);
  }

  draw(){
    super.draw();
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.objects[key].draw();
      }
    }
  }
}



class Mach_Meter extends Circle_Meter {
  constructor(Canvas, color, x, y, width, height, min_value, max_value, line_value) {
    super(Canvas, color, x, y, width, height, min_value, max_value, line_value);
    this.speed_degree = 0;
    this.value = min_value;
  }

  formatNumber(val){
    return val;
  }

  setSpeedDegree(deg){
    this.speed_degree = deg;
  }

  setValue(val){
    if(val >= 2.2){
      val = 2.2;
    }
    else if(val < 0.5){
      val = 0.5;
    }
    this.value = val;
  }

  drawIndicator(){};

  drawLine(number, degrees){
    number = Math.round(number * 100)/100;
    if(number <= 2.2 && number >= 0.5){
      this.Canvas.rotateAround(degrees, this.getCenter());
      if(number * 10 % 1 == 0){
        if(number * 10 % 5 == 0){
          this.Canvas.setLineWidth(2);
        }
        this.Canvas.drawLine(
          this.start_point.add(this.width/2, 15),
          this.start_point.add(this.width/2, 0),
          this.color
        );
        this.Canvas.setLineWidth(1);
        var text = this.formatNumber(number);
        var text_size = this.Canvas.measureText(text);
        this.Canvas.rotateAround(90, this.start_point.add(this.width/2, 18 + this.Canvas.getFontSize()/2));
        this.Canvas.write(text, this.start_point.add(this.width/2 - text_size/2, 18));
        this.Canvas.rotateAround(-90, this.start_point.add(this.width/2, 18 + this.Canvas.getFontSize()/2));
      }
      else {
        if(number < 400){
          this.Canvas.drawLine(this.start_point.add(this.width/2, 0), this.start_point.add(this.width/2, 10));
        }
      }
      this.Canvas.rotateAround(-degrees, this.getCenter());
    }
  }

  formatNumber(val){
    return number_format(val, 1, ".", ",");
  }

  draw(){
    this.Canvas.setFontSize(10);
    var degrees = 360 / ((this.max_value - this.min_value) / this.line_value);
    degrees *= (this.value -this.min_value) / this.line_value
    this.Canvas.rotateAround((this.speed_degree - degrees), this.getCenter());
    super.draw();
    this.Canvas.rotateAround(-(this.speed_degree - degrees), this.getCenter());
    this.Canvas.setFontSize(font_size);
  }
}

class Speed_Meter extends Circle_Meter {
  constructor(Canvas, color, x, y, width, height, min_value, max_value, line_value) {
    super(Canvas, color, x, y, width, height, min_value, max_value, line_value);
    this.mapping = [
      {start: 0, end: 80, degrees: 15},
      {start: 80, end: 100, degrees: 15},
      {start: 100, end: 150, degrees: 60},
      {start: 150, end: 200, degrees: 45},
      {start: 200, end: 250, degrees: 30},
      {start: 250, end: 300, degrees: 25},
      {start: 300, end: 350, degrees: 25},
      {start: 350, end: 400, degrees: 20},
      {start: 400, end: 450, degrees: 15},
      {start: 450, end: 500, degrees: 15},
      {start: 500, end: 600, degrees: 30},
      {start: 600, end: 700, degrees: 25},
      {start: 700, end: 800, degrees: 20},
      {start: 800, end: 850, degrees: 10}
    ];
    for(var i = 0; i < this.mapping.length; i++){
      this.mapping[i].n_lines = (this.mapping[i].end - this.mapping[i].start) / this.line_value;
      this.mapping[i].lines_degree = this.mapping[i].degrees / this.mapping[i].n_lines;
    }
  }

  setValue(val){
    if(val > 850)
      val = 850;
    this.value = val;
  }

  valueToDegrees(value = this.value){
    var ret = 0;
    var i = 0;
    while(value > this.mapping[i].end){
      ret += this.mapping[i].degrees;
      i++;
    }
    var in_lines = (value - this.mapping[i].start) / this.line_value;
    ret += this.mapping[i].lines_degree * in_lines;
    return ret;
  }

  draw(){
    this.Canvas.setBaseline("top");
    var cur_degrees = 0;
    var j = 0;
    for(var i = this.min_value; i < this.max_value; i = i + this.line_value){
      if(i >= this.mapping[j].end){
        j++;
      }
      this.drawLine(i, cur_degrees);
      cur_degrees += this.mapping[j].lines_degree;
    }
    this.drawIndicator(this.value, this.valueToDegrees());
    this.Canvas.rotateAround(this.valueToDegrees(800), this.getCenter());
    this.Canvas.setLineWidth(3);
    this.Canvas.drawLine(this.width/2, 0, this.width/2, 10, "red");
    this.Canvas.drawLine(this.width/2, 20, this.width/2, 30, "red");
    this.Canvas.drawLine(this.width/2, 40, this.width/2, 50, "red");
    this.Canvas.setLineWidth(1);
    this.Canvas.rotateAround(-this.valueToDegrees(800), this.getCenter());
  }

  clipforMach(){
    this.Canvas.rotateAround(this.valueToDegrees(), this.getCenter());
    var ctx = this.Canvas.getContext();
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.width/2, this.height/2, this.width/2 - 40, -120 * Math.PI / 180, -60 * Math.PI / 180);
    ctx.arc(this.width/2, this.height/2, this.width/2 - 80, -60 * Math.PI / 180,  -120 * Math.PI / 180, 1);
    ctx.closePath();
    ctx.clip();
    this.Canvas.rotateAround(-this.valueToDegrees(), this.getCenter());
  }

  unclip(){
    var ctx = this.Canvas.getContext();
    ctx.restore();
  }

  drawIndicator(value, degrees){
    this.Canvas.rotateAround(degrees, this.getCenter());
    this.Canvas.circle(this.getCenter(), this.width/2 - 35, true, instrument_border_color,  "black");
    var ctx = this.Canvas.getContext();
    ctx.strokeStyle = instrument_border_color;
    ctx.beginPath();
    ctx.arc(this.width/2, this.height/2, this.width/2 - 40, -120 * Math.PI / 180, -60 * Math.PI / 180);
    ctx.arc(this.width/2, this.height/2, this.width/2 - 80, -60 * Math.PI / 180,  -120 * Math.PI / 180, 1);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = this.color;
    this.Canvas.drawPolygon([
      new Vector(this.width/2,     5),
      new Vector(this.width/2 - 3, 11),
      new Vector(this.width/2 - 3, 34),
      new Vector(this.width/2,     45),
      new Vector(this.width/2 + 3, 34),
      new Vector(this.width/2 + 3, 11),], "white", "white");

    this.Canvas.drawPolygon([
        new Vector(this.width/2 - 3, 120),
        new Vector(this.width/2 - 3, 70),
        new Vector(this.width/2,     65),
        new Vector(this.width/2 + 3, 70),
        new Vector(this.width/2 + 3, 120),], "white", "white");
    this.Canvas.setLineWidth(2);
    this.Canvas.setLineWidth(1);
    this.Canvas.rotateAround(-degrees, this.getCenter());
  }

  drawLine(number, degrees){
    if(number > this.mapping[0].end || number == 0){
      this.Canvas.rotateAround(degrees, this.getCenter());
      if(number % 100 == 0){
        this.Canvas.setLineWidth(1);
        this.Canvas.drawPolygon([
          new Vector(this.width/2 - 2, 0),
          new Vector(this.width/2,     8),
          new Vector(this.width/2 + 2, 0)],
          this.color, this.color);
          this.Canvas.setLineWidth(1);
          var text = this.formatNumber(number);
          var text_size = this.Canvas.measureText(text);
          this.Canvas.rotateAround(-degrees, this.width/2, 10 + font_size/2);
          this.Canvas.write(text, this.width/2 - text_size/2, 10);
          this.Canvas.rotateAround(degrees, this.width/2, 10 + font_size/2);
        }
        else if(number % 50 == 0){
          this.Canvas.setLineWidth(2);
          this.Canvas.drawLine(this.width/2, 0, this.width/2, 8);
          this.Canvas.setLineWidth(1);
        }
        else {
          if(number < 400){
            this.Canvas.drawLine(this.width/2, 0, this.width/2, 5);
          }
        }
        this.Canvas.rotateAround(-degrees, this.getCenter());
      }
    }
}

class Speed_Mach extends Canvas_Object {
  constructor(Canvas, color, x, y, width, height) {
    super(Canvas, color, x, y, 0, width, height);
    this.speed = new Speed_Meter(Canvas, color, x, y, width, height, 0, 850, 10);
    this.mach = new Mach_Meter(Canvas, color, x+35, y+35, width-70, height-70, 0.5, 2.5, 0.025);
  }

  setSpeed(val){
    this.speed.setValue(val);
  }

  setMach(val){
    this.mach.setValue(val);
  }

  draw(){
    this.speed.draw();
    this.speed.clipforMach();
    this.mach.setSpeedDegree(this.speed.valueToDegrees());
    this.mach.draw();
    this.speed.unclip();
  }
}
