{
  const GRID_SIZE = 10;

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  function terrain__buildTerrain(width, height) {
    const geometry = new THREE.PlaneBufferGeometry(GRID_SIZE * width, GRID_SIZE * height);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(-90 * deg2rad);
    return plane;
  }

  /**
   *
   * @param {THREE.Vector3} point
   */
  function terrain__pointToGridPosition(point) {
    const position = new THREE.Vector2();
    position.x = point.x / GRID_SIZE;
    position.y = point.z / GRID_SIZE;
    return position;
  }

  window.terrain__buildTerrain = terrain__buildTerrain;
  window.terrain__pointToGridPosition = terrain__pointToGridPosition;
}
