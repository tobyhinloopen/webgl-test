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
    throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
  }

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

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
  ]), gl.STATIC_DRAW);

  return {
    positionBuffer,
    colorBuffer
  };
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {RendererProgramInfo} programInfo
 * @param {{positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer}} buffers
 */
function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);

  {
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 45 * DEG2RAD, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
    gl.uniformMatrix4fv(programInfo.uniforms.uProjectionMatrix, false, projectionMatrix);
  }

  {
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, new Float32Array([-0.0, 0.0, -7.0]));
    gl.uniformMatrix4fv(programInfo.uniforms.uModelViewMatrix, false, modelViewMatrix);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
  gl.vertexAttribPointer(programInfo.attribs.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribs.aVertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
  gl.vertexAttribPointer(programInfo.attribs.aVertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribs.aVertexColor);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

window.addEventListener("DOMContentLoaded", main);
