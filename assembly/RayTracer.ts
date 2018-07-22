import { Vector3 } from './Vector3';
import { Sphere } from './Sphere';
import { Intersection } from './Intersection';
import { setPixel } from './Pixel';

declare namespace console {
  function debug(val: number): void;
}

export class RayTracer {
  static renderBufferStartOffset: i32 = 0;
  static renderBufferWidth: i32 = 640;
  static renderBufferHeight: i32 = 480;
  static renderBufferLength: i32 =
    RayTracer.renderBufferHeight * RayTracer.renderBufferWidth * sizeof<i32>();

  static trace(
    rayOrigin: Vector3,
    rayDirection: Vector3,
    depth: f64,
    elements: Sphere[],
    backgroundColor: Vector3,
  ): Vector3 {
    let tnear: f64 = Infinity;
    let sphere: Sphere | null = null;

    for (let i = 0; i < elements.length; i++) {
      let hitInfo: Intersection | null = elements[i].intersect(
        rayOrigin,
        rayDirection,
      );

      if (hitInfo) {
        if (hitInfo.t0 < 0) {
          hitInfo.t0 = hitInfo.t1;
        }
        if (hitInfo.t0 < tnear) {
          tnear = hitInfo.t0;
          sphere = elements[i];
        }
      }
      free_memory(changetype<usize>(hitInfo));
    }

    if (!sphere) {
      return backgroundColor;
    }

    let surfaceColor = new Vector3();
    let tmp = rayDirection.clone();
    let intersectionPoint = rayOrigin.clone().add(tmp.multiply(tnear));
    free_memory(changetype<usize>(tmp));
    let intersectionNormal = sphere.normalize(intersectionPoint);

    let bias = 1e-4;

    let inside = false;

    if (rayDirection.dotProduct(intersectionNormal) > 0) {
      intersectionNormal.reverse();
      inside = true;
    }

    for (let i = 0; i < elements.length; i++) {
      if (
        elements[i].emissionColor.x > 0 ||
        elements[i].emissionColor.y > 0 ||
        elements[i].emissionColor.z > 0
      ) {
        let transmission: Vector3 = new Vector3(1, 1, 1);

        let lightDirection = elements[i].center
          .clone()
          .subtract(intersectionPoint)
          .normalize();

        for (let j = 0; j < elements.length; j++) {
          if (i !== j) {
            let tmp = intersectionPoint.clone();
            let tmp2 = intersectionNormal.clone();

            let hitInfo: Intersection | null = elements[j].intersect(
              tmp.add(tmp2.multiply(bias)),
              lightDirection,
            );
            if (hitInfo) {
              transmission.x = 0;
              transmission.y = 0;
              transmission.z = 0;
              break;
            }
            free_memory(changetype<usize>(tmp));
            free_memory(changetype<usize>(tmp2));
          }
        }

        let lightRatio = max(0, intersectionNormal.dotProduct(lightDirection));
        surfaceColor.add(
          sphere.surfaceColor
            .clone() // todo cleanup
            .product(transmission)
            .product(elements[i].emissionColor.clone().multiply(lightRatio)),
        );
        free_memory(changetype<usize>(lightDirection));
        free_memory(changetype<usize>(transmission));
      }
    }

    surfaceColor.add((sphere as Sphere).emissionColor);
    free_memory(changetype<usize>(intersectionNormal));
    return surfaceColor;
  }

  static render(
    width: i32,
    height: i32,
    elements: Sphere[],
    backgroundColor: Vector3,
  ): void {
    let invWidth: f64 = 1 / width;
    let invHeight: f64 = 1 / height;

    let fov: i32 = 30;
    let aspectRatio: f64 = width / height;

    let angle: f64 = Math.tan((Math.PI * 0.5 * fov) / 180);
    let rayOrigin: Vector3 = new Vector3();

    for (let y: i32 = 0; y < height; y++) {
      for (let x: i32 = 0; x < width; x++) {
        let xx: f64 = (2 * ((x + 0.5) * invWidth) - 1) * angle * aspectRatio;
        let yy: f64 = (1 - 2 * ((y + 0.5) * invHeight)) * angle;

        let rayDir: Vector3 = new Vector3(xx, yy, -1.0);

        rayDir.normalize();

        let pixelColor = RayTracer.trace(
          rayOrigin,
          rayDir,
          0,
          elements,
          backgroundColor,
        );

        pixelColor.x = min(1, pixelColor.x);
        pixelColor.y = min(1, pixelColor.y);
        pixelColor.z = min(1, pixelColor.z);

        // convert pixel to bytes
        let r = <u8>Math.round(pixelColor.x * 255);
        let g = <u8>Math.round(pixelColor.y * 255);
        let b = <u8>Math.round(pixelColor.z * 255);
        setPixel(x, y, r, g, b);
        free_memory(changetype<usize>(rayDir));
      }
    }
    free_memory(changetype<usize>(rayOrigin));
  }
}
