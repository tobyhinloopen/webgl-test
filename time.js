/** @type {number} */
let time__current = 0;

/** @type {number} */
let time__delta = 0;

/**
 * Update the time & delta
 * @param {number} currentTime
 */
function time__updateDelta(currentTime) {
  time__delta = time__current === 0 ? 0 : currentTime - time__current;
  time__current = currentTime;
}
