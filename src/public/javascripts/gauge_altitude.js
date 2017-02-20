class Altitude_Canvas extends Canvas {
  constructor(id, color, bg_color){
    super(id, color, bg_color);
    this.objects = {
      alt: new Alt(this, this.color, 35,this.height/2, this.measureText("99999")),
      altitude: new Circle_Meter(this, this.color, 0, 0, this.width, this.height, 0, 1000, 25)
    };
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
  }
}


class Alt extends Number_Object {
  numberFormat(val){
    return pad(Math.round(val / 100) * 100, 5);
  }

  draw(){
    super.draw();
    this.Canvas.setLineWidth(2);
    this.Canvas.drawRect(this.start_point.sub(0, font_size/2), this.width, this.height);
    this.Canvas.setLineWidth(1);
  }
}
