/** @type {{ keyChars: { [key: string]: boolean }, keyCodes: { [key: string]: boolean } }} DownKeys */
const dom__downKeys = { keyChars: {}, keyCodes: {} };

addEventListener("keydown", (event) => {
  dom__downKeys.keyChars[event.key] = true;
  dom__downKeys.keyCodes[event.keyCode] = true;
});

addEventListener("keyup", (event) => {
  dom__downKeys.keyChars[event.key] = false;
  dom__downKeys.keyCodes[event.keyCode] = false;
});

/**
 * Calls fn with the size of the window right away, and after the window has
 * been resized.
 * @param {(width: number, height: number) => void} fn
 */
function dom__watchWindowSize(fn) {
  const notify = () => fn(innerWidth, innerHeight);
  notify();
  addEventListener("resize", () => notify());
}

/**
 *
 * @param {"mousedown"|"mousemove"|"mouseup"} eventType
 * @param {(mouse: THREE.Vector2) => void} fn
 */
function dom__mouseEventListener(eventType, fn) {
  const mouse = new THREE.Vector2();
  addEventListener(eventType, (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
    fn(mouse);
  });
}
