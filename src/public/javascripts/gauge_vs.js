
class Vertical_Speed_Canvas extends Canvas {
  constructor(id, color, band_color, bg_color){
    super(id, color, bg_color);
    this.objects = {
      vs_band: new Band(this, band_color, this.color, this.color, band_color, 500, 20, -6000, 6000, 1000),
      aoa_text: new Down_Text(this, this.color, 0, 15, 15, ["V", "V", "I"]),
      deg_text: new Down_Text(this, this.color, 0, 120, 10, ["1", "0", "0", "0", "F", "P", "M"])
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

  updateVS(val){
    this.objects.vs_band.setValue(val);
  }
}
