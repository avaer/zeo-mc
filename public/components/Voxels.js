import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';
import voxel from 'voxel';
import voxelEngine from 'voxel-engine';
import voxelPerlinTerrain from '../lib/voxel-perlin-terrain/index';
import voxelSky from '../lib/voxel-sky/index';
import voxelClouds from 'voxel-clouds';
import voxelPlayer from 'voxel-player';
import voxelWalk from 'voxel-walk';
import voxelHighlight from 'voxel-highlight';
import voxelDebris from 'voxel-debris';

import * as inputUtils from '../utils/input/index';

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
  componentDidMount() {
    const chunkSize = 32;
    const chunkDistance = 2;

    const game = voxelEngine({
      // generate: voxelPerlinTerrain({scaleFactor:10}),
      // generate: voxelSimplexTerrain({seed: 'lol', scaleFactor: 10, chunkDistance: chunkDistance}),
      generateChunks: false,
      //
      texturePath: './api/img/textures/',
      materials: ['bedrock', 'lava', 'obsidian', 'stone', 'dirt', ['grass', 'dirt', 'grass_dirt'], 'leaves_opaque', 'tree_side'],
      // cubeSize: 25,
      chunkSize,
      chunkDistance,
      // materials: ['grass', 'obsidian', 'dirt', 'whitewool', 'crate', 'brick'],
      // worldOrigin: [0, 0, 0],
      // mesher: voxel.meshers.culled,
      //
      lightsDisabled: true
    });

    const generator = voxelPerlinTerrain({
      seed: 'lol'
    });
    game.voxels.on('missingChunk', function(position) {
      console.log('missingChunk', position);
      const voxels = generator(position, chunkSize)
      const chunk = {
        position,
        dims: [chunkSize, chunkSize, chunkSize],
        voxels
      };
      // console.log('load chunk', chunk);
      game.showChunk(chunk)
      // game.addChunkToNextUpdate(chunk);
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
    avatar.position.set(0, 20, 0);
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
      distance: chunkSize,
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
      const pos = game.raycastVoxels(cp, cv, chunkSize).voxel;
      if (pos) {
        voxelDebrisExplode(pos);
      }
    });

    // game.mesher = voxel.meshers.greedy;

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

  render() {
    return (
      <div>
        <Crosshair />
      </div>
    );
  }
}
