export const FRAME_RATE = 60;

export const WORLD_SIZE = 32;
export const CAMERA_HEIGHT = 1;

export const TOOLS = {
  MAGNIFYING_GLASS: 'magnifying-glass',
  PENCIL: 'pencil',
  WRENCH: 'wrench',
  ERASER: 'eraser',
  PAINTBRUSH: 'paint-brush'
};
export const TOOL_NAMES = Object.keys(TOOLS).map(tool => TOOLS[tool]);
export const TOOL_SIZE = 16;
