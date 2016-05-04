"use strict";

const BLOCKS = require('./blocks/index');
const BLOCK_MODELS = require('./block-models/index');
const TREES = require('./trees/index');
const VILLAGES = require('./villages/index');
const PLANES = require('./planes/index');
const MODELS = require('./models/index');
const SPRITES = require('./sprites/index');
const GRADIENTS = require('./gradients/index');

const api = {
  BLOCKS,
  BLOCK_MODELS,
  TREES,
  VILLAGES,
  PLANES,
  MODELS,
  SPRITES,
  GRADIENTS,
};

global.metadata = api;

module.exports = api;
