import { Vector3 } from './Vector3';
import { Sphere } from './Sphere';
import { Intersection } from './Intersection';
import { Material } from './Material';
declare namespace console {
  function debug(val: number): void;
}
export class RayTracer {
  constructor(public backgroundColor: Vector3, public elements: Sphere[]) {}

  trace(rayOrigin: Vector3, rayDirection: Vector3, depth: f64): Vector3 {
    let tnear: f64 = Infinity;
    let sphere: Sphere | null = null;

    for (let i = 0; i < this.elements.length; i++) {
      let hitInfo: Intersection | null = this.elements[i].intersect(
        rayOrigin,
        rayDirection,
      );

      if (hitInfo) {
        if (hitInfo.t0 < 0) {
          hitInfo.t0 = hitInfo.t1;
        }
        if (hitInfo.t0 < tnear) {
          tnear = hitInfo.t0;
          sphere = this.elements[i];
        }
      }
    }

    if (!sphere) {
      return this.backgroundColor;
    }

    let surfaceColor = new Vector3();
    let intersectionPoint = rayOrigin.add(rayDirection.multiply(tnear));
    let intersectionNormal = (sphere as Sphere).normalize(intersectionPoint);

    let bias = 1e-4;

    let inside = false;

    if (rayDirection.dotProduct(intersectionNormal) > 0) {
      intersectionNormal = intersectionNormal.reverse();
      inside = true;
    }

    for (let i = 0; i < this.elements.length; i++) {
      if (
        this.elements[i].emissionColor.x > 0 ||
        this.elements[i].emissionColor.y > 0 ||
        this.elements[i].emissionColor.z > 0
      ) {
        let transmission: Vector3 = new Vector3(1, 1, 1);
        let lightDirection = this.elements[i].center
          .subtract(intersectionPoint)
          .normalize();
        for (let j = 0; j < this.elements.length; j++) {
          if (i !== j) {
            let hitInfo: Intersection | null = this.elements[j].intersect(
              intersectionPoint.add(intersectionNormal.multiply(bias)),
              lightDirection,
            );
            if (hitInfo) {
              transmission = new Vector3();
              break;
            }
          }
        }

        let lightRatio = max(0, intersectionNormal.dotProduct(lightDirection));

        surfaceColor.add(
          (sphere as Sphere).surfaceColor
            .product(transmission)
            .product(this.elements[i].emissionColor.multiply(lightRatio)),
        );
      }
    }

    surfaceColor.add((sphere as Sphere).emissionColor);
    return surfaceColor;
  }

  render(width: i16, height: i16): void {
    let startY: i16 = 0;
    let scanHeight: i16 = height;

    let invWidth: i16 = 1 / width;
    let invHeight: i16 = 1 / height;

    let fov: i16 = 30;
    let aspectRatio: i16 = width / height;

    let angle: f64 = Math.tan((Math.PI * 0.5 * fov) / 180);
    let rayOrigin: Vector3 = new Vector3();

    for (
      let y: i16 = startY, pixelIndex: i16 = 0;
      y < startY + scanHeight;
      y++
    ) {
      for (let x: i16 = 0; x < width; x++, pixelIndex++) {
        let xx: f64 = (2 * ((x + 0.5) * invWidth) - 1) * angle * aspectRatio;
        let yy: f64 = (1 - 2 * ((y + 0.5) * invHeight)) * angle;
        let rayDir: Vector3 = new Vector3(xx, yy, -1.0);
        rayDir = rayDir.normalize();
        // trace
        let pixelColor = this.trace(rayOrigin, rayDir, 0);

        pixelColor.x = Math.min(1, pixelColor.x);
        pixelColor.y = Math.min(1, pixelColor.y);
        pixelColor.z = Math.min(1, pixelColor.z);

        // convert pixel to bytes
        let r = <i32>Math.round(pixelColor.x * 255);
        let g = <i32>Math.round(pixelColor.y * 255);
        let b = <i32>Math.round(pixelColor.z * 255);

        store<i32>(pixelIndex, (255 << 24) | (b << 16) | (g << 8) | r);
      }
    }
  }
}
