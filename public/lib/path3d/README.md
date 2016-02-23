PathFinding3D.js
==============
#### A comprehensive path-finding library in javascript. ####

Forked from the 2D grid based [PathFinding.js](https://github.com/qiao/PathFinding.js) by [@qiao](https://github.com/qiao). Extended to general 3D graphs by [@schteppe](https://github.com/schteppe).

Introduction
------------

The aim of this project is to provide a path-finding library that can be easily incorporated into web games. It may run on Node.js or the browser.

It comes along with a [demo](visual) to show how the algorithms execute. (The pathfinding speed is slowed down in the demo).

Server
------

If you want to use it in Node.js, you may install it via `npm`.

```bash
npm install git://github.com/schteppe/PathFinding3D.js.git#master
```

Then, in your program:

```javascript
var PF = require('pathfinding');
```

Now skip to the `Basic Usage` section of this readme.


Browser
-------

Download the [minified js file](lib/pathfinding-browser.min.js) and include it in your web page.

```html
<script type="text/javascript" src="./pathfinding-browser.min.js"></script>
```

Basic Usage
-----------

The library comes with a 2D grid generator. It is convenient to use it rather than constructing all nodes manually.
To build a 2D grid-map of width 5 and height 3:

```javascript
var grid = new PF.Grid(5, 3);
// grid.nodes now contains an array of PF.Node instances
```

By default, all the nodes generated (```grid.nodes```) will be able to be walked through. To set whether a node at a given coordinate is walkable or not, use the `Grid.setWalkableAt` method.

For example, to set the node at (0, 1) to be un-walkable, where 0 is the x coordinate (from left to right), and 1 is the y coordinate (from up to down):

```javascript
grid.setWalkableAt(0, 1, false);
```

You may also pass in a matrix while instantiating the `PF.Grid` class. It will initiate all the nodes in the grid with the same walkability indicated by the matrix. 0 for walkable while 1 for blocked.

```javascript
var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
];
var grid = new PF.Grid(5, 3, matrix);
```

Currently there are 8 path-finders bundled in this library, namely:

*  `AStarFinder` *
*  `BreadthFirstFinder` *
*  `BestFirstFinder`
*  `DijkstraFinder` *
*  `BiAStarFinder`
*  `BiBestFirstFinder`
*  `BiDijkstraFinder` *
*  `BiBreadthFirstFinder` *

The suffix `Bi` for the last four finders in the above list stands for the bi-directional searching strategy.

Also, Note that only the finders with trailing asterisks are guaranteed to find the shortest path.

To build a path-finder, say, the `AStarFinder`:

```javascript
var finder = new PF.AStarFinder();
```

To find a path from (1, 2) to (4, 2), (Note: both the start point and end point should be walkable):

```javascript
var startNode = grid.getNodeAt(1, 2);
var endNode = grid.getNodeAt(4, 2);
var path = finder.findPath(startNode, endNode, grid.nodes);
```

`path` will be an array of coordinates including both the start and end positions.

For the `matrix` defined previously, the `path` will be:

```javascript
[ [ 1, 2, 0 ], [ 1, 1, 0 ], [ 2, 1, 0 ], [ 3, 1, 0 ], [ 3, 2, 0 ], [ 4, 2, 0 ] ]
```

Be aware that `grid` will be modified in each path-finding, and will not be usable afterwards. If you want to use a single grid multiple times, create a clone for it before calling `findPath`.

```javascript
var gridBackup = grid.clone();
```

If you do not want to use the ```Grid``` class, you can construct the nodes manually. Note that you will need to add all nodes and their neighbors.

```javascript
var nodes = [
    new PF.Node(0,0,0),
    new PF.Node(1,0,0),
    new PF.Node(2,0,0),
];
nodes[0].neighbors.push(nodes[1]);
nodes[1].neighbors.push(nodes[0],nodes[2]);
nodes[2].neighbors.push(nodes[1]);
var finder = new PF.AStarFinder();
var path = finder.findPath(nodes[0], nodes[2], nodes);
```


Advanced Usage
--------------

When instantiating path-finders, you may pass in additional parameters to indicate which specific strategies to use.

For `AStarFinder`, `BestFirstFinder` and all their `Bi` relatives, you may indicate which heuristic function to use.

The predefined heuristics are `PF.Heuristic.manhattan`(defalut), `PF.Heuristic.chebyshev` and `PF.Heuristic.euclidean`.

To use the chebyshev heuristic:

```javascript
var finder = new PF.AStarFinder({
    heuristic: PF.Heuristic.chebyshev
});
```

To build a `BestFirstFinder` with diagonal movement allowed and a custom heuristic function:

```javascript
var finder = new PF.BestFirstFinder({
    heuristic: function(dx, dy) {
        return Math.min(dx, dy);
    }
});
```

To smoothen the path, you may use `PF.Util.smoothenPath`. This routine will return
a new path with the original one unmodified.

```javascript
var newPath = PF.Util.smoothenPath(grid, path);
```

Note that the new path will be compressed as well, i.e. if the original path is
`[[0, 1], [0, 2], [0, 3], [0, 4]]`, then the new path will be `[[0, 1], [0, 4]]`.


Developement
------------

Layout:

    .
    |-- lib          # browser distribution
    |-- src          # source code (algorithms only)
    |-- test         # test scripts
    |-- utils        # build scripts
    `-- visual       # visualization

You will need to install `node.js` and use `npm` to install the dependencies:

    npm install -d

To build the browser distribution
(It will use [node-browserify](https://github.com/substack/node-browserify) to generate a browser distribution,
and use [UglifyJS](https://github.com/mishoo/UglifyJS) to compress):

    make

To run the tests
(algorithms only, not including the visualization) with
[mocha](http://visionmedia.github.com/mocha/) and [should.js](https://github.com/visionmedia/should.js)

    make test

License
-------

[MIT License](http://www.opensource.org/licenses/mit-license.php)

&copy; 2013 PathFinding3D.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
