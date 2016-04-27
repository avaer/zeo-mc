class BlueprintBase {
  constructor() {
    this.legend = {};
    this.layers = [];
    this.yOffset = 0;
  }

  getDimensions() {
    const width = this.layers[0].length;
    const depth = this.layers.length;
    return {width, depth};
  }

  getYOffset() {
    return this.yOffset;
  }

  getBlock(x, z) {
    const blockKey = this.layers[z][x];
    return this.legend[blockKey] || null;
  }
}

module.exports = BlueprintBase;
