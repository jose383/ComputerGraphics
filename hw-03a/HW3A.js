/**
 Group 1
 9/19/2019
 Arruda Jr, Randy Jame
 Lee, Nathan Seto
 Lopez, Jose F.
 **/

let gl;

window.onload = function init()
{
    let canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    // Four Vertices

    let vertices = [
        -0.3, -0.3,
        -0.3,  0.3,
        0.3, 0.3,
        0.3, -0.3
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 0.5, 0.3, 1.0 );

    //  Load shaders and initialize attribute buffers

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Keyboard Listener

    document.addEventListener( "keypress", (e) => {

        let move = 0.02;

        switch (e.key) {
            case 'a':
                // Left
                if (!(vertices[0] <= -1.0 && vertices[2] <= -1.0)) {
                    vertices[0] -= move; // Lower Left RIGHT -
                    //vertices[1] += move; // Lower Left UP -
                    vertices[2] -= move; // Upper Left RIGHT -
                    //vertices[3] += move; // Upper Left UP +
                    vertices[4] -= move; // Upper Right RIGHT +
                    //vertices[5] += move; // Upper Right UP +
                    vertices[6] -= move; // Lower Right RIGHT +
                    //vertices[7] += move; // Lower Right UP -
                }

                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;
            case 'd':
                // Right
                if (!(vertices[4] >= 1.0 && vertices[6] >= 1.0)){
                    vertices[0] += move; // Lower Left RIGHT -
                    //vertices[1] += move; // Lower Left UP -
                    vertices[2] += move; // Upper Left RIGHT -
                    //vertices[3] += move; // Upper Left UP +
                    vertices[4] += move; // Upper Right RIGHT +
                    //vertices[5] += move; // Upper Right UP +
                    vertices[6] += move; // Lower Right RIGHT +
                    //vertices[7] += move; // Lower Right UP -
                }

                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;
            case 'w':
                // Up
                if (!(vertices[3] >= 1.0 && vertices[5] >= 1.0)){
                    //vertices[0] += move; // Lower Left RIGHT -
                    vertices[1] += move; // Lower Left UP -
                    //vertices[2] += move; // Upper Left RIGHT -
                    vertices[3] += move; // Upper Left UP +
                    //vertices[4] += move; // Upper Right RIGHT +
                    vertices[5] += move; // Upper Right UP +
                    //vertices[6] += move; // Lower Right RIGHT +
                    vertices[7] += move; // Lower Right UP -
                }

                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;
            case 's':
                // Down
                if (!(vertices[1] <= -1.0 && vertices[7] <= -1.0)){
                    //vertices[0] += move; // Lower Left RIGHT -
                    vertices[1] -= move; // Lower Left UP -
                    //vertices[2] += move; // Upper Left RIGHT -
                    vertices[3] -= move; // Upper Left UP +
                    //vertices[4] += move; // Upper Right RIGHT +
                    vertices[5] -= move; // Upper Right UP +
                    //vertices[6] += move; // Lower Right RIGHT +
                    vertices[7] -= move; // Lower Right UP -
                }

                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;
            case '1':
                vertices = [
                    -0.3, -0.3,
                    -0.3,  0.3,
                    0.3, 0.3,
                    0.3, -0.3
                ];
                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;
        }



    });
    // Associate out shader variables with our data buffer

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}