import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';
import THREE from 'three';

import staticAtlaspackLoader from '../../lib/static-atlaspack/loader';
import voxelEngine from '../lib/voxel-engine/index';
import voxelWorkerPool from '../lib/voxel-worker-pool/index';
import voxelTextureAtlas from '../lib/voxel-texture-atlas/index';
import voxelTextureLoader from '../lib/voxel-texture-loader/index';
import voxelSky from '../lib/voxel-sky/index';
import voxelClouds from '../lib/voxel-clouds/index';
import voxelPlayer from '../lib/voxel-player/index';
import voxelWalk from '../lib/voxel-walk/index';
import voxelHighlight from '../lib/voxel-highlight/index';
import voxelConstruct from '../lib/voxel-construct/index';
import voxelPortal from '../lib/voxel-portal/index';
import * as voxelAsync from '../lib/voxel-async/index';

import * as inputUtils from '../utils/input/index';
import {CHUNK_SIZE, CHUNK_DISTANCE, FRAME_RATE, WORLD_TICK_RATE, INITIAL_POSITION, GRAVITY, NUM_WORKERS} from '../constants/index';
import {BLOCKS} from '../../metadata/index';
import configJson from '../../config/index.json';

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

export default class VoxelScene extends React.Component {
  componentWillMount() {
    this._game = null;
    this._workerPool = null;
  }

  componentDidMount() {
    const {width, height, engines} = this.props;

    let textureAtlas, textureLoader, game, avatar;

    const loadTextures = cb => {
      (() => {
        let pending = 2;
        function pend() {
          if (--pending === 0) {
            cb();
          }
        }

        staticAtlaspackLoader({
          jsonUrl: configJson.apiPrefix + '/img/atlas.json',
          imgUrl: configJson.apiPrefix + '/img/atlas.png',
        }, (err, atlas) => {
          if (err) {
            console.warn(err);
          }

          textureAtlas = voxelTextureAtlas({
            atlas,
            materials: BLOCKS.MATERIALS,
            frames: BLOCKS.FRAMES,
            THREE
          });

          pend();
        });

        textureLoader = voxelTextureLoader({
          getTextureUrl: texture => configJson.apiPrefix + '/img/' + texture + '.png',
          THREE
        });
        textureLoader.loadTextures([
          'particles/rain',
          'items/greenapple',
          'items/flare',
          'items/portalred',
          'items/portalblue',
        ], err => {
          if (err) {
            console.warn(err);
          }

          pend();
        });
      })();
    };

    const initializeWorkers = cb => {
      const {seed} = this.props;
      const chunkSize = CHUNK_SIZE;
      const {_faceNormalMaterials: faceNormalMaterials, _blockMeshFaceFrameUvs: blockMeshFaceFrameUvs, _planeMeshFrameUvs: planeMeshFrameUvs} = textureAtlas;
      const voxelAsyncOpts = {seed, chunkSize, faceNormalMaterials, blockMeshFaceFrameUvs, planeMeshFrameUvs};
      voxelAsync.init(voxelAsyncOpts);

      const workerOpts = voxelAsyncOpts;
      const numWorkers = NUM_WORKERS;
      const workerPool = voxelWorkerPool({workerOpts, numWorkers});
      this._workerPool = workerPool;

      cb();
    };

    const initializeGame = cb => {
      game = voxelEngine({
        width,
        height,
        textureAtlas,
        textureLoader,
        generateChunks: false,
        chunkSize: CHUNK_SIZE,
        chunkDistance: CHUNK_DISTANCE,
        frameRate: FRAME_RATE,
        worldTickRate: WORLD_TICK_RATE,
        lightsDisabled: true,
        gravity: GRAVITY,
        statsDisabled: true
      });
      this._game = game;
      window.game = game;

      const sky = voxelSky({
        game,
        time: 800,
        speed: 0.01
      });
      game.setInterval(function() {
        sky(15);
      }, 15);

      avatar = voxelPlayer(game)('api/img/avatar/player.png');
      avatar.position.set(INITIAL_POSITION[0], INITIAL_POSITION[1], INITIAL_POSITION[2]);
      avatar.possess();
      game.on('tick', function(dt) {
        voxelWalk.render(avatar);

        const vx = Math.abs(avatar.velocity.x);
        const vz = Math.abs(avatar.velocity.z);
        if (vx > 0.001 || vz > 0.001) {
          voxelWalk.stopWalking();
        } else {
          voxelWalk.startWalking();
        }
      });
      avatar.forces.x = 0;
      avatar.forces.y = 0;
      avatar.forces.z = 0;

      const clouds = voxelClouds({
        game,
        textureAtlas,
        size: 16,
        // color: new THREE.Color(0, 0, 0),
        speed: 0.01
      });
      game.on('tick', function(dt) {
        clouds.tick(dt);
      });

      const $domNode = this.getDomNode();
      game.appendTo($domNode[0]);

      cb();
    };

    const generateInitialChunks = cb => {
      let doneChunks = 0;
      for (let i = 0; i < INITIAL_CHUNK_POSITIONS.length; i++) {
        const position = INITIAL_CHUNK_POSITIONS[i];
        this._workerPool.generateAsync(position, chunk => {
          game.showChunk(chunk);

          doneChunks++;
          if (doneChunks >= INITIAL_CHUNK_POSITIONS.length) {
            cb();
          }
        });
      }
    };

    const startGame = cb => {
      game.voxels.on('missingChunk', position => {
        // console.log('missing chunk', position);
        this._workerPool.generateAsync(position, chunk => {
          // console.log('generated chunk', position);

          game.showChunk(chunk);
        });
      });

      avatar.subjectTo(GRAVITY);

      const voxelHighlightInstance = voxelHighlight(game, {
        distance: CHUNK_SIZE,
        mode: 'normal',
        color: 0x000000,
        opacity: 0.75,
        linewidth: 1
      });

      const voxelConstructInstance = voxelConstruct(game, {
        power: 1,
        expire: {
          start: 1 * 1000,
          end: 3 * 1000
        },
      });

      const voxelPortalInstance = voxelPortal(game);

      function initControls() {
        let holdValue = null;

        function startHolding(value) {
          holdValue = value;

          voxelHighlightInstance.setMode('adjacent');

          avatar.startHolding(holdValue);
          voxelWalk.startHolding();
        }

        function stopHolding() {
          voxelHighlightInstance.setMode('normal');

          avatar.stopHolding();
          voxelWalk.stopHolding();

          holdValue = null;
        }

        game.on('fire', () => {
          // try use item
          if (holdValue !== null) {
            const {type} = holdValue;
            if (type === 'item') {
              const {variant} = holdValue;
              if (variant !== 'portalred' && variant !== 'portalblue') {
                stopHolding();

                return;
              }
            }
          }

          // try pickup/place/portal
          const cp = game.cameraPosition();
          const cv = game.cameraVector();
          const hit = game.raycastVoxels(cp, cv, CHUNK_SIZE);
          if (hit) {
            if (holdValue === null) {
              const {voxel: position} = hit;
              const value = voxelConstructInstance.delete(position);

              startHolding(value);

              return;
            } else {
              const {type} = holdValue;
              if (type === 'block' || type === 'vegetation' || type === 'effect') {
                const {adjacent: position} = hit;
                voxelConstructInstance.set(position, holdValue);

                stopHolding();

                return;
              } else if (type === 'item') {
                const {variant} = holdValue;
                const {adjacent: position, normal} = hit;

                if (variant === 'portalred') {
                  voxelPortalInstance.setPortal('red', position, normal);

                  return;
                } else if (variant === 'portalblue') {
                  voxelPortalInstance.setPortal('blue', position, normal);

                  return;
                }
              }
            }
          }
        });

        let lastMenu = new Date(0);
        game.on('menu', () => {
          const now = new Date();
          if (((+now - +lastMenu) / 1000) >= 0.1) {
            const menuEngine = engines.getEngine('menu');
            menuEngine.toggleOpen();
          }
          lastMenu = now;
        });

        game.on('hold', variant => {
          if (holdValue) {
            stopHolding();
          }

          const type = 'item';
          const value = {type, variant};
          startHolding(value);
        });
      }
      initControls();

      cb();
    };

    function step(fns) {
      (function recurse(i) {
        if (i < fns.length) {
          const fn = fns[i];
          fn(err => {
            if (!err) {
              recurse(i + 1);
            } else {
              console.warn(err);
            }
          });
        }
      })(0);
    }

    step([loadTextures, initializeWorkers, initializeGame, generateInitialChunks, startGame]);
  }

  componentWillReceiveProps(nextProps) {
    const {width: newWidth, height: newHeight} = nextProps;
    const {width: oldWidth, height: oldHeight} = this.props;

    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      this._game.resize(newWidth, newHeight);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  getDomNode() {
    return $(ReactDom.findDOMNode(this));
  }

  render() {
    return (
      <div>
        <Crosshair />
      </div>
    );
  }
}

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
