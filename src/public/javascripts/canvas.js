font_size = 18;
font = "Consolas";

class Canvas {
  constructor (id, color, bg_color) {
    this.id = id;
    this.root = document.getElementById(id);
    this.context = this.root.getContext("2d");
    this.color = color;
    this.bg_color = bg_color;
    this.width = this.root.width;
    this.height = this.root.height;
    this.font = font;
    this.font_size = font_size;
    this.context.font = font_size + "px " + font;
    this.offset_x = 0;
    this.offset_y = 0;
    this.objects = {};
    this.errors = [];
  }

  setFontSize(font_size){
    this.font_size = font_size;
    this.context.font = font_size + "px " + this.font;
  }

  getFontSize(){
    return this.font_size;
  }

  resetErrors(){
    this.errors = [];
  }

  addError(error){
    this.errors.push(error);
  }

  getRoot(){
    return this.root;
  }

  updateOffsetX(offset_x){
    offset_x = offset_x - this.offset_x;
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.objects[key].moveX(offset_x);
      }
    }
    this.offset_x += offset_x;
  }

  updateOffsetY(offset_y){
    offset_y = offset_y - this.offset_y;
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.objects[key].moveY(offset_y);
      }
    }
    this.offset_y += offset_y;
  }

  applyOffset(obj){
    obj.move(new Vector(this.offset_x, this.offset_y));
  }

  __writeV(text, vector, color){
    this.__writeN(text, vector.val(0), vector.val(1), color);
  }

  __writeN (text, x, y, color){
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
    this.context.fillStyle = this.color;
  }

  write(text, x, y = this.color, color = this.color){
    if(x instanceof Vector){
      this.__writeV(text, x, y);
    }
    else {
      this.__writeN(text, x, y, color);
    }
  }

  measureText(text){
    return this.context.measureText(text).width;
  }

  setBaseline(baseline){
    this.context.textBaseline = baseline;
  }

  resetTransformation(){
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }

  rotate(degrees){
    this.context.rotate(degrees*Math.PI/180);
  }

  rotateAround(degrees, x, y){
    if(x instanceof Vector){
      y = x.val(1);
      x = x.val(0);
    }
    this.context.translate(x, y);
    this.rotate(degrees);
    this.context.translate(-x, -y);
  }

  drawQuadraticLine(start_point, middle_point, end_point, color = this.color){
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.moveTo(start_point.val(0), start_point.val(1));
    this.context.quadraticCurveTo(middle_point.val(0), middle_point.val(1), end_point.val(0), end_point.val(1));
    this.context.stroke();
    this.context.strokeStyle = this.color;
  }

  drawLine(start_x, start_y, end_x = this.color, end_y = this.color, color = this.color){
    if(start_y instanceof Vector){
      color = end_x;
      end_y = start_y.val(1);
      end_x = start_y.val(0);
    }
    else if(end_x instanceof Vector){
      color = end_y;
      end_y = end_x.val(1);
      end_x = end_x.val(0);
    }
    if(start_x instanceof Vector){
      start_y = start_x.val(1);
      start_x = start_x.val(0);
    }
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.moveTo(start_x, start_y);
    this.context.lineTo(end_x, end_y);
    this.context.stroke();
    this.context.strokeStyle = this.color;
  }

  circle(point, radius, fill=false, color = this.color, bg_color = this.color){
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.arc(point.val(0), point.val(1), radius, 0, 2*Math.PI);
    this.context.stroke();
    if(fill){
      this.context.fillStyle = bg_color;
      this.context.fill();
      this.context.fillStyle = this.color;
    }
    this.context.strokeStyle = this.color;
  }

  circlePart(point, radius, degree1, degree2){
    this.context.beginPath();
    this.context.arc(point.val(0), point.val(1), radius, degree1 * Math.PI / 180, degree2 * Math.PI / 180);
    this.context.stroke();
  }

  drawRect(x, y, width, height, has_bg, color, bg_color) {
    if(x instanceof Vector){
      this.__drawRectV(x, y, width, height, has_bg, color);
    }
    else {
      this.__drawRectN(x, y, width, height, has_bg, color, bg_color);
    }
  }

  __drawRectN(x, y, width, height, has_bg, color = this.color, bg_color = this.bg_color) {
      this.context.beginPath();
      this.context.rect(x, y, width, height);
      if(has_bg){
        this.context.fillStyle = bg_color;
        this.context.fill();
        this.context.fillStyle = this.color;
      }
      this.context.strokeStyle = color;
      this.context.stroke();
      this.context.strokeStyle = this.color;
  }

  __drawRectV(v, width, height, has_bg, color = this.color, bg_color = this.bg_color) {
    this.__drawRectN(v.val(0), v.val(1), width, height, has_bg, color, bg_color);
  }

  drawPolygon(points, color = this.color, bg_color = this.bg_color){
    this.context.beginPath();
    this.context.moveTo(points[0].val(0), points[0].val(1));
    for(var i = 1; i < points.length; i++){
      this.context.lineTo(points[i].val(0), points[i].val(1));
    }
    this.context.closePath();
    this.context.fillStyle = bg_color;
    this.context.fill();
    this.context.fillStyle = this.color;
    this.context.strokeStyle = color;
    this.context.stroke();
    this.context.strokeStyle = this.color;
  }

  clipPolygon(points){
    this.context.beginPath();
    this.context.moveTo(points[0].val(0), points[0].val(1));
    for(var i = 1; i < points.length; i++){
      this.context.lineTo(points[i].val(0), points[i].val(1));
    }
    this.context.closePath();
    this.context.clip();
  }

  setLineStyle(start_x, start_y, end_x, end_y, n_lines) {
    var n_steps = n_lines * 2 - 1;
    var grad = this.context.createLinearGradient(start_x, start_y, end_x, end_y);
    grad.addColorStop(0, this.color);
    var current_color = this.color;
    for(var i = 1; i < n_steps; i++) {
      grad.addColorStop(i/n_steps, current_color);
      current_color = (current_color == this.color ? "transparent" : this.color);
      grad.addColorStop(i/n_steps, current_color);
    }
    grad.addColorStop(1, this.color);
    this.context.strokeStyle = grad;
  }

  setLineWidth(width){
    this.context.lineWidth = width;
  }

  setDefaultOptions() {
    this.context.fillStyle = this.color;
    this.context.strokeStyle = this.color;
  }

  draw () {
    this.resetTransformation();
    this.context.scale(this.scale, this.scale);
    this.context.clearRect(0, 0, this.root.width*2, this.root.height*2);
    this.context.fillStyle = this.bg_color;
    this.context.fillRect(0, 0, this.root.width*2, this.root.height*2);
    this.context.font = font_size + "px " + font;
    this.setDefaultOptions();
    this.setBaseline("top");
    for(var i = 0; i < this.errors.length; i++){
      this.write(this.errors[i], this.offset_x, this.offset_y, error_color);
    }
  }

  getContext() {
    return this.context;
  }

  getTop() {
    return this.offset_y;
  }
  getBottom() {
    return this.offset_y + this.height;
  }

  getLeft() {
    return this.offset_x;
  }

  getRight() {
    return this.offset_x + this.width;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  setWidth(width){
    this.root.width = width;
    this.rescale();
  }

  setHeight(height){
    this.root.height = height;
    this.rescale();
  }

  scale(size){
    this.root.height *= size;
    this.root.width *= size;
    this.rescale();
  }

  rescale() {
    var width_ratio = this.root.width/this.width;
    var height_ratio = this.root.height/this.height;
    if(width_ratio > height_ratio){
      var ratio = height_ratio;
    }
    else{
      var ratio = width_ratio;
    }
    this.setScale(ratio);
    this.draw();
  }

  setScale(scale){
    this.scale = scale;
  }

}

class Canvas_Object {
  constructor (Canvas, color, x, y, rotation, width, height){
    this.Canvas = Canvas;
    this.color = color;
    this.start_point = new Vector(x, y);
    this.height = height;
    this.width = width;
    this.rotation = rotation;
  }

  getStartPoint(){
    return this.start_point;
  }

    getHeight(){
      return this.height;
    }

    getWidth(){
      return this.width;
    }

  getCenter() {
    return this.start_point.add(this.width/2, this.height/2);
  }

  getY(){
    return this.start_point.val(1);
  }

  moveX(offset){
    this.start_point = this.start_point.add(offset, 0);
  }

  moveY(offset){
    this.start_point = this.start_point.add(0, offset);
  }

  move(vector){
    this.start_point = this.start_point.add(vector);
  }

  getBottom(){
    return this.start_point.val(1) + this.height;
  }
}

class Text_Object extends Canvas_Object{
  constructor (Canvas, color, x, y, width){
    super(Canvas, color, x, y, 0, width, font_size);
    this.value = 1;
    this.is_centered = true;
  }

  setValue(val){
    this.value = val;
  }

  draw() {
    var start = this.start_point;
    if(this.is_centered){
      start = this.getCenter().sub(this.Canvas.measureText(this.value)/2, 0);
    }
    this.Canvas.setBaseline("middle");
    this.Canvas.write(this.value, start, this.color);
  }
}

class Number_Object extends Text_Object{
  constructor (Canvas, color, x, y, width, decimal = 1){
    super(Canvas, color, x, y, width);
    this.decimal = decimal;
  }

  numberFormat(val) {
    return number_format(val, this.decimal, ".", ",");
  }

  draw() {
    this.Canvas.setBaseline("middle");
    this.Canvas.write(this.numberFormat(this.value), this.start_point);
  }
}

class Line_Object extends Canvas_Object{
  constructor (Canvas, color, x, y, rotation, width, height, line_value, line_distance, marker_offset, is_horizontal){
    super(Canvas, color, x, y, rotation, width, height);
    this.line_value = line_value;
    this.line_distance = line_distance;
    this.value = 0;
    this.marker_offset = marker_offset;
    if(is_horizontal){
      this.compare_size = this.width;
      this.compare_coordinate = 0;
    }
    else {
      this.compare_size = this.height;
      this.compare_coordinate = 1;
    }
  }

  setValue(val) {
    this.value = val;
  }

  getMarker(){
    return this.marker_offset.add(this.start_point);
  }

  getCoordinateLength(){
    return this.line_distance/this.line_value;
  }

  getZeroMark(){
    var marker = this.getMarker().val(this.compare_coordinate);
    var value_in_pixel = this.line_distance/this.line_value;
    return this.getMarker().add((this.compare_coordinate == 0) * this.value * value_in_pixel, (this.compare_coordinate == 1) * this.value * value_in_pixel);
  }

  getNumberMark(val){
    var marker = this.getMarker().val(this.compare_coordinate);
    var value_in_pixel = this.line_distance/this.line_value;
    return this.getZeroMark().sub((this.compare_coordinate == 0) * val * value_in_pixel, (this.compare_coordinate == 1) * val * value_in_pixel);
  }

  draw () {
    var n_lines = this.compare_size/this.line_distance;
    var lines_below_center = (this.compare_size - (this.getMarker().sub(this.start_point).val(this.compare_coordinate))) / this.line_distance;
    var start_value = this.value - this.line_value * lines_below_center;
    var number_value = (start_value - (start_value % this.line_value));
    var offset = this.line_distance/this.line_value * (start_value % this.line_value);
    for(var i = this.start_point.val(this.compare_coordinate) + this.compare_size + offset; i >= this.start_point.val(this.compare_coordinate); i = i - this.line_distance){
      this.drawLine(number_value, this.getLineBottom(), i);
      number_value += this.line_value;
    }
  }
}

class Circle_Meter extends Canvas_Object {
  constructor(Canvas, color, x, y, width, height, min_value, max_value, line_value) {
    super(Canvas, color, x, y, 0, width, height);
    this.value = 0;
    this.max_value = max_value;
    this.min_value = min_value;
    this.line_value = line_value;
  }

  formatNumber(val){
    return val / 100;
  }

  setValue(val){
    this.value = val;
  }

  drawLine(number, degrees){
    this.Canvas.rotateAround(degrees, this.getCenter());
    if(number % 100 == 0){
      this.Canvas.setLineWidth(2);
      this.Canvas.drawLine(this.width/2, 0, this.width/2, 8);
        this.Canvas.setLineWidth(1);
      var text = this.formatNumber(number);
      var text_size = this.Canvas.measureText(text);
      this.Canvas.rotateAround(-degrees, this.width/2, 10 + font_size/2);
      this.Canvas.write(text, this.width/2 - text_size/2, 10);
      this.Canvas.rotateAround(degrees, this.width/2, 10 + font_size/2);
    }
    else {
      this.Canvas.drawLine(this.width/2, 0, this.width/2, 5);
    }
    this.Canvas.rotateAround(-degrees, this.getCenter());
  }

  drawIndicator(value, degrees){
    this.Canvas.rotateAround(degrees, this.getCenter());
    this.Canvas.drawPolygon([
      new Vector(this.width/2,     5),
      new Vector(this.width/2 - 3, 11),
      new Vector(this.width/2 - 3, 34),
      new Vector(this.width/2,     40),
      new Vector(this.width/2 + 3, 34),
      new Vector(this.width/2 + 3, 11),], "white", "white");
    this.Canvas.setLineWidth(2);
    this.Canvas.drawLine(this.width/2, 40, this.width/2, 70, "grey");
    this.Canvas.setLineWidth(1);
    this.Canvas.rotateAround(-degrees, this.getCenter());
  }

  draw(){
    this.Canvas.setBaseline("top");
    var n_lines = (this.max_value - this.min_value) / this.line_value;
    var degrees = 360 / n_lines;
    var cur_degrees = 0;
    for(var i = this.min_value; i < this.max_value; i = i + this.line_value){
      this.drawLine(i, cur_degrees);
      cur_degrees += degrees;
    }
    this.drawIndicator(this.value, this.value / this.line_value * degrees);
  }
}

class Band extends Line_Object {
  constructor (Canvas, color, zero_color, bg_color, zero_bg_color, line_value, line_distance, min_value, max_value, num_val){
    super(Canvas, color, 10, 0, 0, Canvas.getWidth() - 20, Canvas.getHeight(), line_value, line_distance, new Vector(0, Canvas.getHeight()/2), false);
    this.zero_color = zero_color;
    this.bg_color = bg_color;
    this.zero_bg_color = zero_bg_color;
    this.min_value = min_value;
    this.max_value = max_value;
    this.number_value = num_val;
  }

  drawLine(number_value, x, y){
    if(number_value > this.max_value ||number_value < this.min_value){
      return;
    }
    this.Canvas.setBaseline("middle");
    var color = this.color;
    if(number_value <= 0){
      color = this.zero_color;
    }
    if(number_value % this.number_value == 0){
      var num_size = this.Canvas.measureText(this.numberFormat(number_value));
      this.Canvas.drawLine(x, y, x + this.width/2 - num_size/2, y, color);
      this.Canvas.drawLine(x + this.width/2 + num_size/2, y, x + this.width, y, color);
      this.Canvas.write(this.numberFormat(number_value), x + this.width/2 - num_size/2, y, color);
    }
    else {
      this.Canvas.drawLine(x, y, x + this.width, y, color);
    }
  }

  numberFormat(val){
    return val / 100;
  }

  draw(){
    if(this.value > this.max_value){
      this.value = this.max_value;
    }
    if(this.value < this.min_value){
      this.value = this.min_value;
    }
    var left = this.getCenter().sub(this.width/2, 0);
    var right = this.getCenter().add(this.width/2, 0);
    this.Canvas.drawPolygon([left, left.add(-10, -5), left.add(-10, 5)], "white", "white");
    this.Canvas.drawPolygon([right, right.add(10, -5), right.add(10, 5)], "white", "white");
    this.Canvas.drawRect(this.getZeroMark().add(0, -font_size/2), this.width, -this.height*this.max_value, true, this.bg_color, this.bg_color);
    this.Canvas.drawRect(this.getZeroMark().add(0, -font_size/2), this.width, this.height*this.max_value, true, this.zero_bg_color, this.zero_bg_color);
    super.draw();
  }

  getLineBottom() {
    return this.start_point.val(0);
  }

}
