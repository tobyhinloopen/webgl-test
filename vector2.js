/** @typedef {{x: number, y: number}} Vector2 */
/** @typedef {[Vector2, Vector2]} Line2 */

/**
 *
 * @param {Segment2} segment1
 * @param {Segment2} segment2
 */
function vector2__distanceBetweenSegments(segment1, segment2) {

}

/**
 *
 * @param {Vector2} point
 * @param {[Vector2, Vector2]} line a line represented by 2 points
 * @see https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
 */

function vector2__distanceFromPointToLine(point, line) {
  const x0 = +point.x;
  const y0 = +point.y;

  const x1 = +line[0].x;
  const y1 = +line[0].y;

  const x2 = +line[1].x;
  const y2 = +line[1].y;

  const yd = y2-y1;
  const xd = x2-x1;

  return ( yd*x0 - xd*y0 + x2*y1 - y2*x1 ) / Math.sqrt( yd*yd + xd*xd );
}

if (window.test) {
  const expect = chai.expect;
  suite("vector2", () => {
    suite("distanceFromPointToLine", () => {
      test("calculate distance to line, inside segment", () => {
        expect(vector2__distanceFromPointToLine({ x: 10, y: 10 }, [{ x: -1, y: 0 }, { x: -1, y: 20 }])).to.closeTo(11, 0.01);
      });

      test("calculate distance to line, outside segment", () => {
        expect(vector2__distanceFromPointToLine({ x: 10, y: 10 }, [{ x: 10, y: 20 }, { x: 11, y: 30 }])).to.closeTo(1, 0.01);
      });
    });
  });
}
