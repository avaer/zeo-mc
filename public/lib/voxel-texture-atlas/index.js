import {FACE_VERTICES, MATERIAL_FRAMES, FRAME_UV_ATTRIBUTE_SIZE, FRAME_UVS_PER_ATTRIBUTE, FRAME_UV_ATTRIBUTES, FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME} from '../../constants/index';

const {floor} = Math;

class VoxelTextureAtlas {
  constructor({atlas, materials, frames, THREE}) {
    super();

    this._atlas = atlas;
    this._materials = materials;
    this._frames = frames;
    this._THREE = THREE;

    this._texture = this._buildTexture();
    this._faceMaterials = this._buildFaceMaterials();
    this._atlasUvs = this._buildAtlasUvs();
    this._faceNormalMaterials = this._buildFaceNormalMaterials();
    this._blockMeshFaceFrameUvs = this._buildBlockMeshFaceFrameUvs();
    this._planeMeshFrameUvs = this._buildPlaneMeshFrameUvs();
  }

  getTexture() {
    return this._texture;
  }

  getAtlasUvs(material) {
    return this._atlasUvs[material];
  }

  getFaceNormalMaterial(colorValue, normalDirection) {
    return this._faceNormalMaterials(colorValue, normalDirection);
  }

  getFaceMaterial(colorValue) {
    return this.getFaceNormalMaterial(colorValue, 0);
  }

  getBlockMeshFaceFrameUvs(material) {
    return this._blockMeshFaceFrameUvs[material];
  }

  getPlaneMeshFrameUvs(material, even) {
    return this._planeMeshFrameUvs[material][even ? 0 : 1];
  }

  _buildTexture() {
    const {_atlas: atlas, _THREE: THREE} = this;
    const {canvas} = atlas;
    const texture = new THREE.Texture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    return texture;
  }

  _buildFaceMaterials() {
    const result = [];
    const index = {}
    for (let i = 0; i < this._materials.length; i++) {
      const faces = this._materials[i];
      for (let j = 0; j < faces.length; j++) {
        const material = faces[j];
        if (!(material in index)) {
          result.push(material);
          index[material] = true;
        }
      }
    }
    return result;
  }

  _buildAtlasUvs() {
    const {_atlas: atlas} = this;
    const {canvas} = atlas;
    return atlas.uv(canvas.width, canvas.height);
  }

  _buildFaceNormalMaterials() {
    function getKey(colorValue, normalDirection) {
      return [colorValue, normalDirection].join(':');
    }

    const map = {};
    for (let i = 0; i < this._materials.length; i++) {
      const faces = this._materials[i];
      for (let j = 0; j < FACE_VERTICES; j++) {
        map[getKey(i + 1, j)] = faces[j];
      }
    }

    return function(colorValue, normalDirection) {
      return map[getKey(colorValue, normalDirection)];
    };
  }

  _buildBlockMeshFaceFrameUvs() {
    const result = {};

    const {_atlas: atlas} = this;
    const {canvas} = atlas;
    const {width, height} = canvas;
    for (let i = 0; i < this._faceMaterials.length; i++) {
      const faceMaterial = this._faceMaterials[i];

      const vertexFrameUvs = (() => {
        const result = new Float32Array(MATERIAL_FRAMES * 2);

        const frames = this._frames[faceMaterial];
        for (let j = 0; j < MATERIAL_FRAMES; j++) {
          const frameMaterial = frames[j];
          const atlasuvs = this.getAtlasUvs(frameMaterial);

          // const [topUV, rightUV, bottomUV, leftUV] = atlasuvs;
          const [topUV,,bottomUV,] = atlasuvs;

          // WARNING: ugly hack ahead.
          // I'm (ab)using faceVertexUvs = the 'uv' attribute: it is the same for all coordinates,
          // and the fractional part is the top-left UV, the whole part is the tile size.

          const tileSizeX = bottomUV[0] - topUV[0];
          const tileSizeY = topUV[1] - bottomUV[1];

          // half because of four-tap repetition
          const tileSizeIntX = (tileSizeX * width) / 2;
          const tileSizeIntY = (tileSizeY * height) / 2;

          // set all to top (+ encoded tileSize)
          const frameUvIndex = j * 2;
          result[frameUvIndex + 0] = tileSizeIntX + topUV[0];
          result[frameUvIndex + 1] = tileSizeIntY + (1.0 - topUV[1]);
        }

        return result;
      })();

      const faceFrameUvs = (() => {
        // sequentially copy FACE_VERTICES copies of each FRAME_UV_ATTRIBUTE_SIZE chunk of data
        const result = new Float32Array(FACE_VERTICES * MATERIAL_FRAMES * 2);
        for (let j = 0; j < FRAME_UV_ATTRIBUTES; j++) {
          for (let k = 0; k < FACE_VERTICES; k++) {
            result.set(
              vertexFrameUvs.slice(FRAME_UV_ATTRIBUTE_SIZE * j, FRAME_UV_ATTRIBUTE_SIZE * (j + 1)),
              j * FACE_VERTICES * FRAME_UV_ATTRIBUTE_SIZE + k * FRAME_UV_ATTRIBUTE_SIZE
            );
          }
        }
        return result;
      })();

      result[faceMaterial] = faceFrameUvs;
    }
    return result;
  }

  _buildPlaneMeshFrameUvs() {
    const result = {};

    for (let i = 0; i < this._faceMaterials.length; i++) {
      const faceMaterial = this._faceMaterials[i];

      const faceFrameUvs = (() => {
        const evenResult = new Float32Array(FACE_VERTICES * MATERIAL_FRAMES * 2);
        const oddResult = new Float32Array(FACE_VERTICES * MATERIAL_FRAMES * 2);

        function writeResult(result, frame, uvOrder) {
          // index first by attribute, then by vertex, then by frame
          function getIndex(vertex, uv) {
            const attributeIndex = floor(frame / 2);
            const vertexIndex = vertex;
            const frameIndex = frame % 2;
            const uvIndex = uv;
            return attributeIndex * FRAME_UV_ATTRIBUTE_SIZE_PER_FRAME + vertexIndex * FRAME_UVS_PER_ATTRIBUTE * 2 + frameIndex * FRAME_UVS_PER_ATTRIBUTE + uvIndex;
          }

          // abd
          result[getIndex(0, 0)] = uvOrder[0][0];
          result[getIndex(0, 1)] = 1.0 - uvOrder[0][1];

          result[getIndex(1, 0)] = uvOrder[1][0];
          result[getIndex(1, 1)] = 1.0 - uvOrder[1][1];

          result[getIndex(2, 0)] = uvOrder[2][0];
          result[getIndex(2, 1)] = 1.0 - uvOrder[2][1];

          // bcd
          result[getIndex(3, 0)] = uvOrder[3][0];
          result[getIndex(3, 1)] = 1.0 - uvOrder[3][1];

          result[getIndex(4, 0)] = uvOrder[4][0];
          result[getIndex(4, 1)] = 1.0 - uvOrder[4][1];

          result[getIndex(5, 0)] = uvOrder[5][0];
          result[getIndex(5, 1)] = 1.0 - uvOrder[5][1];
        }

        const frames = this._frames[faceMaterial];
        for (let j = 0; j < MATERIAL_FRAMES; j++) {
          const frameMaterial = frames[j];

          const atlasuvs = this.getAtlasUvs(frameMaterial);

          // half because of four-tap representation
          const topUV = [atlasuvs[0][0], atlasuvs[0][1]];
          const rightUV = [(atlasuvs[1][0] + atlasuvs[0][0])/2, atlasuvs[1][1]];
          const bottomUV = [(atlasuvs[2][0] + atlasuvs[0][0])/2, (atlasuvs[2][1] + atlasuvs[0][1])/2];
          const leftUV = [atlasuvs[3][0], (atlasuvs[3][1] + atlasuvs[0][1])/2];

          // RIGHT TOP
          // BOTTOM LEFT
          const evenOrder = [rightUV, bottomUV, topUV, bottomUV, leftUV, topUV];
          writeResult(evenResult, j, evenOrder);

          // TOP RIGHT
          // LEFT BOTTOM
          const oddOrder = [topUV, leftUV, rightUV, leftUV, bottomUV, rightUV];
          writeResult(oddResult, j, oddOrder);
        }

        return [evenResult, oddResult];
      })();

      result[faceMaterial] = faceFrameUvs;
    }

    return result;
  }
}

function voxelTextureAtlas(opts) {
  return new VoxelTextureAtlas(opts);
}

module.exports = voxelTextureAtlas;
