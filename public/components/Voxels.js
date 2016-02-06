import React from 'react';
import ReactDom from 'react-dom';
import {is} from 'immutable';
import voxel from 'voxel';
import voxelEngine from 'voxel-engine';
import voxelPerlinTerrain from '../lib/voxel-perlin-terrain/index';
import voxelSky from 'voxel-sky';
import voxelHighlight from 'voxel-highlight';
import voxelPlayer from 'voxel-player';
import voxelWalk from 'voxel-walk';

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
    const chunkSize = 16;
    const chunkDistance = 2;

    const game = voxelEngine({
      // generate: voxelPerlinTerrain({scaleFactor:10}),
      // generate: voxelSimplexTerrain({seed: 'lol', scaleFactor: 10, chunkDistance: chunkDistance}),
      generateChunks: false,
      //
      texturePath: './api/img/textures/',
      materials: ['obsidian', ['grass', 'dirt', 'grass_dirt'], 'leaves_opaque', 'tree_side'],
      // cubeSize: 25,
      chunkSize,
      chunkDistance,
      // materials: ['grass', 'obsidian', 'dirt', 'whitewool', 'crate', 'brick'],
      // worldOrigin: [0, 0, 0],
      // mesher: voxel.meshers.culled,
      //
      lightsDisabled: true
    });

    const generator = voxelPerlinTerrain('foo', 0, chunkSize, 100);
    game.voxels.on('missingChunk', function(p) {
      console.log('missingChunk', p);
      const voxels = generator(p, chunkSize)
      const chunk = {
        position: p,
        dims: [chunkSize, chunkSize, chunkSize],
        voxels: voxels
      }
      // console.log('load chunk', chunk);
      game.showChunk(chunk)
      // game.addChunkToNextUpdate(chunk);
    });

    const sky = voxelSky({
      game,
      time: 0,
      // size: 32,
      // color: new THREE.Color(0, 0, 0),
      speed: 0.2
    });

    const createPlayer = voxelPlayer(game);
    const avatar = createPlayer('api/img/textures/player.png')
    avatar.position.set(0, 16, 0)
    avatar.yaw.position.set(2, 14, 4)
    avatar.possess()

    const target = game.controls.target();
    game.on('tick', function(dt) {
      voxelWalk.render(target.playerSkin)
      var vx = Math.abs(target.velocity.x)
      var vz = Math.abs(target.velocity.z)
      if (vx > 0.001 || vz > 0.001) voxelWalk.stopWalking()
      else voxelWalk.startWalking()

      // sky(dt)
    });
    game.setInterval(function() {
      sky(15);
    }, 15);

    const highlight = voxelHighlight(game, {
      distance: chunkSize,
      color: 0xFF0000
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
