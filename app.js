/** @type {THREE.WebGLRenderer} */
let renderer;

/** @type {THREE.Scene} */
let scene;

/** @type {THREE.PerspectiveCamera} */
let camera;

/**
 *
 */
function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.domElement.className = "canvas";
  document.body.querySelector("#app").appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.z = 1;

  scene = new THREE.Scene();
  geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  scene.add(mesh);

  time = 0;

  dom__watchWindowSize((w, h) => {
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

/**
 *
 * @param {number} currentTime
 */
function next(currentTime) {
  requestAnimationFrame(next);
  time__updateDelta(currentTime);

  {
    const cameraMovement = 0.001;
    if (dom__downKeys.keyChars.w) {
      camera.position.y += time__delta * cameraMovement;
    }
    if (dom__downKeys.keyChars.s) {
      camera.position.y -= time__delta * cameraMovement;
    }
    if (dom__downKeys.keyChars.a) {
      camera.position.x -= time__delta * cameraMovement;
    }
    if (dom__downKeys.keyChars.d) {
      camera.position.x += time__delta * cameraMovement;
    }
  }

  {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
  }

  renderer.render(scene, camera);
}

function main() {
  init();
  requestAnimationFrame(next);
}

window.addEventListener("DOMContentLoaded", main);
