"use strict";

const Alea = require('alea');
const FastSimplexNoise = require('fast-simplex-noise');

const floor = Math.floor;

const BUCKETS = 100;
const SAMPLE_SCALE = 1e6;
const SAMPLE_SIZE = 1e5;

class Histogram {
  constructor(opts) {
    opts = opts || {};
    const size = opts.buckets || BUCKETS;
    const min = opts.min || 0;
    const max = opts.max || 1;

    this._buckets = (() => {
      const buckets = Array(size);
      for (let i = 0, l = buckets.length; i < l; i++) {
        buckets[i] = 0;
      }
      return buckets;
    })();
    this._size = 0;
    this._min = min;
    this._max = max;
  }

  getBucket(v) {
    return ((v - this._min) / (this._max - this._min)) * this._buckets.length;
  }

  getBucketIndex(v) {
    return floor(this.getBucket(v));
  }

  getBucketResidual(v) {
    return this.getBucket(v) % 1;
  }

  add(v) {
    const bucketIndex = this.getBucketIndex(v);
    this._buckets[bucketIndex]++;
    this._size++;
  }

  size() {
    return this._size;
  }

  total() {
    let result = 0;
    for (let i = 0, l = this._buckets.length; i < l; i++) {
      const bucketValue = this._buckets[i];
      result += bucketValue;
    }
    return result;
  }

  normalizedBuckets() {
    const total = this.total();
    const normalizedBuckets = this._buckets.map(bucketValue => bucketValue / total);
    return normalizedBuckets;
  }

  normalizedBucketValue() {
    return 1 / this._buckets.length;
  }

  makeScaler() {
    const normalizedBuckets = this.normalizedBuckets();
    const cumulativeNormalizedBuckets = (() => {
      let acc = 0;
      return normalizedBuckets.map(bucketValue => {
        const result = acc;
        acc += bucketValue;
        return result;
      });
    })();
    const cdf = v => {
      const bucketIndex = this.getBucketIndex(v);
      const left = cumulativeNormalizedBuckets[bucketIndex];
      const right = (bucketIndex < (cumulativeNormalizedBuckets.length - 1)) ? cumulativeNormalizedBuckets[bucketIndex + 1] : 1;
      const bucketResidual = this.getBucketResidual(v);
      return left + (bucketResidual * (right - left));
    };
    return cdf;
  }
}

function makeNoiseScaler(noise, sampler, predicate, opts) {
  const histogram = new Histogram(opts);
  while (!predicate(histogram)) {
    const x = sampler();
    const y = sampler();
    const v = noise.in2D(x, y);
    histogram.add(v);
  }
  return histogram.makeScaler();
}

function FastUniformNoise(opts) {
  opts = opts || {};
  opts.min = opts.min || 0;
  opts.max = opts.max || 1;
  opts.random = opts.random || new Alea('');

  this._noise = new FastSimplexNoise(opts);

  const sampler = () => opts.random() * SAMPLE_SCALE;
  const predicate = histogram => histogram.size() >= SAMPLE_SIZE;
  this._scaler = makeNoiseScaler(this._noise, sampler, predicate, opts);
}
FastUniformNoise.prototype = {
  in2D: function(x, y) {
    const v = this._noise.in2D(x, y);
    const scaledV = this._scaler(v);
    return scaledV;
  }
};

module.exports = FastUniformNoise;
