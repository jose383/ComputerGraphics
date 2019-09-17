let gl;
let points;

window.onload = function init()
{
    let canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    let objs = [
        new Float32Array([0.5, 0.5, 0, -0.5, -0.5, 0.5]),
        new Float32Array([-0.5, -0.5, 0, 0.5, 0.5, -0.5]),
        new Float32Array([-0.5, 0.5, 0.5, -0.5, -0.5, -0.5])];

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
    gl.bufferData( gl.ARRAY_BUFFER, objs[0], gl.STATIC_DRAW );

    // Click Listener

    document.getElementById("gl-canvas").addEventListener("click", () => {

        // 0,1,2,0,1,2,0... for every click
        if (count > (objs.length - 2))
            count = 0;
        else
            count++;
        // count = (count > (objs.length - 2)) ? 0 : count + 1; // Same as above

        gl.bufferData( gl.ARRAY_BUFFER,objs[count], gl.STATIC_DRAW );
        render()
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
