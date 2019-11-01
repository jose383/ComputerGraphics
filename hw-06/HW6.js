/**
 Group 1
 10/31/2019
 Arruda Jr, Randy Jame
 Lee, Nathan Seto
 Lopez, Jose F.
 **/

"use strict";

let canvas;
let gl;

let numVertices  = 18; // 3*[triangle sides] + 6*[square sides] = 3*4 + 6*1 = 18
let texSize = 64;

// Create a checkerboard pattern using floats
let image1 = [];
for (let i =0; i<texSize; i++)  image1[i] = [];
for (let i =0; i<texSize; i++)
    for ( let j = 0; j < texSize; j++)
        image1[i][j] = new Float32Array(4);
for (let i =0; i<texSize; i++) for (let j=0; j<texSize; j++) {
    let c = (((i & 0x8) === 0) ^ ((j & 0x8)  === 0));
    image1[i][j] = [c, c, c, 1];
}

// Convert floats to ubytes for texture
let image2 = new Uint8Array(4*texSize*texSize);

for ( let i = 0; i < texSize; i++ )
    for ( let j = 0; j < texSize; j++ )
        for(let k =0; k<4; k++)
            image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];

let pointsArray = [];
let normalsArray = [];
let texCoordsArray = [];

let texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

let vertices = [
    vec4( 0.0, -0.5,  0.5, 1.0 ), // Lower-Front
    vec4( -0.5, -0.5,  0.0, 1.0 ), // Lower-Left
    vec4( 0.0, 0.3,  0.0, 1.0 ), // TOP
    vec4( 0.5, -0.5, 0.0, 1.0), // Lower-Right
    vec4( 0.0, -0.5,  -0.5, 1.0 ) // Lower-Back
];


let lightPosition = vec4(1.0, 1.0, 1.0, 0.0 ); // Far Away
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 ); // Little Bit
let lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 ); // White
let lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 ); // White

let materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 ); // A Little Purple-ish
let materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0); // Red + Some Green (Yellow-ish)
let materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 ); // Red not absorbed, Green is absorbed a little bit, Blue is completely absorbed
let materialShininess = 100.0; // Polished Metal (Constant)

let modelView, projection;
let program;

let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = 0;
let thetaVector =[0, 0, 0];

let thetaLoc;
let flag = false;
let rotateVal = 2.0;

function configureTexture(image) {
    let texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}

let near = 0.01;
let far = 5.0;
let radius = 1.3;
let theta = radians(0);
let phi = radians(-15);

let  fovY = 70.0;   // Field-of-view in Y direction angle (in degrees)
let  aspect = 1.0;  // Viewport aspect ratio (Aspect = 1.0)

let eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

let tri = (a,b,c) => {
    let t1 = subtract(vertices[b], vertices[a]);
    let t2 = subtract(vertices[c], vertices[b]);
    let normal = cross(t1, t2);
    normal = vec3(normal);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);
};

function quad(a, b, c, d) {

    let t1 = subtract(vertices[b], vertices[a]);
    let t2 = subtract(vertices[c], vertices[b]);
    let normal = cross(t1, t2);
    normal = vec3(normal);


    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);

}

let colorPyramid = () => {

    tri(0,2,1); // Left-Front Side
    tri(3,2,0); // Right-Front Side
    tri(4,2,3); // Right-Back Side
    tri(1,2,4); // Left-Back Side
    quad(3,0,1,4); // Bottom Side

};


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    aspect = canvas.width/canvas.height;

    gl = WebGLUtils.setupWebGL( canvas, null );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorPyramid();

    let nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    let vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    let tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    let vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    configureTexture(image2);

    thetaLoc = gl.getUniformLocation(program, "theta");

    //projection = ortho(-1, 1, -1, 1, -100, 100);
    //projection = perspective(fovY, aspect, near, far);

    let ambientProduct = mult(lightAmbient, materialAmbient);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
        flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
        flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
        flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
        "shininess"),materialShininess);

    //gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));

    // Start Rotation when key is pressed
    document.addEventListener( "keydown", (e) => {
        switch (e.key) {
            case 'ArrowUp':
                rotateVal = (rotateVal > 0) ? rotateVal * -1.0 : rotateVal; // If Negative, keep Negative

                axis = xAxis; // Select Axis for Rotation
                flag = true; // Start Rotation in Render()

                break;

            case 'ArrowDown':
                rotateVal = (rotateVal < 0) ? rotateVal * -1.0 : rotateVal; // If Positive, keep Positive

                axis = xAxis; // Select Axis for Rotation
                flag = true; // Start Rotation in Render()

                break;

            case 'ArrowLeft':
                rotateVal = (rotateVal > 0) ? rotateVal * -1.0 : rotateVal; // If Negative, keep Negative

                axis = yAxis; // Select Axis for Rotation
                flag = true; // Start Rotation in Render()

                break;

            case 'ArrowRight':
                rotateVal = (rotateVal < 0) ? rotateVal * -1.0 : rotateVal; // If Positive, keep Positive

                axis = yAxis; // Select Axis for Rotation
                flag = true; // Start Rotation in Render()

                break;
        }
    });

    // Stop Rotation when key is released
    document.addEventListener('keyup', () => {
        flag = false; // Stop Rotation in Render()
    });

    render();
};

let render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set Camera
    //eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
    //eye = vec3(0, 0, radius);
    eye = vec3(0, radius * Math.sin(phi), radius);
    modelView = mat4();
    modelView = lookAt(eye, at , up);

    // Rotate Shape
    if(flag) thetaVector[axis] += rotateVal;
    modelView = mult(modelView, rotate(thetaVector[xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(thetaVector[yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(thetaVector[zAxis], [0, 0, 1] ));

    // Perspective Projection
    projection = perspective(fovY, aspect, near, far);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView) );
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame(render);
};
