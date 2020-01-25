{
  /**
   *
   * @param {HTMLElement} element
   */
  function injectTopLeftGui(element) {
    dom__appendElement(element, "button", { class: "btn", id: "gui__orbit-controls" }, { textContent: "Orbit Controls" });
    dom__appendElement(element, "button", { class: "btn", id: "gui__build-roads" }, { textContent: "Build Roads" });
    dom__appendElement(element, "br");
    dom__appendElement(element, "span", { id: "gui__mouse-label", class: "label label-primary" });
  }

  /**
   *
   * @param {HTMLElement} element
   */
  function injectTopRightGui(element) {
  }

  /**
   *
   * @param {HTMLElement} element
   */
  function injectBottomLeftGui(element) {

  }

  /**
   *
   * @param {HTMLElement} element
   */
  function injectBottomRightGui(element) {

  }

  /**
   *
   */
  function gui__create() {
    const root = document.createElement("div");
    root.className = "gui";

    const topLeft = document.createElement("div");
    topLeft.className = "gui__top-left";
    root.appendChild(topLeft);
    injectTopLeftGui(topLeft);

    const topRight = document.createElement("div");
    topRight.className = "gui__top-right";
    root.appendChild(topRight);
    injectTopRightGui(topRight);

    const bottomLeft = document.createElement("div");
    bottomLeft.className = "gui__bottom-left";
    root.appendChild(bottomLeft);
    injectBottomLeftGui(bottomLeft);

    const bottomRight = document.createElement("div");
    bottomRight.className = "gui__bottom-right";
    root.appendChild(bottomRight);
    injectBottomRightGui(bottomLeft);

    return root;
  }

  window.gui__create = gui__create;
}

class ViewModel {
  constructor() {
    this.listeners = [];
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

  removeListener(fn) {
    while (true) {
      const index = this.listeners.indexOf(fn);
      if (index === -1) {
        return;
      }
      this.listeners.splice(index, 1);
    }
  }

  notifyLater() {
    if (!this.notifyLaterId) {
      this.notifyLaterId = setTimeout(this.notifyNow.bind(this), 0);
    }
  }

  notifyNow() {
    if (this.notifyLaterId) {
      clearTimeout(this.notifyLaterId);
      this.notifyLaterId = null;
    }
    for (const fn of this.listeners) {
      fn(this);
    }
  }

  static defineReactiveProperty(property, value) {
    const realProperty = "_" + property;
    this.prototype[realProperty] = value;
    Object.defineProperty(this.prototype, property, {
      get() {
        return this[realProperty];
      },
      set(newValue) {
        this[realProperty] = newValue;
        this.notifyLater();
      },
    });
  }
}

class GuiButton extends ViewModel {
  constructor(label) {
    super();
    this.label = label;
  }
}

GuiButton.defineReactiveProperty("label", "");
GuiButton.defineReactiveProperty("enabled", true);
