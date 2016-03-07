var skin = require('../minecraft-skin/index');

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
      console.log('start holding', playerSkin); // XXX
      const {rightArm} = playerSkin;
      const rightArmHold = (() => {
        // const geometry = new game.THREE.CubeGeometry(2, 2, 2);
        const geometry = new game.THREE.CubeGeometry(3, 3, 3);
        // const geometry = new game.THREE.CubeGeometry(4, 4, 4);
        for (let i = 0; i < 8; i++) {
          geometry.vertices[i].y -= 4;
        }
        const material = new game.THREE.MeshBasicMaterial({
          color: 0xCCCCCC
        });
        const mesh = new game.THREE.Mesh(geometry, material);
        // mesh.position.set(2, -4, -2);
        mesh.position.set(1.5, -5.5, -1.5);
        // mesh.position.set(2, -4, -2);
        return mesh;
      })();
      rightArm.add(rightArmHold);
      playerSkin.rightArmHold = rightArmHold;
    };
    physics.stopHolding = function() {
      console.log('stop holding', playerSkin); // XXX
      const {rightArm, rightArmHold} = playerSkin;
      rightArm.remove(rightArmHold);
      playerSkin.rightArmHold = null;
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
