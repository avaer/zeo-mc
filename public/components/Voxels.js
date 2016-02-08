import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';
import voxel from 'voxel';
import voxelEngine from 'voxel-engine';
import voxelTerrain from '../lib/voxel-terrain/index';
import voxelSky from '../lib/voxel-sky/index';
import voxelClouds from 'voxel-clouds';
import voxelPlayer from 'voxel-player';
import voxelWalk from 'voxel-walk';
import voxelHighlight from 'voxel-highlight';
import voxelDebris from '../lib/voxel-debris/index';
import * as voxelAsync from '../lib/voxel-async/index';

import * as inputUtils from '../utils/input/index';
import {CHUNK_SIZE, CHUNK_DISTANCE, NUM_WORKERS} from '../constants/index';
import {BLOCKS} from '../resources/index';

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

    this.callWorker('generate', [
      [0, 0, 0]
    ], (err, result) => {
      console.log('got worker error result', {err, result});
    });
  }

  componentDidMount() {
    const game = voxelEngine({
      // generate: voxelPerlinTerrain({scaleFactor:10}),
      // generate: voxelSimplexTerrain({seed: 'lol', scaleFactor: 10, chunkDistance: CHUNK_DISTANCE}),
      generateChunks: false,
      texturePath: './api/img/textures/',
      // texturePath: name => '/api/img/textures/' + name + '.png',
      materials: BLOCKS.MATERIALS,
      chunkSize: CHUNK_SIZE,
      chunkDistance: CHUNK_DISTANCE,
      lightsDisabled: true
    });

    game.voxels.on('missingChunk', function(position) {
      console.log('missingChunk', position);
      const chunk = voxelAsync.generateSync(position);
      game.showChunk(chunk);
    });

    const sky = voxelSky({
      game,
      time: 800,
      // size: 32,
      // color: new THREE.Color(0, 0, 0),
      speed: 0.01
    });
    game.setInterval(function() {
      sky(15);
    }, 15);

    const avatar = voxelPlayer(game)('api/img/textures/player.png');
    avatar.position.set(0, 32, 0);
    avatar.yaw.position.set(2, 14, 4);
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

    const clouds = voxelClouds({
      game,
      // size: 32,
      // color: new THREE.Color(0, 0, 0),
      speed: 0.01
    });
    game.on('tick', function(dt) {
      clouds.tick(dt);
    });

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
    $(game.view.element).on('mousedown', function() {
      const cp = game.cameraPosition();
      const cv = game.cameraVector();
      const pos = game.raycastVoxels(cp, cv, CHUNK_SIZE).voxel;
      if (pos) {
        voxelDebrisExplode(pos);
      }
    });

    // game.mesher = voxel.meshers.greedy;
    game.mesher = voxelAsync.mesher;

    window.game = game;
    window.voxel = voxel;

    const $domNode = this.getDomNode();
    game.appendTo($domNode[0]);
  }

  shouldComponentUpdate() {
    return false;
  }

  getDomNode() {
    return $(ReactDom.findDOMNode(this));
  }

  callWorker(method, args, cb) {
    const worker = this._workers[this._workerIndex++];

    worker.postMessage({method, args});
    worker.onmessage = resMsg => {
      const {data: res} = resMsg;
      const {error} = res;
      if (!error) {
        const {result} = res;
        cb(null, result);
      } else {
        cb(null, error);
      }
    };
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
    const worker = new Worker('/static/voxel-worker.js');
    worker.onerror, err => {
      console.warn('worker error', err);
    };
    workers.push(worker);
  }
  return workers;
}
