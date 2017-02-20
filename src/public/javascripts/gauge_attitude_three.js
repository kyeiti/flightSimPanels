class Attitude_Canvas {
  constructor(size, color, bg_color, offset_x, offset_y){
    this.scene = new THREE.Scene();

    var d_heading = size / 10;
    this.camera = new THREE.PerspectiveCamera( 20, size / (size + d_heading), 0.1, 1000 );

    this.renderer = new THREE.WebGLRenderer({'antialias':true});

    this.renderer.setSize( size, size + d_heading );
    document.body.appendChild( this.renderer.domElement );
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.left = offset_x + "px";
    this.renderer.domElement.style.top = offset_y + "px";
    this.renderer.shadowMap.enabled = true;
    this.color = color;
    this.bg_color = bg_color;
    this.size = size;

    this.objects = {
      attitude: new Attitude(7.3, "images/FDAI_texture3.png"),
      roll: new Roll(6.5, "white", 0.7),
      heading_offset: new HeadingOffset(-8.5, "white", 3, 5, 24)
    };
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.scene.add(this.objects[key].getGroup());
      }
    }
    this.camera.position.z = 55;
    this.camera.position.y = -2;
    this.light = new THREE.PointLight( 0xffffff, 4, 200 );
    this.light.position.set( 50, 50, 110 );
    this.light.castShadow = true;
    this.scene.add( this.light );
    this.draw();
  }

  setRoll(val){
    this.objects.attitude.setRoll(val);
    this.objects.roll.setRoll(val);
  }

  setCompass(val){
    this.objects.attitude.setCompass(val);
  }

  setPitch(val){
    this.objects.attitude.setPitch(val);
  }

  setHeadingOffset(val){
    this.objects.heading_offset.setOffset(val);
  }

  draw(){

    	//requestAnimationFrame( this.draw );
    	this.renderer.render( this.scene,   this.camera );
      /*
    for(var key in this.objects){
      if(this.objects.hasOwnProperty(key)){
        this.objects[key].draw();
      }
    }
    */
  }
}

class HeadingOffset{
    constructor(y, color, height, width, value_range) {
        this.y = y;
        this.color = color;
        this.height = height;
        this.width = width;
        this.value_range = value_range;
        this.outer_group = new THREE.Object3D();
        this.outer_group.position.y = y;

        this.scale = new THREE.Object3D();
        this.outer_group.add(this.scale);
        var material = new THREE.LineDashedMaterial( { color: color, linewidth: 20, dashSize: width/5, gapSize: width/5});
        var line_geometry = new THREE.Geometry();

        var line_width = 1;
        var line_shapes = [];
        for(var i = 0; i< 3; i++){
          line_shapes[i] = new THREE.Shape();
          line_shapes[i].moveTo(-width/2 + width/5 * i*2, line_width/2);
          line_shapes[i].lineTo(-width/2 + width/5 * (i*2+1), line_width/2);
          line_shapes[i].lineTo(-width/2 + width/5 * (i*2+1), -line_width/2);
          line_shapes[i].lineTo(-width/2 + width/5 * i*2, -line_width/2);
          line_shapes[i].lineTo(-width/2 + width/5 * i*2, line_width/2);
        }
        var line_geometry = new THREE.ShapeGeometry(line_shapes, 1);
        var line1 = new THREE.Mesh( line_geometry, material ) ;
/*        line_geometry.vertices.push(new THREE.Vector3(-width/2, 0, 0));
        line_geometry.vertices.push(new THREE.Vector3(width/2,0, 0));
        line_geometry.computeLineDistances();
        var line1 = new THREE.Line(line_geometry, material);*/
        line1.position.y = -height/2;

        var material = new THREE.LineBasicMaterial( { color: color });
        var line_geometry = new THREE.Geometry();
        line_geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        line_geometry.vertices.push(new THREE.Vector3(0, -height/2, 0));
        var line2 = new THREE.Line(line_geometry, material);
        line2.position.x = width/10;
        var line3 = new THREE.Line(line_geometry, material);
        line3.position.x = -width/10;

        this.scale.add(line1);
        this.scale.add(line2);
        this.scale.add(line3);

        this.marker = new THREE.Object3D();
        this.outer_group.add(this.marker);
        var geometry = new THREE.SphereBufferGeometry( 0.5, 50, 50);
        var material = new THREE.MeshLambertMaterial( { color: color} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.y = - 0.6;
        sphere.position.z = - 1;
        this.marker.add(sphere);
    }

  getGroup(){
    return this.outer_group;
  }
    setOffset(pos){
      if(this.value_range/2 < Math.abs(pos)){
        pos = this.value_range/2 * Math.sign(pos);
      }
      this.marker.position.x = pos * this.width / this.value_range;
    }

}

class Roll {
    constructor(radius, color, size) {
        this.z = radius +0.1;
        this.radius = radius;
        this.color = color;
        this.outer_group = new THREE.Object3D();
        this.marker = new THREE.Object3D();
        this.marker.position.z = this.z;

        this.outer_group.add(this.marker);

        var material = new THREE.MeshLambertMaterial( { color: color } );

        var markerShape = new THREE.Shape();
        markerShape.moveTo(0, radius);
        markerShape.lineTo(-size/2, radius - size);
        markerShape.lineTo(size/2, radius - size);

        var markerGeometry = new THREE.ShapeGeometry(markerShape, 1);

        var shadow_material = new THREE.MeshLambertMaterial( { color: instrument_border_color } );

        var markerShadowShape = new THREE.Shape();
        markerShadowShape.moveTo(0, radius + 0.2);
        markerShadowShape.lineTo(-size/2-0.2, radius - size - 0.1);
        markerShadowShape.lineTo(size/2+0.2, radius - size - 0.1);

        var markerShadowGeometry = new THREE.ShapeGeometry(markerShadowShape, 1);

        var marker1 = new THREE.Mesh( markerGeometry, material ) ;
        var marker2 = new THREE.Mesh( markerGeometry, material ) ;
        var markerShadow1 = new THREE.Mesh( markerShadowGeometry, shadow_material ) ;
        var markerShadow2 = new THREE.Mesh( markerShadowGeometry, shadow_material ) ;
        marker2.rotation.z = Math.PI;
        markerShadow2.rotation.z = Math.PI;
        markerShadow2.position.z -= 0.1;
        markerShadow1.position.z -= 0.1;
        this.marker.add(marker1);
        this.marker.add(marker2);
        this.marker.add(markerShadow2);
        this.marker.add(markerShadow1);


        this.scala = new THREE.Object3D();
        this.scala.position.z = this.z;
        this.outer_group.add(this.scala);
        var zeroShape = new THREE.Shape();
        zeroShape.moveTo(0, -radius);
        zeroShape.lineTo(-size/2, -radius - size);
        zeroShape.lineTo(size/2, -radius - size);
        var zeroGeometry = new THREE.ShapeGeometry(zeroShape, 1);
        var zero = new THREE.Mesh( zeroGeometry, material ) ;
        this.scala.add(zero);
        var line_width_short = 0.125;
        var line_width_wide = 0.25;
        var lines = [{deg: 90, width: line_width_wide}, {deg: 60, width: line_width_wide}, {deg: 30, width: line_width_wide},
            {deg: 10, width: line_width_short}, {deg:20, width: line_width_short}, {deg: 40, width:line_width_short}, {deg: 50, width:line_width_short}];

        for(var i = 0; i < lines.length; i++){
            var line_shape = new THREE.Shape();
            line_shape.moveTo(-lines[i].width/2, -radius);
            line_shape.lineTo(-lines[i].width/2, -radius - size);
            line_shape.lineTo(lines[i].width/2, -radius - size);
            line_shape.lineTo(lines[i].width/2, -radius);
            var line_geometry = new THREE.ShapeGeometry(line_shape);

            var line1 = new THREE.Mesh( line_geometry, material ) ;
            var line2 = new THREE.Mesh( line_geometry, material ) ;
            line1.rotation.z = lines[i].deg * Math.PI / 180;
            line2.rotation.z = -lines[i].deg * Math.PI / 180;
            this.scala.add(line1);
            this.scala.add(line2);
        }


    }

  getGroup(){
    return this.outer_group;
  }

  setRoll(val) {
    val = val * Math.PI / 180;
    this.marker.rotation.z = val;
  }


}

class Attitude {
  constructor (radius, img){
    this.group = new THREE.Object3D();
    this.outer_group = new THREE.Object3D();
    this.compass_rotation = new THREE.Object3D();
    this.pitch_rotation = new THREE.Object3D();
    this.roll_rotation = new THREE.Object3D();

    this.outer_group.add(this.roll_rotation);
    this.roll_rotation.add(this.pitch_rotation);
    this.pitch_rotation.add(this.compass_rotation);
    this.compass_rotation.add(this.group);

    var widthSegments = 50;
    var heightSegments = 50;

    var geometry = new THREE.SphereBufferGeometry( radius, widthSegments, heightSegments);

    var loader = new THREE.TextureLoader();
    this.texture = loader.load( img );
    this.texture.magFilter =  THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.mapping = THREE.EquirectangularRefractionMapping;
    var material = new THREE.MeshLambertMaterial( { map: this.texture } );
    this.sphere = new THREE.Mesh( geometry, material );
    this.sphere.receiveShadow = true;
    this.group.add(this.sphere);
    var widths = [0.2, 0.4];
    var line_material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var line_border_material = new THREE.MeshLambertMaterial({ color: 0x000000 });
    var z = radius + 1;
    var w_length = radius / 2;
    var w_height = radius / 16;
    var line_shapes = [];
    for(var i = 0; i < widths.length; i++){
        line_shapes[i] = new THREE.Shape();
        line_shapes[i].moveTo(-w_length/2 - widths[i]/2, widths[i]/2);
        line_shapes[i].lineTo(-w_length/4, widths[i]/2);
        line_shapes[i].lineTo(-w_length/8, widths[i]/2 -w_height );
        line_shapes[i].lineTo(0,           widths[i]/2);
        line_shapes[i].lineTo(w_length/8, widths[i]/2 -w_height);
        line_shapes[i].lineTo(w_length/4, widths[i]/2);
        line_shapes[i].lineTo(w_length/2 + widths[i]/2, widths[i]/2);
        line_shapes[i].lineTo(w_length/2 + widths[i]/2, -widths[i]/2);
        line_shapes[i].lineTo(w_length/4, -widths[i]/2);
        line_shapes[i].lineTo(w_length/8, -widths[i]/2 -w_height);
        line_shapes[i].lineTo(0,           -widths[i]/2);
        line_shapes[i].lineTo(-w_length/8, -widths[i]/2 -w_height );
        line_shapes[i].lineTo(-w_length/4, -widths[i]/2);
        line_shapes[i].lineTo(-w_length/2 - widths[i]/2, -widths[i]/2);
      }
      var line_geometry = new THREE.ShapeGeometry(line_shapes[0]);
      var border_geometry = new THREE.ShapeGeometry(line_shapes[1]);
    this.marker = new THREE.Mesh(line_geometry, line_material);
    this.marker.position.z = z;
    this.marker_border = new THREE.Mesh(border_geometry, line_border_material);
    this.marker_border.position.z = z - 0.1;
    this.marker_border.castShadow = true;
    this.outer_group.add(this.marker_border);
    this.outer_group.add(this.marker);
  }

  getGroup(){
    return this.outer_group;
  }

  setRoll(val) {
    val = val * Math.PI / 180;
    this.roll_rotation.rotation.z = val;
  }

  setCompass(val) {
    val = - val * Math.PI / 180;
    this.compass_rotation.rotation.y = val;
  }

  setPitch(val) {
    val = val * Math.PI / 180;
    this.pitch_rotation.rotation.x = val;
  }
}
