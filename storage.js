/**
 *
 * @param {string} key
 * @param {unknown} value
 */
function storage__set(key, value) {
  localStorage.setItem(key, typeof value === "string" ? "S" + value : "J" + JSON.stringify(value));
}

/**
 *
 * @param {string} key
 */
function storage__get(key) {
  const value = localStorage.getItem(key);
  if (typeof value === "string") {
    return value[0] === "S" ? value.substr(1) : JSON.parse(value.substr(1));
  }
}

/**
 *
 * @param {string} key
 */
function storage__remove(key) {
  localStorage.removeItem(key);
}
