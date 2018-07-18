import { Vector3 } from './Vector3';
import { Material } from './Material';
import { Intersection } from './Intersection';
declare namespace console {
  function debug(val: number): void;
}

export class Sphere {
  public radius2: f64;

  constructor(
    public center: Vector3,
    public radius: f64,
    public surfaceColor: Vector3,
    public reflection: f64,
    public transparency: f64,
    public emissionColor: Vector3,
  ) {
    this.radius2 = radius * radius;
  }

  normalize(point: Vector3): Vector3 {
    return point.subtract(this.center).normalize();
  }

  intersect(rayOrigin: Vector3, rayDirection: Vector3): Intersection | null {
    let l: Vector3 = this.center.subtract(rayOrigin);
    let tca: f64 = l.dotProduct(rayDirection);

    if (tca < 0) {
      return null;
    }

    let d2: f64 = l.dotProduct(l) - tca * tca;

    if (d2 > this.radius2) {
      return null;
    }

    let thc = sqrt(this.radius2 - d2);

    return {
      t0: tca - thc,
      t1: tca + thc,
    };
  }
}
