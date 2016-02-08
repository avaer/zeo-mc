import * as voxelAsync from '../voxel-async/index';

onmessage = reqMsg => {
  const {data: req} = reqMsg;

  const res = req;
  postMessage(res);
};
