/** @type {THREE.WebGLRenderer} */
let renderer;

/** @type {THREE.Scene} */
let scene;

/** @type {THREE.Camera} */
let camera;

/** @type {THREE.Object3D} */
let apartment;

/** @type {THREE.Object3D} */
let terrain;

/** @type {THREE.OrbitControls} */
let orbitControls;

/** @type {GuiButton} */
let buildRoadsButton;

const deg2rad = Math.PI / 180;

/**
 *
 * @param {THREE.Vector2} from
 * @param {THREE.Vector2} to
 */
function buildRoads(from, to) {
  window.from = from;
  window.to = to;

  from = from.clone().round();
  to = to.clone().round();
  const diff = to.clone().sub(from);
  const abs = new THREE.Vector2(Math.abs(diff.x), Math.abs(diff.y));
  const length = Math.round(abs.x > abs.y ? abs.x : abs.y) * TERRAIN__GRID_SIZE;
  if (length === 0) {
    return;
  }
  const road = road__buildSegment(2, length);
  road.rotateY(Math.round(diff.angle() / deg2rad / -90) * 90 * deg2rad);
  road.position.copy(terrain__gridPositionToPoint(from));
  scene.add(road);
}

/**
 *
 */
function init() {
  const app = document.body.querySelector("#app");

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.domElement.className = "canvas";
  app.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000 );

  camera.position.set(160, 50, 160);
  camera.lookAt(0, 0, 0);

  orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControls.update();

  const cameraState = storage__get("camera");
  if (cameraState) {
    try {
      camera.matrix.fromArray(cameraState);
      camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
    } catch (error) {
      console.error("Failed to deserialize camera", error);
      storage__remove("camera");
    }
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  // {
  //   apartment = new apartment__build(13);

  //   const distance = 20;
  //   for (let x = 0; x < 8; x++) {
  //     for (let z = 0; z < 12; z++) {
  //       const clone = apartment.clone();
  //       const odd = x % 2;
  //       clone.position.set(x * distance * 1.5 + odd * distance / 2, 0, z * distance);
  //       odd && clone.rotation.set(0, 180 * deg2rad, 0);
  //       scene.add(clone);
  //     }
  //   }
  // }

  const roadManager = new RoadManager();
  scene.add(roadManager.object);

  roadManager.addGridAlignedRoad(new THREE.Vector2(0, 0), new THREE.Vector2(10, 0), 2);
  roadManager.addGridAlignedRoad(new THREE.Vector2(10, 0), new THREE.Vector2(10, 10), 2);
  roadManager.rebuildRoads();

  app.appendChild(gui__create());

  {
    const orbitControlsButton = new GuiButton("Orbit Controls");
    buildRoadsButton = new GuiButton("Build Roads");

    orbitControlsButton.addListener(({ enabled }) => orbitControls.enabled = enabled);

    const enableOrbitControls = () => {
      orbitControlsButton.enabled = true;
      buildRoadsButton.enabled = false;
    }

    const enableBuildRoads = () => {
      orbitControlsButton.enabled = false;
      buildRoadsButton.enabled = true;
    }

    /** @type {HTMLButtonElement} */
    const orbitControlsButtonElement = document.body.querySelector("#gui__orbit-controls");
    orbitControlsButtonElement.addEventListener("click", enableOrbitControls);
    orbitControlsButton.addListener(({enabled}) => orbitControlsButtonElement.className = enabled ? "btn btn-primary" : "btn btn-default");

    /** @type {HTMLButtonElement} */
    const buildRoadsButtonElement = document.body.querySelector("#gui__build-roads");
    buildRoadsButtonElement.addEventListener("click", enableBuildRoads);
    buildRoadsButton.addListener(({enabled}) => buildRoadsButtonElement.className = enabled ? "btn btn-primary" : "btn btn-default");

    enableOrbitControls();
  }

  {
    terrain = terrain__buildTerrain(100, 100);
    scene.add(terrain);
    const raycaster = new THREE.Raycaster();
    let buildRoadsStartPosition;

    buildRoadsButton.addListener(() => buildRoadsStartPosition = null);

    const mouseLabel = document.getElementById("gui__mouse-label");
    dom__mouseEventListener("mousemove", (mouse) => {
      raycaster.setFromCamera(mouse, camera);
      const [intersection] = raycaster.intersectObjects([terrain]);
      if (intersection) {
        const position = terrain__pointToGridPosition(intersection.point);
        mouseLabel.textContent = "" + position.x.toFixed(2) + ", " + position.y.toFixed(2);
      } else {
        mouseLabel.textContent = "NONE";
      }
    });

    const mouseDownSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0x004400 }));
    mouseDownSphere.name = "mouseDownSphere";
    scene.add(mouseDownSphere);

    const mouseDownPointSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00FF00 }));
    mouseDownPointSphere.name = "mouseDownPointSphere";
    scene.add(mouseDownPointSphere);

    dom__mouseEventListener("mousedown", (mouse) => {
      raycaster.setFromCamera(mouse, camera);
      const [intersection] = raycaster.intersectObjects([terrain]);
      if (intersection) {
        const position = terrain__pointToGridPosition(intersection.point);
        mouseDownSphere.position.copy(terrain__gridPositionToPoint(position));
        mouseDownPointSphere.position.copy(terrain__gridPositionToPoint(position.clone().round()));
        buildRoadsStartPosition = position;
      }
    });

    const mouseUpSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000044 }));
    mouseUpSphere.name = "mouseUpSphere";
    scene.add(mouseUpSphere);

    const mouseUpPointSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0x0000FF }));
    mouseUpPointSphere.name = "mouseUpPointSphere";
    scene.add(mouseUpPointSphere);

    dom__mouseEventListener("mouseup", (mouse) => {
      raycaster.setFromCamera(mouse, camera);
      const [intersection] = raycaster.intersectObjects([terrain]);
      if (intersection) {
        const position = terrain__pointToGridPosition(intersection.point);
        mouseUpSphere.position.copy(terrain__gridPositionToPoint(position));
        mouseUpPointSphere.position.copy(terrain__gridPositionToPoint(position.clone().round()));
        if (buildRoadsButton.enabled) {
          buildRoads(buildRoadsStartPosition, position);
          buildRoadsStartPosition = null;
        }
      }
    });
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

  window.setInterval(() => storage__set("camera", camera.matrix.toArray()), 100);
  window.addEventListener("unload", () => storage__set("camera", camera.matrix.toArray()));
}

/**
 *
 * @param {number} currentTime
 */
function next(currentTime) {
  requestAnimationFrame(next);
  time__updateDelta(currentTime);
  orbitControls.update();
  renderer.render(scene, camera);
}

function main() {
  init();
  requestAnimationFrame(next);
}

window.addEventListener("DOMContentLoaded", main);
