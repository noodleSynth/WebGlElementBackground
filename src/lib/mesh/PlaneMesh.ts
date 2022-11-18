import type { WebGLMesh } from "../type/WebGLMesh";

export default {
  vertices: new Float32Array([
    -1, -1, .0,
    -1, 1, .0,
    1, 1, .0,
    1, -1, .0,
  ]),
  texCoords: new Float32Array([
    0, 0,
    0, 1,
    1, 1,
    1, 0
  ]),
  normals: new Float32Array([
    0.0, 0.0, .0,
    0.0, 1.0, .0,
    1.0, 1.0, .0,
    1.0, 0.1, .0,
  ]),
  indices: new Uint8Array([
    0, 1, 3, 2, 3, 1
  ]),

} as WebGLMesh