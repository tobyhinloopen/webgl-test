/**
 *
 * @param {WebGLRenderingContext} gl
 */
function glInit(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
/**
 *
 * @param {WebGLRenderingContext} gl
 */
function init(gl) {
  glInit(gl);
}

/**
 *
 * @param {WebGLRenderingContext} gl
 */
function glRender(gl) {

}

/**
 *
 * @param {WebGLRenderingContext} gl
 */
function next(gl) {
  glRender(gl);
  requestAnimationFrame(next.bind(null, gl));
}

function main() {
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

  init(gl);
  next(gl);
}

window.addEventListener("DOMContentLoaded", main);
