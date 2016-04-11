import skin from '../minecraft-skin/index';
import voxelBlockRenderer from '../voxel-block-renderer/index';
import voxelPlaneRenderer from '../voxel-plane-renderer/index';
import voxelSpriteRenderer from '../voxel-sprite-renderer/index';

module.exports = function (game) {
  var mountPoint;
  var possessed;
  
  return function (img, skinOpts) {
    if (!skinOpts) {
      skinOpts = {};
    }
    skinOpts.scale = skinOpts.scale || new game.THREE.Vector3(0.04, 0.04, 0.04);
    var playerSkin = skin(game.THREE, img, skinOpts);
    var player = playerSkin.mesh;
    var physics = game.makePhysical(player);
    physics.playerSkin = playerSkin;
    
    player.position.set(0, 562, -20);
    game.scene.add(player);
    game.addItem(physics);
    
    physics.yaw = player;
    physics.pitch = player.head;
    physics.subjectTo(game.gravity);
    physics.blocksCreation = true;
    
    game.control(physics);
    
    physics.move = function (x, y, z) {
      var xyz = parseXYZ(x, y, z);
      physics.yaw.position.x += xyz.x;
      physics.yaw.position.y += xyz.y;
      physics.yaw.position.z += xyz.z;
    };
    
    physics.moveTo = function (x, y, z) {
      var xyz = parseXYZ(x, y, z);
      physics.yaw.position.x = xyz.x;
      physics.yaw.position.y = xyz.y;
      physics.yaw.position.z = xyz.z;
    };
    
    var pov = 1;
    physics.pov = function (type) {
      if (type === 'first' || type === 1) {
        pov = 1;
      }
      else if (type === 'third' || type === 3) {
        pov = 3;
      }
      physics.possess();
    };
    
    physics.toggle = function () {
      physics.pov(pov === 1 ? 3 : 1);
    };
    
    physics.possess = function () {
      if (possessed) possessed.remove(game.camera);
      var key = pov === 1 ? 'cameraInside' : 'cameraOutside';
      player[key].add(game.camera);
      possessed = player[key];
    };
    
    physics.position = physics.yaw.position;

    playerSkin.rightArmHold = null;
    physics.startHolding = function(value) {
      const {rightArm} = playerSkin;
      const rightArmHold = (() => {
        const {type, variant} = value;
        if (type === 'block') {
          const voxels = new Float32Array(1);
          voxels[0] = variant.block;
          const dims = [1, 1, 1];
          const data = {voxels, dims};
          const mesh = voxelBlockRenderer(data, game.textureAtlas, game.THREE);
          mesh.material = game.blockShader.material;
          mesh.position.set(-1, -7, -3);
          mesh.rotation.set(0, 0, -Math.PI/2);
          mesh.scale.set(4, 4, 4);
          return mesh;
        } else if (type === 'vegetation') {
          const vegetations = {
            0: [0, 0, 0, variant[3]]
          };
          const dims = [1, 1, 1];
          const data = {vegetations, dims};
          const mesh = voxelPlaneRenderer(data, game.textureAtlas, game.THREE);
          mesh.material = game.planeShader.material;
          mesh.position.set(0, -6, -6);
          mesh.rotation.set(0, 0, -Math.PI/2);
          mesh.scale.set(8, 8, 8);
          return mesh;
        } else if (type === 'effect') {
          const effects = {
            0: [0, 0, 0, variant[3]]
          };
          const dims = [1, 1, 1];
          const data = {effects, dims};
          const mesh = voxelPlaneRenderer(data, game.textureAtlas, game.THREE);
          mesh.material = game.planeShader.material;
          mesh.position.set(1, -8, -3);
          mesh.rotation.set(0, 0, -Math.PI/2);
          mesh.scale.set(4, 4, 4);
          return mesh;
        } else if (type === 'item') {
          const items = [variant]
          const dims = [1, 1, 1];
          const data = {items, dims};
          const mesh = voxelSpriteRenderer(data, game.textureLoader, game.THREE);
          // mesh.material = game.planeShader.material;
          mesh.position.set(1, -8, -3);
          mesh.rotation.set(0, 0, -Math.PI/2);
          mesh.scale.set(4, 4, 4);
          return mesh;
        } else {
          return null;
        }
      })();
      if (rightArmHold) {
        window.rightArmHold = rightArmHold; // XXX
        rightArm.add(rightArmHold);
        playerSkin.rightArmHold = rightArmHold;
      }
    };
    physics.stopHolding = function() {
      const {rightArm, rightArmHold} = playerSkin;
      if (rightArmHold) {
        rightArm.remove(rightArmHold);
        playerSkin.rightArmHold = null;
      }
    };
    
    return physics;
  }
};

function parseXYZ (x, y, z) {
    if (typeof x === 'object' && Array.isArray(x)) {
        return { x: x[0], y: x[1], z: x[2] };
    }
    else if (typeof x === 'object') {
        return { x: x.x || 0, y: x.y || 0, z: x.z || 0 };
    }
    return { x: Number(x), y: Number(y), z: Number(z) };
}
