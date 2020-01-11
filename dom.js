/** @typedef {{ keyChars: { [key: string]: boolean }, keyCodes: { [key: string]: boolean } }} DownKeys */

/**
 *
 */
function dom__createCanvas() {
  const container = document.getElementById("app");
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  canvas.className = "canvas";
  container.appendChild(canvas);
  return canvas;
}

/**
 *
 */
function dom__getDownKeys() {
  /** @type {{ [key: string]: boolean }} */
  const keyChars = {};
  /** @type {{ [key: string]: boolean }} */
  const keyCodes = {};

  window.addEventListener("keydown", (event) => {
    keyChars[event.key] = true;
    keyCodes[event.keyCode] = true;
  });

  window.addEventListener("keyup", (event) => {
    keyChars[event.key] = false;
    keyCodes[event.keyCode] = false;
  });

  return { keyChars, keyCodes };
}
