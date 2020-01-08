// /**
//  *
//  * @param {WebGLRenderingContext} gl
//  */
// function glInit(gl) {
//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT);
// }
// /**
//  *
//  * @param {WebGLRenderingContext} gl
//  */
// function init(gl) {
//   glInit(gl);
// }

// /**
//  *
//  * @param {WebGLRenderingContext} gl
//  */
// function glRender(gl) {

// }

// /**
//  *
//  * @param {WebGLRenderingContext} gl
//  */
// function next(gl) {
//   glRender(gl);
//   requestAnimationFrame(next.bind(null, gl));
// }

const DEG2RAD = Math.PI / 180;

/**
 * @typedef {{ program: WebGLProgram; attribLocations: { vertexPosition: number }, uniformLocations: { projectionMatrix: WebGLUniformLocation, modelViewMatrix: WebGLUniformLocation} }} ProgramInfo
 */

async function main() {
  const container = document.getElementById("app");
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  canvas.className = "canvas";
  container.appendChild(canvas);

  const gl = canvas.getContext("webgl");

  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // const renderer = new Renderer(gl);

  // START MOZILLA EXAMPLE
  const programInfo = await renderer__loadShaderProgram(gl, "/shader.vert", "/shader.frag");
  const buffers = initBuffers(gl);
  drawScene(gl, programInfo, buffers);
  // END MOZILLA EXAMPLE

  // init(gl);
  // next(gl);
}

/**
 *
 * @param {WebGLRenderingContext} gl
 */
function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    1.0,  1.0,
   -1.0,  1.0,
    1.0, -1.0,
   -1.0, -1.0,
 ]), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

/**
 * Draw the scene.
 * @param {WebGLRenderingContext} gl
 * @param {RendererProgramInfo} programInfo
 * @param {{position: WebGLBuffer}} buffers
 */
function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);

  {
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 45 * DEG2RAD, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
    gl.uniformMatrix4fv(programInfo.uniforms.uProjectionMatrix, false, projectionMatrix);
  }

  {
    // Set the drawing position to the "identity" point, which is the center of the scene.
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, new Float32Array([-0.0, 0.0, -7.0]));
    gl.uniformMatrix4fv(programInfo.uniforms.uModelViewMatrix, false, modelViewMatrix);
  }

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribs.aVertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribs.aVertexPosition);
  }

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

window.addEventListener("DOMContentLoaded", main);
