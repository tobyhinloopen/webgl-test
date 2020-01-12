const DEG2RAD = Math.PI / 180;

/**
 * @typedef {{ positionBuffer: WebGLBuffer, colorBuffer: WebGLBuffer, programInfo: ShaderProgramInfo, cameraX: number, cameraY: number }} RenderContext
 */

/**
 *
 * @param {WebGLRenderingContext} gl
 * @returns {RenderContext}
 */
async function render__init(gl) {
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

  const programInfo = await shader__loadShaderProgram(gl, "/shader.vert", "/shader.frag");

  return { positionBuffer, colorBuffer, programInfo, cameraX: 0, cameraY: 0 };
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {RenderContext} render
 */
function render__render(gl, render) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(render.programInfo.program);

  {
    const projectionMatrix = mat4.create();
    const w = gl.canvas.clientWidth / 200;
    const h = gl.canvas.clientHeight / 200;
    mat4.ortho(projectionMatrix, -w, w, -h, h, 0.1, 100);
    // mat4.perspective(projectionMatrix, 45 * DEG2RAD, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
    gl.uniformMatrix4fv(render.programInfo.uniforms.uProjectionMatrix, false, projectionMatrix);
  }

  {
    const modelViewMatrix = mat4.create();
    mat4.rotateX(modelViewMatrix, modelViewMatrix, 35.264 * DEG2RAD);
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, 45 * DEG2RAD);
    mat4.translate(modelViewMatrix, modelViewMatrix, new Float32Array([render.cameraX, render.cameraY, -7.0]));
    gl.uniformMatrix4fv(render.programInfo.uniforms.uModelViewMatrix, false, modelViewMatrix);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, render.positionBuffer);
  gl.vertexAttribPointer(render.programInfo.attribs.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(render.programInfo.attribs.aVertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, render.colorBuffer);
  gl.vertexAttribPointer(render.programInfo.attribs.aVertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(render.programInfo.attribs.aVertexColor);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
