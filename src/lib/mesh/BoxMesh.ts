import type { WebGLMesh } from "../type/WebGLMesh";

export default {
  vertices : new Float32Array(
    [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,    // v0-v1-v2-v3 front
       1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,    // v0-v3-v4-v5 right
       1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,    // v0-v5-v6-v1 top
      -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,    // v1-v6-v7-v2 left
      -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,    // v7-v4-v3-v2 bottom
       1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]   // v4-v7-v6-v5 back
),

// normal array
 normals : new Float32Array(
    [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
       1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
       0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
      -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
       0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
       0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]    // v4-v7-v6-v5 back
   ),


// texCoord array
 texCoords : new Float32Array(
    [  1, 1,   0, 1,   0, 0,   1, 0,    // v0-v1-v2-v3 front
       0, 1,   0, 0,   1, 0,   1, 1,    // v0-v3-v4-v5 right
       1, 0,   1, 1,   0, 1,   0, 0,    // v0-v5-v6-v1 top
       1, 1,   0, 1,   0, 0,   1, 0,    // v1-v6-v7-v2 left
       0, 0,   1, 0,   1, 1,   0, 1,    // v7-v4-v3-v2 bottom
       0, 0,   1, 0,   1, 1,   0, 1 ]   // v4-v7-v6-v5 back
   ),

// index array
 indices : new Uint8Array(
    [  0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // top
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // bottom
      20,21,22,  20,22,23 ]   // back
  ),
} as WebGLMesh