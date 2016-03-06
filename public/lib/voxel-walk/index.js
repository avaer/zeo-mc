var walkSpeed = 1
var walkRangeZ = 2
var walkRangeX = 1
var startedWalking = 0
var stoppedWalking = 0
var walking = false
var acceleration = 1

var holdSpeed = 5
var holdExponent = 1/5
var holdRangeZ = 1.7
var holdRangeX = 0.25
var holding = false
var startedHolding = 0
var stoppedHolding = 0

exports.render = function(avatar){
  var skin = avatar.playerSkin
  var pitch = avatar.pitch.rotation.x / (Math.PI/2);

  var time = Date.now() / 1000
  if (walking && time < startedWalking + acceleration){
    walkSpeed = (time - startedWalking) / acceleration
  }
  if (!walking && time < stoppedWalking + acceleration){
    walkSpeed = -1 / acceleration * (time - stoppedWalking) + 1
  }

  skin.head.rotation.y = Math.sin(time * 1.5) / 3 * walkSpeed
  skin.head.rotation.z = Math.sin(time) / 2 * walkSpeed

  var walkRightArmZ = walkRangeZ * Math.cos(0.6662 * time * 10 + Math.PI) * walkSpeed
  var holdRightArmZ = holding ?
    holdRangeZ * Math.pow(Math.min((time - startedHolding) * holdSpeed, 1), holdExponent) * (1 + pitch)
  :
    holdRangeZ * Math.pow(Math.max(1 - ((time - stoppedHolding) * holdSpeed), 0), 1/holdExponent) * (1 + pitch);

  var walkRightArmX = walkRangeX * (Math.cos(0.2812 * time * 10) - 1) * walkSpeed
  var holdRightArmX = holdRangeX * (Math.cos(0.2812 * time * 10) - 1) * walkSpeed

  skin.rightArm.rotation.z = holding ? (holdRightArmZ * 0.95) + (walkRightArmZ * 0.05): walkRightArmZ;
  skin.rightArm.rotation.x = holding ? holdRightArmX : walkRightArmX;
  skin.leftArm.rotation.z = 2 * Math.cos(0.6662 * time * 10) * walkSpeed
  skin.leftArm.rotation.x = 1 * (Math.cos(0.2312 * time * 10) + 1) * walkSpeed

  skin.rightLeg.rotation.z = 1.4 * Math.cos(0.6662 * time * 10) * walkSpeed
  skin.leftLeg.rotation.z = 1.4 * Math.cos(0.6662 * time * 10 + Math.PI) * walkSpeed
}

exports.startWalking = function(){
  var now = Date.now() / 1000
  walking = true
  if (stoppedWalking + acceleration>now){
    var progress = now - stoppedWalking;
    startedWalking = now - (stoppedWalking + acceleration - now)
  } else {
    startedWalking = Date.now() / 1000
  }
}
exports.stopWalking = function() {
  var now = Date.now() / 1000
  walking = false
  if (startedWalking + acceleration > now){
    stoppedWalking = now - (startedWalking + acceleration - now)
  } else {
    stoppedWalking = Date.now() / 1000
  }
}
exports.isWalking = function(){
  return walking
}

exports.startHolding = function(){
  if (!holding) {
    holding = true
    var now = Date.now() / 1000
    startedHolding = now
  }
}
exports.stopHolding = function() {
  if (holding) {
    holding = false
    var now = Date.now() / 1000
    stoppedHolding = now
  }
}
exports.isHolding = function(){
  return holding
}

exports.setAcceleration = function(newA){
  acceleration = newA
}
