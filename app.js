/**
 * @typedef {{ positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer, programInfo: RendererProgramInfo }} RenderContext
 */


const DEG2RAD = Math.PI / 180;

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {RenderContext} ctx
 */
async function glInit(gl, ctx) {
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
    1.0,  1.0,  1.0,  1.0, // white
    1.0,  0.0,  0.0,  1.0, // red
    0.0,  1.0,  0.0,  1.0, // green
    0.0,  0.0,  1.0,  1.0, // blue
  ]), gl.STATIC_DRAW);

  ctx.positionBuffer = positionBuffer;
  ctx.colorBuffer = colorBuffer;
  ctx.programInfo = await renderer__loadShaderProgram(gl, "/shader.vert", "/shader.frag");
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {RenderContext} ctx
 */
async function init(gl, ctx) {
  await glInit(gl, ctx);
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {RenderContext} ctx
 */
function glRender(gl, { programInfo, colorBuffer, positionBuffer }) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);

  {
    const projectionMatrix = mat4.create();
    const w = gl.canvas.clientWidth / 200;
    const h = gl.canvas.clientHeight / 200;
    mat4.ortho(projectionMatrix, -w, w, -h, h, 0.1, 100);
    // mat4.perspective(projectionMatrix, 45 * DEG2RAD, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
    gl.uniformMatrix4fv(programInfo.uniforms.uProjectionMatrix, false, projectionMatrix);
  }

  {
    const modelViewMatrix = mat4.create();
    mat4.rotateX(modelViewMatrix, modelViewMatrix, 10 * DEG2RAD);
    mat4.translate(modelViewMatrix, modelViewMatrix, new Float32Array([-0.0, -0.0, -7.0]));
    gl.uniformMatrix4fv(programInfo.uniforms.uModelViewMatrix, false, modelViewMatrix);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(programInfo.attribs.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribs.aVertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(programInfo.attribs.aVertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribs.aVertexColor);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {RenderContext} ctx
 */
function next(gl, ctx) {
  glRender(gl, ctx);
  requestAnimationFrame(next.bind(null, gl, ctx));
}

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

  /** @type {RenderContext} */
  const ctx = {};

  await init(gl, ctx);
  next(gl, ctx);
}

window.addEventListener("DOMContentLoaded", main);
