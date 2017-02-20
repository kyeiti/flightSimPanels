
class SMS_Canvas extends Canvas {
    constructor(id, color, bg_color){
      super(id, color, bg_color);
      this.objects = {
          station5: new Station(this, this.color, this.bg_color, 150, 2*font_size, 100, 3, "left"),
          swap: new Text_Object(this, this.color, 50, this.height-font_size, this.measureText("SWAP")),
          sms: new Text_Object(this, this.bg_color, 100, this.height-font_size, this.measureText("SMS")),
          dte: new Text_Object(this, this.color, this.width-100-this.measureText("CLR"), this.height-font_size, this.measureText("DTE")),
          s_j: new Text_Object(this, this.color, this.width-50-this.measureText("CLR"), this.height-font_size, this.measureText("S-J")),
          stby: new Text_Object(this, this.color, 50, 0, this.measureText("STBY")),
          clr: new Text_Object(this, this.color, this.width-50-this.measureText("CLR"), 0, this.measureText("CLR")),
          info: new InfoBox(this, this.color, this.width/2-this.measureText("OIL TMP: 10000°")/2, 12*font_size, this.measureText("OIL TMP: 10000°"))
      };
      this.objects.swap.setValue("SWAP");
      this.objects.sms.setValue("SMS");
      this.objects.dte.setValue("DTE");
      this.objects.s_j.setValue("S-J");
      this.objects.stby.setValue("STBY");
      this.objects.clr.setValue("CLR");
      this.objects.station4 = new Station(this, this.color, this.bg_color, 50, this.objects.station5.getBottom() + font_size, 100, 3, "right");
      this.objects.station6 = new Station(this, this.color, this.bg_color, this.width-150, this.objects.station5.getBottom() + font_size, 100, 3, "left");
      this.objects.station3 = new Station(this, this.color, this.bg_color, 0, this.objects.station4.getBottom() + font_size, 100, 3, "right");
      this.objects.station7 = new Station(this, this.color, this.bg_color, this.width-100, this.objects.station6.getBottom() + font_size, 100, 3, "left");
      this.objects.station2 = new Station(this, this.color, this.bg_color, 0, this.objects.station3.getBottom() + font_size, 100, 2, "right");
      this.objects.station8 = new Station(this, this.color, this.bg_color, this.width-100, this.objects.station7.getBottom() + font_size, 100, 2, "left");
      this.objects.station1 = new Station(this, this.color, this.bg_color, 0, this.objects.station2.getBottom() + font_size, 100, 2, "right");
      this.objects.station9 = new Station(this, this.color, this.bg_color, this.width-100, this.objects.station8.getBottom() + font_size, 100, 2, "left");
      this.objects.station_gun = new Station(this, this.color, this.bg_color, 0, 3 * font_size, 100, 2, "left");
      this.objects.station_gun.setType(1, "PGU28");
    }

    updateOilTmp(tmp){
      this.objects.info.updateOilTmp(tmp);
    }

    updateNozzle(nozzle){
      this.objects.info.updateNozzle(nozzle);
    }

    updateRPM(rpm){
      this.objects.info.updateRPM(rpm);
    }

    updateFTIT(val){
      this.objects.info.updateFTIT(val);
    }

    updateFF(val){
      this.objects.info.updateFF(val);
    }

    updateFOB(rpm){
      this.objects.info.updateFOB(rpm);
    }

    updateStation(i, type, stat){
      var station = this.objects["station" + i];
      if(stat == 0){
        station.setType(0, type);
      }
      else{
        station.destroy(0);
      }
    }

    selectStationsByType(type){
      for(var i = 1; i < 10; i++){
        if(this.objects["station" + i].getType(0) == type){
          this.objects["station" + i].setSelected(true);
        }
        else {
          this.objects["station" + i].setSelected(false);
        }
      }
    }

    updateGunAmmo(ammo){
      this.objects.station_gun.setType(0, ammo + "GUN");
    }

    draw () {
      super.draw();
      this.drawRect(this.objects.sms.getStartPoint(), this.objects.sms.getWidth(), this.objects.sms.getHeight(), true, this.color, this.color);
      for(var key in this.objects){
        if(this.objects.hasOwnProperty(key)){
          this.objects[key].draw();
        }
      }
    }
}

class Station extends Canvas_Object{
  constructor(Canvas, color, bg_color, x, y, width, lines, align = "left"){
    super(Canvas, color, x, y, 0, width, lines * font_size);
    this.bg_color = bg_color;
    this.lines = [];
    for(var i = 0; i < lines; i++){
      this.lines[i] = "";
    }
    this.align = align;
    this.selected = false;
  }

  destroy(i){
    this.lines[i] = "";
  }

  setType(i, type){
    this.lines[i] = type;
  }

  getType(i){
    return this.lines[i];
  }

  setSelected(sel){
    this.selected = sel;
  }

  draw(){
    var color = this.color;
    this.Canvas.setBaseline("top");
    if(this.selected){
      color = this.bg_color;
      this.Canvas.drawRect(this.start_point.sub(5, 5), this.width + 2*5, this.height + 2*5, true, this.color, this.color);
    }
    for(var i = 0; i < this.lines.length; i++){
      var text = this.lines[i];
      if(typeof(weapon_types[this.lines[i]]) != "undefined"){
        text = "1 " + weapon_types[this.lines[i]];
      }
      if(this.lines[i] == "" || weapon_types[this.lines[i]] == ""){
        text = "----------";
      }
      var point = this.start_point.add(0, i*font_size);
      if(this.align == "right"){
        point = point.add(this.width - this.Canvas.measureText(text), 0);
      }
      else if(this.align == "center"){
        point = point.add((this.width - this.Canvas.measureText(text))/2, 0);
      }
      this.Canvas.write(text, point, color);
    }
  }
}

class Small_Station extends Station {
  constructor(Canvas, color, bg_color, x, y){
    super(Canvas, color, bg_color, x, y, 150, 2);
  }
}

class InfoBox extends Canvas_Object {
  constructor(Canvas, color, x, y, width){
    super(Canvas, color, x, y, 0, width, 6 * font_size);
    this.lines = ["OIL TMP", "NOZZLE", "N1", "FTIT", "FF", "FOB"];
    this.values = ["0", "-- %", "", "", "", ""];
  }

  numberFormat(val){
    return number_format(val, 0);
  }

  updateOilTmp(tmp){
    this.values[0] = this.numberFormat(tmp * 1.8 + 32) + "°F";
  }

  updateNozzle(nozzle){
    this.values[1] = this.numberFormat(nozzle) + "  ";
  }

  updateRPM(rpm){
    this.values[2] = this.numberFormat(rpm) + " %";
  }

  updateFTIT(val){
    this.values[3] = this.numberFormat(val * 1.8 + 32) + "°F";
  }

  updateFF(val){
    this.values[4] = this.numberFormat(val * 3600 * kg_in_lbs) + "  ";
  }

  updateFOB(val){
    this.values[5] = this.numberFormat(val) + "  ";
  }


  draw(){
    for(var i = 0; i < this.lines.length; i++){
      var text = this.lines[i] + ": ";
      var val = this.values[i];
      var point = this.start_point.add(0, i*font_size);
      var point2 = point.add(this.width/2 - this.Canvas.measureText(text), 0);
      point = point.add(this.width - this.Canvas.measureText(val), 0);
      this.Canvas.write(text, point2, this.color);
      this.Canvas.write(val, point, this.color);
    }
  }
}
