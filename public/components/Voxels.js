import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';
import voxel from 'voxel';
import voxelEngine from '../lib/voxel-engine/index';
import voxelTerrain from '../lib/voxel-terrain/index';
import voxelSky from '../lib/voxel-sky/index';
import voxelClouds from 'voxel-clouds';
import voxelPlayer from 'voxel-player';
import voxelWalk from 'voxel-walk';
import voxelHighlight from 'voxel-highlight';
import voxelDebris from '../lib/voxel-debris/index';
import * as voxelAsync from '../lib/voxel-async/index';

import * as inputUtils from '../utils/input/index';
import {CHUNK_SIZE, CHUNK_DISTANCE, INITIAL_POSITION, GRAVITY, NUM_WORKERS} from '../constants/index';
import {BLOCKS, MODELS} from '../resources/index';

window.MODELS = MODELS;

const INITIAL_CHUNK_POSITIONS = (() => {
  const result = [];
  for (let x = -CHUNK_DISTANCE; x <= CHUNK_DISTANCE; x++) {
    for (let y = -CHUNK_DISTANCE; y <= CHUNK_DISTANCE; y++) {
      for (let z = -CHUNK_DISTANCE; z <= CHUNK_DISTANCE; z++) {
        const position = [x, y, z];
        result.push(position);
      }
    }
  }
  return result;
})();

class Crosshair extends React.Component {
  render() {
    const style = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      margin: '-2px 0 0 -2px',
      width: '4px',
      height: '4px',
      backgroundColor: '#d00'
    };

    return <div style={style} />;
  }
}

export default class Voxels extends React.Component {
  componentWillMount() {
    this._workers = _makeWorkers();
    this._workerIndex = 0;
    this._pendingGenerates = new Map();
  }

  componentDidMount() {
    let game, avatar;

    const initializeGame = cb => {
      game = voxelEngine({
        // generate: voxelPerlinTerrain({scaleFactor:10}),
        // generate: voxelSimplexTerrain({seed: 'lol', scaleFactor: 10, chunkDistance: CHUNK_DISTANCE}),
        generateChunks: false,
        mesher: voxelAsync.mesher,
        texturePath: './api/img/textures/blocks/',
        // texturePath: name => '/api/img/textures/' + name + '.png',
        materials: BLOCKS.MATERIALS,
        chunkSize: CHUNK_SIZE,
        chunkDistance: CHUNK_DISTANCE,
        lightsDisabled: true,
        gravity: GRAVITY
      });
      window.game = game;
      window.voxel = voxel;

      const sky = voxelSky({
        game,
        time: 800,
        // color: new THREE.Color(0, 0, 0),
        speed: 0.01
      });
      game.setInterval(function() {
        sky(15);
      }, 15);

      // game.camera.position.set(INITIAL_POSITION[0], INITIAL_POSITION[1], INITIAL_POSITION[2]);

      avatar = voxelPlayer(game)('api/img/textures/avatar/player.png');
      avatar.position.set(INITIAL_POSITION[0], INITIAL_POSITION[1], INITIAL_POSITION[2]);
      // avatar.yaw.position.set(2, 14, 4);
      avatar.possess();
      game.on('tick', function(dt) {
        voxelWalk.render(avatar.playerSkin);

        const vx = Math.abs(avatar.velocity.x);
        const vz = Math.abs(avatar.velocity.z);
        if (vx > 0.001 || vz > 0.001) {
          voxelWalk.stopWalking();
        } else {
          voxelWalk.startWalking();
        }
      });
      avatar.forces.x = 0;;
      avatar.forces.y = 0;;
      avatar.forces.z = 0;;

      const clouds = voxelClouds({
        game,
        // size: 32,
        // color: new THREE.Color(0, 0, 0),
        speed: 0.01
      });
      game.on('tick', function(dt) {
        clouds.tick(dt);
      });

      const $domNode = this.getDomNode();
      game.appendTo($domNode[0]);

      game.paused = false;
    };

    const generateInitialChunks = cb => {
      let doneChunks = 0;
      for (let i = 0; i < INITIAL_CHUNK_POSITIONS.length; i++) {
        const position = INITIAL_CHUNK_POSITIONS[i];
        this.generateAsync(position, chunk => {
          game.showChunk(chunk);

          doneChunks++;
          if (doneChunks >= INITIAL_CHUNK_POSITIONS.length) {
            cb();
          }
        });
      }
    };

    const startGame = () => {
      game.paused = false;

      game.voxels.on('missingChunk', position => {
        console.log('missingChunk', position);
        this.generateAsync(position, chunk => {
          console.log('genetatedChunk', position);

          game.showChunk(chunk);
        });
      });

      avatar.subjectTo(GRAVITY);

      const highlight = voxelHighlight(game, {
        distance: CHUNK_SIZE,
        color: 0xFF0000
      });

      const voxelDebrisExplode = voxelDebris(game, {
        power: 1,
        expire: {
          start: 1 * 1000,
          end: 3 * 1000
        }
      });

      $(game.view.element).on('mousedown', e => {
        const cp = game.cameraPosition();
        const cv = game.cameraVector();
        const pos = game.raycastVoxels(cp, cv, CHUNK_SIZE).voxel;
        if (pos) {
          voxelDebrisExplode(pos);
        }
      });
    };

    initializeGame(generateInitialChunks(startGame));
  }

  shouldComponentUpdate() {
    return false;
  }

  getDomNode() {
    return $(ReactDom.findDOMNode(this));
  }

  callWorker(method, args, cb) {
    const workerIndex = this._workerIndex;
    const worker = this._workers[workerIndex];
    this._workerIndex = (workerIndex + 1) % this._workers.length;

    worker.call(method, args, cb);
  }

  generateAsync(position, cb) {
    const positionKey = _positionKey(position);
    let cbs = this._pendingGenerates.get(positionKey);
    if (!cbs) {
      cbs = [];
      this._pendingGenerates.set(positionKey, cbs)

      this.callWorker('generate', [position], (err, chunk) => {
        this._pendingGenerates.delete(positionKey);

        if (!err) {
          cbs.forEach(cb => {
            cb(chunk);
          });
        } else {
          console.warn(err);
        }
      });
    }
    cbs.push(cb);
  }

  render() {
    return (
      <div>
        <Crosshair />
      </div>
    );
  }
}

function _makeWorkers() {
  const workers = [];
  for (let i = 0; i < NUM_WORKERS; i++) {
    (() => {
      const worker = new Worker('/static/voxel-worker.js');
      worker.call = (method, args, cb) => {
        const type = 'request';
        worker.postMessage({type, method, args});
        cbs.push(cb);
      };
      const cbs = [];
      worker.onmessage = resMsg => {
        const {data: res} = resMsg;
        const {type} = res;
        if (type === 'response') {
          const cb = cbs.shift();

          const {error} = res;
          if (!error) {
            const {result} = res;
            cb(null, result);
          } else {
            cb(null, error);
          }
        }
      };
      worker.onerror, err => {
        console.warn('worker error', err);
      };
      workers.push(worker);
    })();
  }
  return workers;
}

function _positionKey(position) {
  return position.join(',');
}
