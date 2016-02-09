import ModelQuadruped from './ModelQuadruped';

export default class ModelPig extends ModelQuadruped {
  constructor([p1 = 0] = [], s = []) {
    super([6, p1], s);

    this.texture = 'entity/pig/pig';
    this.meshes = this.meshes.map(mesh => {
      if (mesh.name === 'head') {
        // console.log('pig uv', [17 - 4, 17 - 4, 17 + (4*3), 17 + (4*1), 64, 32]);
        mesh.children = mesh.children || [];
        mesh.children.push({
          name: 'nose',
          uv: [
            [16, 17, 17, 20],
            [21, 17, 22, 20],
            [21, 16, 25, 17],
            [17, 16, 21, 17],
            [17, 17, 21, 20],
            [17, 17, 21, 20]
          ],
          position: [-2, 0, -9],
          dimensions: [4, 3, 1],
          rotationPoint: mesh.rotationPoint,
          scale: p1
        });
        return mesh;
      } else {
        return mesh;
      }
    });
  }
}

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.pig(game, [2], [i, 1]); game.scene.add(m); m.position.set(-20, 11, 10); }; setInterval(() => {go(i += 0.1)}, 100);

/* package net.minecraft.src;

public class ModelPig extends ModelQuadruped
{
    public ModelPig()
    {
        this(0.0F);
    }

    public ModelPig(float par1)
    {
        super(6, par1);
        head.setTextureOffset(16, 16).addBox(-2F, 0.0F, -9F, 4, 3, 1, par1);
        field_40331_g = 4F;
    }
} */
