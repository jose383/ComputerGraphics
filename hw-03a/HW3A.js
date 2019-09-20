/**
 Group 1
 9/19/2019
 Arruda Jr, Randy Jame
 Lee, Nathan Seto
 Lopez, Jose F.
 **/

let gl;
const original = [
    -0.3, -0.2,
    -0.3,  0.2,
    0.0, 0.4,
    0.3, 0.2,
    0.3, -0.2,
    0.0, -0.4
];

window.onload = function init()
{
    let canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Vertices

    let vertices = original.slice(0);

    let colors = [
        vec4(0.4,0.0,0.3,1.0),
        vec4(0.2,0.1,0.7,1.0),
        vec4(0.3,0.6,0.6,1.0),
        vec4(0.2,0.5,0.3,1.0),
        vec4(0.2,0.2,0.6,1.0)
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 0.5, 0.3, 1.0 );

    //  Load shaders and initialize attribute buffers

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load Colors

    let cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // Load the data into the GPU

    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    render();

    // Keyboard Listener

    document.addEventListener( "keypress", (e) => {

        let move = 0.02;

        switch (e.key) {
            case 'a':

                // Left

                if (!(vertices[0] <= -1.0 && vertices[2] <= -1.0)) {
                    for (let i = 0; i < vertices.length; i+=2)
                        vertices[i] -= move;
                }

                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;

            case 'd':

                // Right

                if (!(vertices[6] >= 1.0 && vertices[8] >= 1.0)){
                    for (let i = 0; i < vertices.length; i+=2)
                        vertices[i] += move;
                }

                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;

            case 'w':

                // Up

                if (!(vertices[5] >= 1.0)){
                    for (let i = 1; i < vertices.length; i+=2)
                        vertices[i] += move;
                }

                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;

            case 's':

                // Down

                if (!(vertices[11] <= -1.0)){
                    for (let i = 1; i < vertices.length; i+=2)
                        vertices[i] -= move;
                }

                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;

            case '1':

                // Back to Original

                vertices = original.slice(0);
                gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
                render();
                return;
        }
    });
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, original.length/2 );
}