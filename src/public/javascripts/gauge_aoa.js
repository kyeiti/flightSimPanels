
class AOA_Canvas extends Canvas {
  constructor(id, color, text_color, bg_color){
    super(id, color, bg_color);
    this.objects = {
      aoa: new AOA_Band(this, text_color, text_color, this.color, this.color, 1, 20, -7, 32, 2),
      aoa_text: new Down_Text(this, this.color, 0, 15, 15, ["A", "O", "A"]),
      deg_text: new Down_Text(this, this.color, 0, 150, 10, ["d", "e", "g"])
    };
  }

  draw(){
    super.draw();
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.objects[key].draw();
      }
    }
  }

  updateAOA(val){
    this.objects.aoa.setValue(val);
  }
}


class AOA_Band extends Band {
  draw(){
    super.draw();
    this.Canvas.drawRect(this.getNumberMark(17).add(this.width - 5, 0), 5, this.line_distance/this.line_value * 2, true, "red", "red");
    this.Canvas.drawRect(this.getNumberMark(15).add(this.width - 5, 0), 5, this.line_distance/this.line_value * 4, true, "green", "green");
    this.Canvas.drawRect(this.getNumberMark(11).add(this.width - 5, 0), 5, this.line_distance/this.line_value * 2, true, "darkyellow", "yellow");
  }

  numberFormat(val){
    return val;
  }
}

class AOA_Text extends Canvas_Object {
  constructor (Canvas, color, x, y, rotation){
      super (Canvas, color, x, y, 0, Canvas.measureText("A"), font_size * 3);
  }

  draw(){
    this.Canvas.setBaseline("top");
    this.Canvas.write("A", this.start_point);
    this.Canvas.write("O", this.start_point.add(0, font_size));
    this.Canvas.write("A", this.start_point.add(0, font_size*2));
  }
}


class Down_Text extends Canvas_Object {
  constructor (Canvas, color, x, y, font_size, letters){
      super (Canvas, color, x, y, 0, Canvas.measureText("A"), letters.length * 3);
      this.letters = letters;
      this.font_size = font_size;
  }

  draw(){
    var save_size = this.Canvas.getFontSize();
    this.Canvas.setFontSize(this.font_size);
    this.Canvas.setBaseline("top");
    for(var i = 0; i < this.letters.length; i++){
      this.Canvas.write(this.letters[i], this.start_point.add(0, this.font_size * i));
    }
    this.Canvas.setFontSize(save_size);
  }
}
