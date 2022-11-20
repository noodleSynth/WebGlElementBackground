
import {loadShader} from '../webGLUtils'
import { initWebGlMesh, type WebGLMesh } from './WebGLMesh'
import type { Matrix4 } from '@math.gl/core'
import type { UniformProxy } from './WebGLUniformProxy'

export interface ShaderSet {
  [uniformName: string] :  WebGLUniformLocation
}

export interface WebGLElement{
  // Integration attributes
  canvas?: HTMLCanvasElement,
  ctx?: WebGLRenderingContext,
  shaders?: WebGLShader[],
  program?: WebGLProgram,
  uniformCommitCue?: UniformProxy[]

  // Instance definitions
  shaderPaths: string[],
  attributes: string[],
  meshes: WebGLMesh[],
  uniforms: UniformProxy[],

  // Instance configure

  uniformData: {
    [name: string] : Matrix4
  },

  drawFrame: {() : void}
}

export const initElement = async (canvas: HTMLCanvasElement, element: WebGLElement) => {

  const ctx = canvas.getContext('webgl2')
  if (!ctx) throw "Could not init web gl context"
  console.log(ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION))

  element.ctx = ctx
  element.canvas = canvas
  
  element.shaders = await Promise.all(element.shaderPaths.map(async url => await loadShader(url, ctx)))
  if(!element.shaders || element.shaders.length === 0) throw "Could not load shaders"

  const program = ctx.createProgram()
  if (!program) throw "Could not create program"
  element.program = program
  
  element.shaders.forEach((shader) => {
    ctx.attachShader(program, shader)
  })

  element.attributes.forEach((attrName, i) => ctx.bindAttribLocation(program, i, attrName))

  ctx.linkProgram(program)
  var linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
  if (!linked && !ctx.isContextLost()) {
    // something went wrong with the link
    var error = ctx.getProgramInfoLog (program);

    ctx.deleteProgram(program);
    element.shaders.forEach(shader => ctx.deleteShader(shader))

    throw {message: "Could not link shader program", error}
  }

  ctx.useProgram(program);

  // Init uniform cue
  element.uniformCommitCue = []
  const commit = (u: UniformProxy) => {
    element.uniformCommitCue!.push(u)
  }

  element.uniforms.forEach(e => e.initGl(ctx, element.program!, commit))

  // Setting context attrs
  ctx.clearColor(.2, .2, .2, 1);
  ctx.clearDepth(1);

  ctx.enable(ctx.DEPTH_TEST);
  ctx.enable(ctx.BLEND);
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT)

  element.meshes.forEach(mesh => initWebGlMesh(ctx, mesh))

  ctx.enableVertexAttribArray(0);
  ctx.enableVertexAttribArray(1);
  ctx.enableVertexAttribArray(2);

}

export const renderElement = (el: WebGLElement) => {
  while (el.uniformCommitCue!.length !== 0) {
    if (!el.uniformCommitCue![0].canCommit()) break
    
    el.uniformCommitCue?.shift()?.commit(el.ctx!)
  }
  el.drawFrame()
}