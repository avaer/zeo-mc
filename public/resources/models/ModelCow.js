import ModelQuadruped from './ModelQuadruped';

const NAME = 'cow';

export default class ModelCow extends ModelQuadruped {
  static NAME = NAME;

  constructor([p1 = 12, p2 = 0], [s1 = Math.PI * 3 / 4, s2 = 1, s3 = 0, s4 = 0, s5 = 0, s6 = 0] = []) {
    super([p1, p2], [s1, s2, s3, s4, s5, s6]);

    this.textures = 'entity/cow/cow';
    this.meshes = this.meshes.map(mesh => {
      if (mesh.name === 'head') {
        return {
          name: 'head',
          rotationPoint: [0, 4, -8],
          rotation: [s5 / (180 / Math.PI), s4 / (180 / Math.PI), 0],
          children: [
            {
              name: 'main',
              uv: [
                [0, 6, 6, 14],
                [14, 6, 19, 14],
                [14, 0, 22, 8],
                [6, 0, 14, 6],
                [20, 6, 28, 14],
                [6, 6, 14, 14],
              ],
              position: [-4, -4, -6],
              dimensions: [8, 8, 6],
            },
            {
              name: 'ear1',
              uv: [
                [22, 1, 23, 4],
                [24, 1, 25, 4],
                [24, 0, 25, 1],
                [23, 0, 24, 1],
                [25, 1, 26, 4],
                [23, 1, 24, 4],
              ],
              position: [-5, -5, -4],
              dimensions: [1, 3, 1]
            },
            {
              name: 'ear2',
              uv: [
                [22, 1, 23, 4],
                [24, 1, 25, 4],
                [24, 0, 25, 1],
                [23, 0, 24, 1],
                [25, 1, 26, 4],
                [23, 1, 24, 4],
              ],
              position: [4, -5, -4],
              dimensions: [1, 3, 1]
            },
          ]
        };
      } else if (mesh.name === 'body') {
        return {
          name: 'body',
          rotationPoint: [0, 5, 2],
          rotation: [Math.PI / 2, 0, 0],
          children: [
            {
              name: 'main',
              uv: [
                [40, 14, 52, 32], // right
                [18, 14, 28, 32], // left
                [40, 4, 52, 14], // back
                [52, 14, 62, 32], // front
                [28, 4, 40, 14], // top
                [27, 6, 39, 32], // bottom
              ],
              position: [-6, -10, -7],
              dimensions: [12, 18, 10],
            },
            {
              name: 'udder',
              uv: [
                [53, 0, 59, 1],
                [53, 0, 59, 1],
                [53, 0, 59, 1],
                [53, 0, 59, 1],
                [53, 0, 59, 1],
                [52, 1, 58, 7],
              ],
              position: [-2, 2.0, -8],
              dimensions: [4, 6, 1]
            },
          ]
        };
      } else {
        return mesh;
      }
    });
  }
}

// XXX
// var m,i=0; function go(i) {game.scene.remove(m); m = MODELS.make('cow', [], [i, 1], game); game.scene.add(m); m.position.set(-20, 11, 10); }; setInterval(() => {go(i += 0.1)}, 100);

/* package net.minecraft.src;

public class ModelCow extends ModelQuadruped
{
    public ModelCow()
    {
        super(12, 0.0F);
        head = new ModelRenderer(this, 0, 0);
        head.addBox(-4F, -4F, -6F, 8, 8, 6, 0.0F);
        head.setRotationPoint(0.0F, 4F, -8F);
        head.setTextureOffset(22, 0).addBox(-5F, -5F, -4F, 1, 3, 1, 0.0F);
        head.setTextureOffset(22, 0).addBox(4F, -5F, -4F, 1, 3, 1, 0.0F);
        body = new ModelRenderer(this, 18, 4);
        body.addBox(-6F, -10F, -7F, 12, 18, 10, 0.0F);
        body.setRotationPoint(0.0F, 5F, 2.0F);
        body.setTextureOffset(52, 0).addBox(-2F, 2.0F, -8F, 4, 6, 1);
        leg1.rotationPointX--;
        leg2.rotationPointX++;
        leg1.rotationPointZ += 0.0F;
        leg2.rotationPointZ += 0.0F;
        leg3.rotationPointX--;
        leg4.rotationPointX++;
        leg3.rotationPointZ--;
        leg4.rotationPointZ--;
        field_40332_n += 2.0F;
    }
} */
