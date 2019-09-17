let gl;
let points;

window.onload = function init()
{
    let canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //let x1 =
    let vertices = new Float32Array([0.5, 0.5, 0, -0.5, -0.5, 0.5]);
    const key = KeyboardEvent.key;

    let count = 0;

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    // Load the data into the GPU

    const bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Click Listener

    document.addEventListener( "keypress", () => {

        if (key === 'a'){
            vertices = new Float32Array([-0.5, -0.5, 0, 0.5, 0.5, -0.5]);
            gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );
            render()
        }

    });

    // Associate out shader variables with our data buffer

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
