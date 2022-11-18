import BoxMesh from "./mesh/BoxMesh";
import type { WebGLElement, ShaderSet } from "./type/WebGLElement";
import { Matrix4, Vector3 as vec3 } from '@math.gl/core'
import { bindMesh, drawMesh } from "./type/WebGLMesh";
import PlaneMesh from "./mesh/PlaneMesh";
import { loadTexture } from "./webGLUtils";

var noiseTexture: WebGLTexture;

const scroll = {
  x: 0.0,
  y: 0.0
}

export default {
  shaderPaths: [
    '/shaders/vertexShader.glsl',
    '/shaders/fragmentShader.glsl'
  ],
  attributes: ["vPosition", "vNormal", "vColor"],
  uniformData: {
    mvMatrix: new Matrix4(),
    normalMatrix: new Matrix4(),
    mvpMatrix: Matrix4.IDENTITY.clone()
  },

  meshes: [PlaneMesh],


  initUniforms() {
    if (!this.ctx) throw "GLContext not initialized"
    if (!this.program) throw "Shader program no ready"

    this.ctx.uniform1i(this.ctx.getUniformLocation(this.program, "sampler2d"), 0);

    loadTexture(this.ctx, '/textures/noise.png').then(t => noiseTexture = t) 
    
    const sampleScaleLoc = this.ctx.getUniformLocation(this.program, 'u_sampleScale')
    if(sampleScaleLoc)
      this.ctx.uniform1f(sampleScaleLoc, .2)
    const sampleOffsetLoc = this.ctx.getUniformLocation(this.program, 'u_sampleOffset')
    if (sampleOffsetLoc)
      this.ctx.uniform3fv(sampleScaleLoc, [.2, .2, 1])

    const pixelGridLoc = this.ctx.getUniformLocation(this.program, 'u_pixelGrid')
    this.ctx.uniform2fv(pixelGridLoc, [ 50 / this.canvas!.clientWidth, 50 / this.canvas!.clientHeight ])
    return {
      'u_normalMatrixLoc': this.ctx.getUniformLocation(this.program, 'u_normalMatrixLoc'),
      'u_modelViewProjMatrix': this.ctx.getUniformLocation(this.program, 'u_modelViewProjMatrix'),
      'u_sampleScale': sampleScaleLoc,
      'u_sampleOffset': sampleOffsetLoc,
      'u_pixelGrid' : pixelGridLoc
    } as ShaderSet
  },
  drawFrame() {

    this.ctx?.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT)

    this.canvas!.width = this.canvas!.clientWidth;
    this.canvas!.height = this.canvas!.clientHeight;
    // Set the viewport and projection matrix for the scene
    this.ctx!.viewport(0, 0, this.canvas!.clientWidth, this.canvas!.clientHeight);
    this.uniformData.perspectiveMatrix = Matrix4.IDENTITY.clone();
    // console.log({fovy: 60 * (Math.PI / 180), aspect: this.canvas!.clientWidth / this.canvas!.clientHeight, near: 1, far: 10000})
    const perspective = new Matrix4().perspective({ fovy: 30 * (Math.PI / 180), aspect: this.canvas!.clientWidth / this.canvas!.clientHeight, near: 1, far: 100 })
    const look = new Matrix4().lookAt({ eye: [0, 0, 7], center: [0, 0, 0], up: new vec3(0, 1, 0) });

    perspective.multiplyLeft(look)
    // this.uniformData.perspectiveMatrix = Matrix4.IDENTITY.clone()

    const currentAngle = 0

    // Make a model/view matrix.
    this.uniformData.mvMatrix = Matrix4.IDENTITY.clone()
    // this.uniformData.mvMatrix.rotateX(20);
    // this.uniformData.mvMatrix.rotateY(1);
    // this.uniformData.mvMatrix.rotateXYZ([currentAngle, 0,1]);

    // this.uniformData.mvMatrix.rotateZ(1);

    // Construct the normal matrix from the model-view matrix and pass it in
    this.uniformData.normalMatrix = new Matrix4(this.uniformData.mvMatrix);
    this.uniformData.normalMatrix.invert();
    this.uniformData.normalMatrix.transpose();

    // this.ctx?.uniformMatrix4fv(this.uniformLocations!["u_normalMatrixLoc"], false, this.uniformData.normalMatrix)

    // Construct the model-view * projection matrix and pass it in
    // this.uniformData.mvpMatrix = perspective.clone()
    this.uniformData.mvpMatrix = this.uniformData.mvpMatrix.multiplyLeft(this.uniformData.mvMatrix);
    // this.ctx?.uniformMatrix4fv(this.uniformLocations!["u_modelViewProjMatrix"], false, this.uniformData.mvpMatrix)
    this.ctx!.uniform3fv(this.uniformLocations!['u_sampleOffset'], [scroll.x, scroll.y, 1])

    this.meshes.forEach(e => {
      bindMesh(this.ctx!, e)
      this.ctx?.bindTexture(this.ctx!.TEXTURE_2D, noiseTexture)
      drawMesh(this.ctx!, e)
    })
    
    const speed = 0.01

    scroll.x += 0.01 * speed
    scroll.y += 0.01 * speed
    if (scroll.x + 0.2 >= 1 ) scroll.x = 0
    if (scroll.y + 0.2 >= 1) scroll.y = 0
    // this.ctx?.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT)
  }
} as WebGLElement