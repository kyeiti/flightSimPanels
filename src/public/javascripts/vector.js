
class Vector {
  constructor(){
    if(Array.isArray(arguments[0])){
      this.values = arguments[0];
    }
    else {
      this.values = Array.prototype.slice.call(arguments);
    }
  }

  val(i){
    return this.values[i];
  }

  clone(){
    return new Vector(this.values.slice(0));
  }

  dim(){
    return this.values.length;
  }

  __getNewVector(args){
    if(args.length == 1 && args[0] instanceof Vector){
      return args[0].clone();
    }
    else
    return new Vector(Array.prototype.slice.call(args));
  }

  __mulSkalar(a){
    var res = this.clone();
    for(var i = 0; i < res.dim(); i++){
      res.values[i] = res.values[i] * a;
    }
    return res;
  }

  __mulVector(x){
    var sum = 0;
    if(x.dim() == this.dim()){
      for(var i = 0; i < x.dim(); i++){
        sum += x.values[i] * this.values[i];
      }
      return sum;
    }
    else {
      console.error("Vector-Dimensions not the same!", this, x);
      return null;
    }
  }

  mul(){
    if(arguments.length == 1 && typeof(arguments[0]) == "number"){
      return this.__mulSkalar(arguments[0]);
    }
    else{
      var res = this.__getNewVector(arguments);
      return this.__mulVector(res);
    }
  }

  add(){
    var res = this.__getNewVector(arguments);
    if(res.dim() == this.dim()) {
      for(var i = 0; i < this.dim(); i++){
        res.values[i] = this.values[i] + res.values[i];
      }
      return res;
    }
    else {
      console.error("Vector-Dimensions not the same!", this.values, res.values);
      return null;
    }
  }

  rotate(angle){
    angle = angle * Math.PI / 180
    return new Vector(this.val(0) * Math.cos(angle) - this.val(1) * Math.sin(angle),
    this.val(0) * Math.sin(angle) + this.val(1) * Math.cos(angle));
  }

  sub(){
    var res = this.__getNewVector(arguments);
    res = res.mul(-1);
    return this.add(res);
  }

  norm(){
    return Math.sqrt(this.mul(this));
  }

  isSameDirection(vector){
    return this.norm() < this.add(vector).norm();
  }
}


class Plane {
  //defines an aircraft
  // Remember to write getter and setter for new attributes
  // Also remember to use them to update the planes in app.js
  constructor(position){
    this.position = position;
    this.target = false;
    this.heading = 0;
    this.speed = new Vector(0, 0);
    this.bearing = 0;
  }

  setBearing(val){
    this.bearing = val;
  }

  getBearing(){
    return this.bearing;
  }

  setTarget(target){
    this.target = target;
  }

  isTarget(){
    return this.target;
  }

  setSpeed(spd){
    this.speed = spd;
  }

  getSpeed(){
    return this.speed;
  }

  getSpeedValue(){
    return this.speed.norm();
  }

  setHeading(hdg){
    this.heading = hdg;
  }

  getHeading(hdg){
    return this.heading;
  }

  getPosition(){
    return this.position;
  }

  getLat(){
    return this.position.val(0);
  }

  getLon(){
    return this.position.val(1);
  }

  getAltitude(){
    return this.position.val(2);
  }


  updatePosition(pos){
    this.position = pos;
  }
}
