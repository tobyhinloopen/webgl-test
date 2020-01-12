{
  const FLOOR_HEIGHT = 3;
  const RED = 0xFF0000;
  const BLACK = 0x000000;

  const RADIUS = 10;
  const INNER_RADIUS = 9;
  const DOORMAT_HALFWIDTH = 2;
  const DOORMAT_DEPTH = 1;

  const DOORHALL_HALFWIDTH = 1.8;
  const DOORHALL_HEIGHT = 2;

  const RAILING_HEIGHT = 1;
  const HALLWAY_HALFWIDTH = 4;
  const RAILING_SEPERATOR_BACK = -3;
  const RAILING_SEPERATOR_FRONT = -2;
  const RAILING_SEPERATOR_OFFSET = 0.5;

  /**
   *
   * @param {(vecfn: (x: number, y: number, z: number) => void) => void} fn
   * @returns {THREE.Geometry}
   */
  function buildLineGeom(fn) {
    const geom = new THREE.Geometry();
    fn((x, y, z) => { geom.vertices.push(new THREE.Vector3(x, z, y)); });
    return geom;
  }

  /**
   *
   * @param {number} floors
   */
  function apartment__build(floors) {
    const container = new THREE.Object3D();

    /** @type {THREE.Geometry} */
    const lineGeoms = [];

    // Front floormat
    lineGeoms.push(buildLineGeom((vecfn) => {
      vecfn(RADIUS, -DOORMAT_HALFWIDTH, 0);
      vecfn(RADIUS + DOORMAT_DEPTH, -DOORMAT_HALFWIDTH, 0);
      vecfn(RADIUS + DOORMAT_DEPTH, DOORMAT_HALFWIDTH, 0);
      vecfn(RADIUS, DOORMAT_HALFWIDTH, 0);
    }));

    // Front lines
    lineGeoms.push(buildLineGeom((vecfn) => {
      vecfn(RADIUS, RADIUS, 0);
      vecfn(RADIUS, DOORHALL_HALFWIDTH, 0);
      vecfn(RADIUS, DOORHALL_HALFWIDTH, DOORHALL_HEIGHT);
      vecfn(RADIUS, -DOORHALL_HALFWIDTH, DOORHALL_HEIGHT);
      vecfn(RADIUS, -DOORHALL_HALFWIDTH, 0);
      vecfn(RADIUS, -RADIUS, 0);
      vecfn(RADIUS, -RADIUS, RAILING_HEIGHT);
      vecfn(RADIUS, -HALLWAY_HALFWIDTH, RAILING_HEIGHT);

      for (let currentFloor = 1; currentFloor < floors; currentFloor++) {
        const floorZ = FLOOR_HEIGHT * currentFloor;

        vecfn(RADIUS, -HALLWAY_HALFWIDTH, floorZ);
        vecfn(RADIUS, -RADIUS, floorZ);
        vecfn(RADIUS, -RADIUS, floorZ + RAILING_HEIGHT);
        vecfn(RADIUS, -HALLWAY_HALFWIDTH, floorZ + RAILING_HEIGHT);
      }

      const topZ = FLOOR_HEIGHT * floors;
      vecfn(RADIUS, -HALLWAY_HALFWIDTH, topZ);
      vecfn(RADIUS, -RADIUS, topZ);
      vecfn(RADIUS, -RADIUS, topZ + RAILING_HEIGHT);
      vecfn(RADIUS, RADIUS, topZ + RAILING_HEIGHT);
      vecfn(RADIUS, RADIUS, topZ);
      vecfn(RADIUS, HALLWAY_HALFWIDTH, topZ);

      for (let currentFloor = floors - 1; currentFloor > 0; currentFloor--) {
        const floorZ = FLOOR_HEIGHT * currentFloor;

        vecfn(RADIUS, HALLWAY_HALFWIDTH, floorZ + RAILING_HEIGHT);
        vecfn(RADIUS, RADIUS, floorZ + RAILING_HEIGHT);
        vecfn(RADIUS, RADIUS, floorZ);
        vecfn(RADIUS, HALLWAY_HALFWIDTH, floorZ);
      }

      vecfn(RADIUS, HALLWAY_HALFWIDTH, RAILING_HEIGHT);
      vecfn(RADIUS, RADIUS, RAILING_HEIGHT);
      vecfn(RADIUS, RADIUS, 0);
    }));

    const buildSideGeom = (side) => buildLineGeom((vecfn) => {
      vecfn(RADIUS, side, 0);
      vecfn(-RADIUS, side, 0);
      vecfn(-RADIUS, side, RAILING_HEIGHT);
      vecfn(RAILING_SEPERATOR_BACK, side, RAILING_HEIGHT);

      for (let currentFloor = 1; currentFloor < floors; currentFloor++) {
        const floorZ = FLOOR_HEIGHT * currentFloor;
        vecfn(RAILING_SEPERATOR_BACK, side, floorZ);
        vecfn(-RADIUS, side, floorZ);
        vecfn(-RADIUS, side, floorZ + RAILING_HEIGHT);
        vecfn(RAILING_SEPERATOR_BACK, side, floorZ + RAILING_HEIGHT);
      }

      const topZ = FLOOR_HEIGHT * floors;
      vecfn(RAILING_SEPERATOR_BACK, side, topZ);
      vecfn(-RADIUS, side, topZ);
      vecfn(-RADIUS, side, topZ + RAILING_HEIGHT);
      vecfn(RADIUS, side, topZ + RAILING_HEIGHT);
      vecfn(RADIUS, side, topZ);
      vecfn(RAILING_SEPERATOR_FRONT, side, topZ);

      for (let currentFloor = floors - 1; currentFloor > 0; currentFloor--) {
        const floorZ = FLOOR_HEIGHT * currentFloor;
        vecfn(RAILING_SEPERATOR_FRONT, side, floorZ + RAILING_HEIGHT);
        vecfn(RADIUS, side, floorZ + RAILING_HEIGHT);
        vecfn(RADIUS, side, floorZ);
        vecfn(RAILING_SEPERATOR_FRONT, side, floorZ);
      }

      vecfn(RAILING_SEPERATOR_FRONT, side, RAILING_HEIGHT);
      vecfn(RADIUS, side, RAILING_HEIGHT);
      vecfn(RADIUS, side, 0);
    });

    // sides
    lineGeoms.push(buildSideGeom(-RADIUS));
    lineGeoms.push(buildSideGeom(RADIUS));

    // back
    lineGeoms.push(buildLineGeom((vecfn) => {
      vecfn(-RADIUS, -RADIUS, 0);
      vecfn(-RADIUS, RADIUS, 0);
      vecfn(-RADIUS, RADIUS, RAILING_HEIGHT);
      vecfn(-RADIUS, RAILING_SEPERATOR_OFFSET, RAILING_HEIGHT);


      for (let currentFloor = 1; currentFloor < floors; currentFloor++) {
        const floorZ = FLOOR_HEIGHT * currentFloor;
        vecfn(-RADIUS, RAILING_SEPERATOR_OFFSET, floorZ);
        vecfn(-RADIUS, RADIUS, floorZ);
        vecfn(-RADIUS, RADIUS, floorZ + RAILING_HEIGHT);
        vecfn(-RADIUS, RAILING_SEPERATOR_OFFSET, floorZ + RAILING_HEIGHT);
      }

      const topZ = FLOOR_HEIGHT * floors;
      vecfn(-RADIUS, RAILING_SEPERATOR_OFFSET, topZ);
      vecfn(-RADIUS, RADIUS, topZ);
      vecfn(-RADIUS, RADIUS, topZ + RAILING_HEIGHT);
      vecfn(-RADIUS, -RADIUS, topZ + RAILING_HEIGHT);
      vecfn(-RADIUS, -RADIUS, topZ);
      vecfn(-RADIUS, -RAILING_SEPERATOR_OFFSET, topZ);

      for (let currentFloor = floors - 1; currentFloor > 0; currentFloor--) {
        const floorZ = FLOOR_HEIGHT * currentFloor;
        vecfn(-RADIUS, -RAILING_SEPERATOR_OFFSET, floorZ + RAILING_HEIGHT);
        vecfn(-RADIUS, -RADIUS, floorZ + RAILING_HEIGHT);
        vecfn(-RADIUS, -RADIUS, floorZ);
        vecfn(-RADIUS, -RAILING_SEPERATOR_OFFSET, floorZ);
      }

      vecfn(-RADIUS, -RAILING_SEPERATOR_OFFSET, RAILING_HEIGHT);
      vecfn(-RADIUS, -RADIUS, RAILING_HEIGHT);
      vecfn(-RADIUS, -RADIUS, 0);
    }));

    const lineGeometryComposite = new THREE.Geometry();
    for (const geom of lineGeoms) {
      lineGeometryComposite.merge(geom);
    }
    container.add(new THREE.Line(lineGeometryComposite, new THREE.LineBasicMaterial( { color: RED } )));

    {
      const innerHeight = FLOOR_HEIGHT * floors + RAILING_HEIGHT;
      const geometry = new THREE.BoxGeometry(INNER_RADIUS * 2, innerHeight, INNER_RADIUS * 2);
      const material = new THREE.MeshBasicMaterial({ color: BLACK });
      cubeMesh = new THREE.Mesh( geometry, material );
      cubeMesh.position.y = innerHeight / 2;
      container.add(cubeMesh);
    }

    return container;
  }

  window.apartment__build = apartment__build;
}
