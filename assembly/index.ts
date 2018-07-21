import 'allocator/tlsf';
import { RayTracer, Pixel, getPixel, setPixel } from './RayTracer';
declare namespace console {
  function debug(val: number): void;
}

export function init(width: i32 = 1000, height: i32 = 1000): void {
  RayTracer.renderBufferWidth = width;
  RayTracer.renderBufferLength = height;
  RayTracer.renderBufferLength = width * height * sizeof<i32>();
}

export function addSphere(): void {
  let toto: Pixel = new Pixel();
  toto.b = 50;
  toto.r = 50;
  toto.g = 50;
  console.debug(changetype<usize>(toto));
}

export function test(): u8 {
  setPixel(0, 0);
  let toto: Pixel = getPixel(0, 0);
  // toto.b = 255;
  // toto.r = 255;
  // toto.g = 255;
  console.debug(changetype<usize>(toto));
  return toto.r;
}
