{
  const LANE_WIDTH = 4;
  const RED = 0xFF0000;

  /**
   *
   * @param {(vecfn: (x: number, y: number, z: number) => void) => void} fn
   * @returns {THREE.Geometry}
   */
  function buildLineGeom(fn) {
    const geom = new THREE.Geometry();
    fn((x, y, z) => { geom.vertices.push(new THREE.Vector3(x, y, z)); });
    return geom;
  }

  /**
   *
   * @param {number} laneCount
   * @param {number} length
   */
  function road__buildSegment(laneCount, length) {
    const xOffset = laneCount / 2 * LANE_WIDTH;
    const innerLines = buildLineGeom((vec) => {
      for (let i = 1; i < laneCount; i++) {
        const x = -xOffset + i * LANE_WIDTH;
        vec(0, 0, x);
        vec(length, 0, x);
        console.log(x);
      }
    });
    const outerLines = buildLineGeom((vec) => {
      vec(0, 0, -xOffset);
      vec(length, 0, -xOffset);
      vec(0, 0, xOffset);
      vec(length, 0, xOffset);
      console.log(xOffset, -xOffset);
    });
    const container = new THREE.Object3D();
    const lines = new THREE.LineSegments(outerLines, new THREE.LineBasicMaterial( { color: RED } ));
    lines.name = "outer lines";
    container.add(lines);
    const dashedLine = new THREE.LineSegments(innerLines, new THREE.LineDashedMaterial( { color: RED, dashSize: 4, gapSize: 4 } ));
    dashedLine.computeLineDistances();
    dashedLine.name = "dashed lines";
    container.add(dashedLine);
    container.name = "road container; laneCount=" + laneCount + ", length=" + length;
    return container;
  }

  window.road__buildSegment = road__buildSegment;
}
