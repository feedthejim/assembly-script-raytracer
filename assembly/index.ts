import { Sphere } from './Sphere';
import { Vector3 } from './Vector3';
import { RayTracer } from './RayTracer';
import 'allocator/arena';
declare namespace console {
  function debug(val: number): void;
}

export function init(width: i16, height: i16): void {
  let scene: Array<Sphere> = new Array();
  // push background sphere
  scene.push(
    new Sphere(
      new Vector3(0.0, -10004, -20),
      10000,
      new Vector3(0.2, 0.2, 0.2),
      0,
      0,
      new Vector3(),
    ),
  );

  scene.push(
    new Sphere(
      new Vector3(0, 0, -20),
      4,
      new Vector3(1.0, 0.32, 0.36),
      1,
      0.5,
      new Vector3(),
    ),
  );
  scene.push(
    new Sphere(
      new Vector3(5, -1, -15),
      2,
      new Vector3(0.9, 0.76, 0.46),
      1,
      0,
      new Vector3(),
    ),
  );
  scene.push(
    new Sphere(
      new Vector3(5, 0, -25),
      3,
      new Vector3(0.65, 0.77, 0.97),
      1,
      0,
      new Vector3(),
    ),
  );
  scene.push(
    new Sphere(
      new Vector3(-5.5, 0, -15),
      3,
      new Vector3(0.9, 0.9, 0.9),
      1,
      0,
      new Vector3(),
    ),
  );

  // push light
  scene.push(
    new Sphere(
      new Vector3(0, 20, -30),
      3,
      new Vector3(),
      0,
      0,
      new Vector3(1.2, 1.2, 1.2),
    ),
  );
  scene.push(
    new Sphere(
      new Vector3(0, 10, 10),
      3,
      new Vector3(),
      0,
      0,
      new Vector3(1, 1, 1),
    ),
  );

  let backgroundColor: Vector3 = new Vector3(2.0, 2.0, 2.0);
  console.debug(backgroundColor.x);
  // create ray tracer
  let rayTracer: RayTracer = new RayTracer(backgroundColor, scene);

  rayTracer.render(width, height);
}
