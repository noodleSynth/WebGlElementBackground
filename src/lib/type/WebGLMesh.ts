export interface WebGLMesh {
  // Integration attributes
  vertexBuffer?: WebGLBuffer
  normalBuffer?: WebGLBuffer
  indexBuffer?: WebGLBuffer
  texCoordBuffer?: WebGLBuffer

  vertices: Float32Array
  normals: Float32Array,
  texCoords: Float32Array,
  indices: Uint8Array,
}

const allocateBuffer = (ctx: WebGLRenderingContext, type: number, array: (Uint8Array | Float32Array)) => {
  const buffer = ctx.createBuffer()
  if(!buffer) throw "Could not create buffer"
  ctx.bindBuffer(type, buffer)
  ctx.bufferData(type, array, ctx.STATIC_DRAW)

  ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
  return buffer
}

export const initWebGlMesh = (ctx: WebGLRenderingContext, mesh: WebGLMesh) => {
  mesh.normalBuffer = allocateBuffer(ctx, ctx.ARRAY_BUFFER, mesh.normals)
  mesh.vertexBuffer = allocateBuffer(ctx, ctx.ARRAY_BUFFER, mesh.vertices)
  mesh.texCoordBuffer = allocateBuffer(ctx, ctx.ARRAY_BUFFER, mesh.texCoords)

  mesh.indexBuffer = allocateBuffer(ctx, ctx.ELEMENT_ARRAY_BUFFER, mesh.indices)

}

export const bindMesh = (ctx: WebGLRenderingContext, mesh: WebGLMesh) => {

  if(!mesh.vertexBuffer || !mesh.normalBuffer || !mesh.texCoordBuffer || !mesh.indexBuffer) throw "Incomplete mesh definition"

  ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.vertexBuffer);
  ctx.vertexAttribPointer(0, 3, ctx.FLOAT, false, 0, 0);

  ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.normalBuffer);
  ctx.vertexAttribPointer(1, 3, ctx.FLOAT, false, 0, 0);

  ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.texCoordBuffer);
  ctx.vertexAttribPointer(2, 2, ctx.FLOAT, false, 0, 0);
  
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
}

export const drawMesh = (ctx: WebGLRenderingContext, mesh: WebGLMesh) => {
  ctx.drawElements(ctx.TRIANGLES, mesh.indices.length, ctx.UNSIGNED_BYTE, 0);
}