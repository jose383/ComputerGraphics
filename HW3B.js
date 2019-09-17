/**
Group 1
9/19/2019
Arruda Jr, Randy Jame
Lee, Nathan Seto
Lopez, Jose F.
**/

"use strict";

var canvas;
var gl;
var points = [];
var subdivisionCount = 0;
var degrees = 0;
var showGasket = true;

var vertices = [
  vec2(-Math.sqrt(3)/2, -1/2),
  vec2(0, 1),
  vec2(Math.sqrt(3)/2, -1/2)
];

// Set initialization function
window.onload = function init() {

  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }
  
  let leftcount = 0;
  let rightcount = 0;

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Load shaders and initialize attribute buffers
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Initialize GPU buffer
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  

    //listen to clicks
 document.getElementById("gl-canvas").addEventListener("mousedown", whichClick, false);

 function whichClick(e){
	if(e.button === 0){
		//if greater than 8, go back to 0.
		if(leftcount >= 8){
			leftcount=0;
		}
		else{
			leftcount++;
		}
		subdivisionCount=leftcount;
		updatePoints();
		render();
	}
	else if(e.button === 1||2){
		var interval = setInterval(function(){
			if(rightcount == 8){
				clearInterval(interval);
				rightcount=0;
			}
			else{
				rightcount++;
			}
			subdivisionCount = rightcount;
			updatePoints();
			render();
		}, 1000); 
	}
    }
  
  
  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  updatePoints();
  render();
};

// Update triangles to be rendered
function updatePoints() {
  points = [];

  // Subdivide initial triangle
  divideTriangle(vertices[0], vertices[1], vertices[2], subdivisionCount);

  // Load the data into the GPU
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
}

// Add triangle to points array
function triangle(a, b, c) {
  points.push(a, b, c);
}

// Recusively divide triangle coordinates
function divideTriangle(a, b, c, count) {

  // check for end of subdivision
  if (count == 0) {
    triangle(rotate(a), rotate(b), rotate(c));
  } else {
    // bisect the sides
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    // decrease subdivision count
    --count;

    // four new triangles
    divideTriangle(a, ab, ac, count);
    divideTriangle(c, ac, bc, count);
    divideTriangle(b, bc, ab, count);
    if (!showGasket) {
      divideTriangle(ac, bc, ab, count);
    }
  }
}

// Rotate a vec2 by the global angle 'degrees'
function rotate(point) {
  var x = point[0];
  var y = point[1];
  var dist = Math.sqrt(x*x + y*y);
  var theta = dist*degrees*(Math.PI/180);

  return vec2(
    x*Math.cos(theta)-y*Math.sin(theta),
    x*Math.sin(theta)+y*Math.cos(theta));
}

// Render
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
}

// Handle updates from user
function inputUpdate(input) {
  if (input.id == "steps") {
    subdivisionCount = input.value;
    document.getElementById("steps-text").innerHTML = input.value;
  } else if (input.id == "angle") {
    degrees = input.value;
    document.getElementById("angle-text").innerHTML = input.value;
  } else if (input.id == "gasket") {
    showGasket = input.checked;
  }
  updatePoints();
  render();
}
