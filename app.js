/** @typedef {{ render: RenderContext, downKeys: DownKeys, time: number }} AppContext */

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {AppContext} ctx
 */
async function init(gl, ctx) {
  ctx.downKeys = dom__getDownKeys();
  ctx.render = await render__init(gl);
  ctx.time = 0;
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {AppContext} ctx
 * @param {number} currentTime
 */
function next(gl, ctx, currentTime) {
  if (ctx.time === 0) {
    ctx.time = currentTime;
    requestAnimationFrame(next.bind(null, gl, ctx));
    return;
  }

  const { render, downKeys, time } = ctx;
  const delta = currentTime - time;
  ctx.time = currentTime;

  const cameraMovement = 0.001;

  if (downKeys.keyChars.w) {
    render.cameraY += delta * cameraMovement;
  }
  if (downKeys.keyChars.s) {
    render.cameraY -= delta * cameraMovement;
  }
  if (downKeys.keyChars.a) {
    render.cameraX -= delta * cameraMovement;
  }
  if (downKeys.keyChars.d) {
    render.cameraX += delta * cameraMovement;
  }

  render__render(gl, render);
  requestAnimationFrame(next.bind(null, gl, ctx));
}

async function main() {
  try {
    const canvas = dom__createCanvas();
    const gl = canvas.getContext("webgl");

    if (gl === null) {
      throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    /** @type {AppContext} */
    const ctx = {};
    await init(gl, ctx);
    requestAnimationFrame(next.bind(null, gl, ctx));
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

window.addEventListener("DOMContentLoaded", main);
