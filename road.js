{
  const LANE_WIDTH = 4;
  const PATH_WIDTH = 2;
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
        vec(0, 0, x); vec(length, 0, x);
      }
    });
    const outerLines = buildLineGeom((vec) => {
      vec(0, 0, -xOffset - PATH_WIDTH); vec(length, 0, -xOffset - PATH_WIDTH);
      vec(0, 0, -xOffset); vec(length, 0, -xOffset);
      vec(0, 0, xOffset); vec(length, 0, xOffset);
      vec(0, 0, xOffset + PATH_WIDTH); vec(length, 0, xOffset + PATH_WIDTH);
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

  class RoadManager {
    constructor() {
      this.object = new THREE.Object3D();

      /** @type {Record<string, { xp: number, xn: number, yp: number, yn: number }>} */
      this.grid = {};
    }

    /**
     *
     * @param {THREE.Vector2} p1 grid point 1
     * @param {THREE.Vector2} p2 grid point 2
     * @param {number} laneCount
     */
    addGridAlignedRoad(p1, p2, laneCount) {
      p1 = p1.clone().round();
      p2 = p2.clone().round();

      const diff = p2.clone().sub(p1);
      const abs = new THREE.Vector2(Math.abs(diff.x), Math.abs(diff.y));
      const isX = abs.x > abs.y ? true : false;

      const nordir = isX ? "x" : "y";
      const invdir = isX ? "y" : "x";

      this.writeRoadLanes(p1, isX, p2[nordir] - p1[nordir], laneCount);
      this.writeRoadLanes(p2, !isX, p1[invdir] - p2[invdir], laneCount);
    }

    writeRoadLanes(point, isX, length, laneCount) {
      const base = isX ? "y" : "x";
      const baseCoord = point[base];
      const sign = Math.sign(length);
      length = Math.abs(length);

      const dir = (isX ? "x" : "y");
      const nordirkey = dir + (sign > 0 ? "p" : "n");
      const invdirkey = dir + (sign > 0 ? "n" : "p");

      for (let i = 0; i <= length; i++) {
        const offset = point[dir] + i * sign;
        const key = isX ? `${offset}x${baseCoord}` : `${baseCoord}x${offset}`;
        if (!this.grid[key]) {
          this.grid[key] = {};
        }
        if (i > 0) {
          this.grid[key][invdirkey] = laneCount;
        }
        if (i < length) {
          this.grid[key][nordirkey] = laneCount;
        }
      }
    }

    rebuildRoads() {
      this.object.remove.call(this.object, this.object.children);

      for (const {p1, p2, laneCount} of this.roads) {
        const diff = p2.clone().sub(p1);
        const abs = new THREE.Vector2(Math.abs(diff.x), Math.abs(diff.y));
        const length = Math.round(abs.x > abs.y ? abs.x : abs.y) * TERRAIN__GRID_SIZE;
        const roadObject = road__buildSegment(laneCount, length);
        roadObject.position.copy(terrain__gridPositionToPoint(p1));
        roadObject.rotateY(-diff.angle());
        this.object.add(roadObject);
      }
    }
  }

  window.road__buildSegment = road__buildSegment;
  window.RoadManager = RoadManager;
}

if (window.test) {
  const expect = chai.expect;

  suite("road", () => {
    suite("RoadManager()", () => {
      test("addGridAlignedRoad updates grid", () => {
        let manager = new RoadManager();
        manager.addGridAlignedRoad(new THREE.Vector2(0, 0), new THREE.Vector2(3, 2), 2);
        console.log(manager.grid);
        expect(manager.grid).to.deep.eq({
          "0x0": { xp: 2 },
          "1x0": { xp: 2, xn: 2 },
          "2x0": { xp: 2, xn: 2 },
          "3x0": { xn: 2, yp: 2 },
          "3x1": { yp: 2, yn: 2 },
          "3x2": { yn: 2 },
        });
      });
    });
  });
}
