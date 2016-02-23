var Heap       = require('../core/Heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');

/**
 * A* path-finder that considers the turns made during the path.
 * based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance (defaults to manhattan).
 * @param {integer} opt.weight Weight to apply to the heuristic to allow for suboptimal paths, in order to speed up the search.
 * @param {integer} opt.turnAngleWeight Weight to apply to the turn value, to make the algorithm take paths with less turns.
 */
function AStarFinderMinTurns(opt) {
    opt = opt || {};
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
    this.turnAngleWeight = opt.turnAngleWeight || 1;
}

/**
 * Find and return the the path.
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
AStarFinderMinTurns.prototype.findPath = function(startNode, endNode, nodes) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        heuristic = this.heuristic,
        weight = this.weight,
        turnAngleWeight = this.turnAngleWeight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, z, ng;

    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // if reached the end position, construct the path and return it
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // get neigbours of the current node
        neighbors = node.neighbors;
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;
            z = neighbor.z;

            // Get the angle between the current node line and the neighbor line
            // cos(theta) = a.dot(b) / (len(a)*len(b))
            var angle = 0;
            if(node.parent){
                var ax = x - node.x,
                    ay = y - node.y,
                    az = z - node.z,
                    bx = node.x - node.parent.x,
                    by = node.y - node.parent.y,
                    bz = node.z - node.parent.z;

                angle = Math.abs( Math.acos( (ax*bx + ay*by + az*bz) / ( Math.sqrt(ax*ax + ay*ay + az*az) ) + Math.sqrt(bx*bx + by*by + bz*bz) ) );
            }

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + Math.sqrt(Math.pow(x - node.x,2) + Math.pow(y - node.y,2) + Math.pow(z-node.z,2)) + angle*turnAngleWeight;

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endNode.x), abs(y - endNode.y), abs(z - endNode.z));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

module.exports = AStarFinderMinTurns;
