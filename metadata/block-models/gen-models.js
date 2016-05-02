var path = require('path');
var fs = require('fs');

function getBlockModelJsons(cb) {
  var blockModelsDirectory = path.join(__dirname, '..', '..', 'assets', 'json', 'block-models');
  var files = fs.readdirSync(blockModelsDirectory).filter(f => /\.json$/.test(f)).map(f => f.replace(/\.json$/, ''));

  var error = null;
  var result = {};
  var pending = files.length;
  function pend(err) {
    error = error || err;
    if (--pending === 0) {
      done();
    }
  }
  function done() {
    if (!error) {
      cb(null, result);
    } else {
      cb(error);
    }
  }

  files.forEach(f => {
    var filePath = path.join(blockModelsDirectory, f) + '.json';
    fs.readFile(filePath, 'utf8', function(err, s) {
      if (!err) {
        var o = _jsonParse(s);
        if (o !== null) {
          o.name = f;

          result[f] = o;

          pend();
        } else {
          pend(new Error('failed to parse ' + JSON.stringify(filePath)));
        }
      } else {
        pend(err);
      }
    });
  });
}

function normalizeBlockModels(blockModels) {
  function _getParent(blockModel) {
    return blockModel.parent ? blockModels[blockModel.parent.replace(/^block\//, '')] : null;
  }
  function _getPath(blockModel) {
    var result = [];
    for (; blockModel !== null; blockModel = _getParent(blockModel)) {
      result.push(blockModel);
    }
    return result;
  }
  function _getDebugPath(blockModelPath) {
    return blockModelPath.map(blockModel => blockModel.name).join(' -> ');
  }
  function _getElements(blockModelPath) {
    var result = [];
    blockModelPath.forEach(blockModel => {
      var blockModelElements = blockModel.elements;
      result.push.apply(result, blockModelElements);
    });
    return result;
  }
  function _getTextureMap(blockModelPath) {
    var result = {};
    var isDangling = false;
    blockModelPath.forEach(blockModel => {
      var blockModelTextures = blockModel.textures;
      if (blockModelTextures) {
        for (var k in blockModelTextures) {
          var blockModelTexture = blockModelTextures[k];
          var match = blockModelTexture.match(/^#(.*)$/);
          if (match) {
            var blockModelTextureReference = match[1];
            var blockModelTextureReferenceTexture = result[blockModelTextureReference];
            if (blockModelTextureReferenceTexture) {
              result[k] = blockModelTextureReferenceTexture;
            } else {
              isDangling = true;
              // throw new Error('bad texture reference: ' + JSON.stringify(_getDebugPath(blockModelPath)) + ':' + JSON.stringify(blockModelTexture));
            }
          } else {
            var match = blockModelTexture.match(/^blocks\/(.*)$/);
            if (match) {
              result[k] = match[1];
            } else {
              throw new Error('bad texture name: ' + JSON.stringify(_getDebugPath(blockModelPath)) + ':' + JSON.stringify(blockModelTexture));
            }
          }
        }
      }
    });
    if (!isDangling) {
      return result;
    } else {
      return null
    }
  }
  function _buildGeometry(blockModelPath, elements, textureMap) {
    var result = [];
    var isDangling = false;
    elements.forEach(element => {
      var elementFrom = element.from;
      var elementTo = element.to;
      var elementFaces = element.faces;

      var position = [
        (elementFrom[0] + elementTo[0]) / 2,
        (elementFrom[1] + elementTo[1]) / 2,
        (elementFrom[2] + elementTo[2]) / 2,
      ];
      var dimensions = [
        elementTo[0] - elementFrom[0],
        elementTo[1] - elementFrom[1],
        elementTo[2] - elementFrom[2],
      ];
      // XXX make sure this order is right
      // geometry order: right, left, top, bottom, back, front
      var faces = ['east', 'west', 'up', 'down', 'south', 'north'].map(faceKey => {
        var face = elementFaces[faceKey];
        if (face) {
          var faceUv = face.uv;
          var faceTexture = face.texture;

          var match = faceTexture.match(/^#(.*)$/);
          if (match) {
            var faceTextureReference = match[1];
            var faceTextureReferenceTexture = textureMap[faceTextureReference];
            if (faceTextureReferenceTexture) {
              var faceTextureUv = faceUv || null;
              return {
                uv: faceTextureUv,
                texture: faceTextureReferenceTexture,
              };
            } else {
              isDangling = true;
              // throw new Error('missing texture reference: ' + JSON.stringify(_getDebugPath(blockModelPath)) + ':' + JSON.stringify(faceTexture));
              return null;
            }
          } else {
            throw new Error('malformed texture reference: ' + JSON.stringify(_getDebugPath(blockModelPath)) + ':' + JSON.stringify(faceTexture));
          }
        } else {
          return null;
        }
      });

      var geometry = {position, dimensions, faces};
      result.push(geometry);
    });
    if (!isDangling) {
      return result;
    } else {
      return null
    }
  }

  var result = {};
  var numModels = 0;
  for (var k in blockModels) {
    var blockModel = blockModels[k];
    var blockModelPath = _getPath(blockModel);
    var elements = _getElements(blockModelPath);
    var textureMap = _getTextureMap(blockModelPath);
    if (textureMap) {
      var geometry = _buildGeometry(blockModelPath, elements, textureMap);
      if (geometry) {
        var index = numModels++;
        result[k] = {index, geometry};
      }
    }
  }
  return result;
}

function _jsonParse(s) {
  var error = null;
  var result;
  try {
    result = JSON.parse(s);
  } catch(err) {
    error = error || err;
  }
  if (!error) {
    return result;
  } else {
    return null;
  }
}

getBlockModelJsons((err, blockModels) => {
  if (!err) {
    var normalizedBlockModels = normalizeBlockModels(blockModels);
    console.log(JSON.stringify(normalizedBlockModels, null, 2));
  } else {
    console.warn(err);
    process.exit(1);
  }
});
