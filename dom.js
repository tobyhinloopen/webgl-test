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

/**
 *
 * @param {HTMLElement} parent
 * @param {string} name
 * @param {Record<string, string>} attributes
 * @param {Partial<HTMLElement>} props
 */
function dom__appendElement(parent, name, attributes, props) {
  const elem = dom__createElement(name, attributes, props);
  parent.appendChild(elem);
  return elem;
}

/**
 *
 * @param {string} name
 * @param {Record<string, string>} attributes
 * @param {Partial<HTMLElement>} props
 */
function dom__createElement(name, attributes, props) {
  /** @type {HTMLElement} */
  const elem = document.createElement(name);
  if (attributes) {
    for (const key in attributes) {
      elem.setAttribute(key, attributes[key]);
    }
  }
  if (props) {
    for (const key in props) {
      elem[key] = props[key];
    }
  }
  return elem;
}

function dom__injectScript(src) {
  return new Promise((resolve, reject) => {
    const script = dom__appendElement(document.body, "script", { src });
    script.addEventListener("load", resolve);
    script.addEventListener('error', (error) => reject(error));
    script.addEventListener('abort', () => reject('Script loading aborted.'));
  });
}
