function test__init() {
  window.location.hash = "#test";
  dom__appendElement(document.head, "link", { rel: "stylesheet", href: "https://unpkg.com/mocha/mocha.css" });
  dom__appendElement(document.body, "div", { id: "mocha" });
  document.body.querySelector("#app").style.display = "none";

  Promise.all([
    dom__injectScript("https://unpkg.com/chai/chai.js"),
    dom__injectScript("https://unpkg.com/mocha/mocha.js"),
  ]).then(() => {
    mocha.setup('tdd');
    mocha.checkLeaks();
    test__setup();
    mocha.run();
  }).catch(console.error);
}

function test__setup() {
  road__test();
  segment2__test();
  vector2__test();
}
