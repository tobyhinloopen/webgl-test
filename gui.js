{
  /**
   *
   * @param {HTMLElement} element
   */
  function injectTopLeftGui(element) {
    const
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
   * @param {HTMLElement} element
   */
  function gui__inject(element) {
    const topLeft = document.createElement("div");
    topLeft.className = "gui__top-left";
    element.appendChild(topLeft);
    injectTopLeftGui(topLeft);

    const topRight = document.createElement("div");
    topRight.className = "gui__top-right";
    element.appendChild(topRight);
    injectTopRightGui(topRight);

    const bottomLeft = document.createElement("div");
    bottomLeft.className = "gui__bottom-left";
    element.appendChild(bottomLeft);
    injectBottomLeftGui(bottomLeft);

    const bottomRight = document.createElement("div");
    bottomRight.className = "gui__bottom-right";
    element.appendChild(bottomRight);
    injectBottomRightGui(bottomLeft);
  }
}
