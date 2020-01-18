const TERRAIN__GRID_SIZE = 10;

/**
 *
 * @param {number} width
 * @param {number} height
 */
function terrain__buildTerrain(width, height) {
  const geometry = new THREE.PlaneBufferGeometry(TERRAIN__GRID_SIZE * width, TERRAIN__GRID_SIZE * height);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotateX(-90 * deg2rad);
  plane.name = "terrain";
  return plane;
}

/**
 *
 * @param {THREE.Vector3} point
 */
function terrain__pointToGridPosition(point) {
  const position = new THREE.Vector2();
  position.x = point.x / TERRAIN__GRID_SIZE;
  position.y = point.z / TERRAIN__GRID_SIZE;
  return position;
}

function terrain__gridPositionToPoint(grid) {
  const point = new THREE.Vector3();
  point.x = grid.x * TERRAIN__GRID_SIZE;
  point.y = 1;
  point.z = grid.y * TERRAIN__GRID_SIZE;
  return point;
}
