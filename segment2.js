// Based on https://github.com/scottglz/distance-to-line-segment/blob/master/index.js

/**
 * Calculate the square of the distance between a finite line segment and a point. This
 * version takes somewhat less convenient parameters than distanceToLineSegment.squared,
 * but is more efficient if you are calling it multiple times for the same line segment,
 * since you pass in some easily pre-calculated values for the segment.
 * @param {number} lx1 - x-coordinate of line segment's first point
 * @param {number} ly1 - y-coordinate of line segment's first point
 * @param {number} ldx - x-coordinate of the line segment's second point minus lx1
 * @param {number} ldy - y-coordinate of the line segment's second point minus ly1
 * @param {number} lineLengthSquared - must be ldx\*ldx + ldy\*ldy. Remember, this precalculation
 *    is for efficiency when calling this multiple times for the same line segment.
 * @param {number} px - x coordinate of point
 * @param {number} py - y coordinate of point
 */
function segment2__distanceSquaredToLineSegmentLength(lx1, ly1, ldx, ldy, lineLengthSquared, px, py) {
  /** @type {number} */
  let t;
  if (lineLengthSquared === 0) {
    t = 0;
  } else {
    t = ((px - lx1) * ldx + (py - ly1) * ldy) / lineLengthSquared;
    if (t < 0) { t = 0; }
    else if (t > 1) { t = 1; }
  }

  const lx = lx1 + t * ldx;
  const ly = ly1 + t * ldy;
  const dx = px - lx
  const dy = py - ly;
  return dx*dx + dy*dy;
}

/**
 * Calculate the square of the distance between a finite line segment and a point.
 * @param {number} lx1 - x-coordinate of line segment's first point
 * @param {number} ly1 - y-coordinate of line segment's first point
 * @param {number} lx2 - x-coordinate of the line segment's second point
 * @param {number} ly2 - y-coordinate of the line segment's second point
 * @param {number} px - x coordinate of point
 * @param {number} py - y coordinate of point
 */
function segment2__distanceSquaredToLineSegment(lx1, ly1, lx2, ly2, px, py) {
  const ldx = lx2 - lx1;
  const ldy = ly2 - ly1;
  const lineLengthSquared = ldx*ldx + ldy*ldy;
  return segment2__distanceSquaredToLineSegmentLength(lx1, ly1, ldx, ldy, lineLengthSquared, px, py);
}

/**
 * Calculate the distance between a finite line segment and a point. Using distanceToLineSegment.squared can often be more efficient.
 * @param {number} lx1 - x-coordinate of line segment's first point
 * @param {number} ly1 - y-coordinate of line segment's first point
 * @param {number} lx2 - x-coordinate of the line segment's second point
 * @param {number} ly2 - y-coordinate of the line segment's second point
 * @param {number} px - x coordinate of point
 * @param {number} py - y coordinate of point
 */
function segment2__distanceToLineSegment(lx1, ly1, lx2, ly2, px, py) {
  return Math.sqrt(segment2__distanceSquaredToLineSegment(lx1, ly1, lx2, ly2, px, py));
}

if (window.test) {
  const expect = chai.expect;

  suite("segment2", () => {
    suite("distanceToLineSegment()", () => {
      test("calculate distance to point", () => {
        expect(segment2__distanceToLineSegment(10, 20, 10, 30, 10, 0)).to.equal(20);
      });
    });
  });
}
