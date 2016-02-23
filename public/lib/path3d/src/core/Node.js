var idCounter = 0;

/**
 * A node in grid.
 * This class holds some basic information about a node and custom
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node
 * @param {number} y - The y coordinate of the node
 * @param {number} z - The z coordinate of the node
 */
function Node(x, y, z) {
    /**
     * The x coordinate of the node on the grid.
     * @type number
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @type number
     */
    this.y = y;
    /**
     * The z coordinate of the node on the grid.
     * @type number
     */
    this.z = z;
    /**
     * Neighboring nodes that are walkable from this node.
     * @type array
     */
    this.neighbors = [];
};

module.exports = Node;
