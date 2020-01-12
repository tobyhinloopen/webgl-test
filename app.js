/** @type {THREE.WebGLRenderer} */
let renderer;

/** @type {THREE.Scene} */
let scene;

/** @type {THREE.Camera} */
let camera;

/** @type {THREE.Object3D} */
let apartment;

/** @type {THREE.OrbitControls} */
let controls;

const deg2rad = Math.PI / 180;

/**
 *
 */
function init() {
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.domElement.className = "canvas";
  document.body.querySelector("#app").appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );

  camera.position.set(160, 50, 160);
  camera.lookAt(0, 0, 0);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.update();

  scene = new THREE.Scene();

  {
    apartment = new apartment__build(13);
    console.log(apartment.toJSON());

    const distance = 24;
    for (let x = 0; x < 8; x++) {
      for (let z = 0; z < 12; z++) {
        const clone = apartment.clone();
        const odd = x % 2;
        clone.position.set(x * distance * 1.5 + odd * distance / 2, 0, z * distance);
        odd && clone.rotation.set(0, 180 * deg2rad, 0);
        scene.add(clone);
      }
    }
  }

  dom__watchWindowSize((w, h) => {
    renderer.setSize(w, h);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = w / h;
    }
    if (camera instanceof THREE.OrthographicCamera) {
      const scale = 0.01;
      camera.left = -w / 2 * scale;
      camera.right = w / 2 * scale;
      camera.top = h / 2 * scale;
      camera.bottom = -h / 2 * scale;
    }
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
    controls.update();
  }

  renderer.render(scene, camera);
}

function main() {
  init();
  requestAnimationFrame(next);
}

window.addEventListener("DOMContentLoaded", main);
