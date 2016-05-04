class BlueprintBase {
  constructor() {
    this.legend = {};
    this.layers = [];
    this.yOffset = 0;
  }

  getDimensions() {
    const baseLayout = this.layers[0].layout;
    const width = baseLayout[0].length;
    const depth = baseLayout.length;
    return {width, depth};
  }

  getYOffset() {
    return this.yOffset;
  }

  getLayers() {
    return this.layers;
  }

  getBlock(x, y, z) {
    const layer = this.layers[y];
    const legend = layer.legend;
    const layout = layer.layout;

    const blockKey = layout[z][x];
    const block = legend[blockKey] || null;
    return block;
  }
}

module.exports = BlueprintBase;
