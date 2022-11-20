import {Matrix4, Vector3, Vector2, Vector4, } from '@math.gl/core'
import { customRef, type Ref } from 'vue'

type WebGLUniformProxyValue = Matrix4 | Vector4 | Vector3 | Vector2 | GLfloat | GLint

export enum UniformTypes {
  matrix4,
  vector4,
  vector3,
  vector2,
  glFloat,
  glInt
}

const UniformBindings: {
  [type: number]: {
    createEmpty: {
      () : WebGLUniformProxyValue
    },
    commit: {
      (ctx: WebGLRenderingContext, loc: WebGLUniformLocation, value: any): void
    }
  }
} = {
  [UniformTypes.glFloat]: {
    createEmpty: () => 0 as GLfloat,
    commit: (ctx, loc: WebGLUniformLocation, value: GLfloat) => ctx.uniform1f(loc, value)
  },
  [UniformTypes.vector2]: {
    createEmpty: () => new Vector2(0),
    commit: (ctx, loc: WebGLUniformLocation, value: Vector2) => ctx.uniform2fv(loc, value)
  },
  [UniformTypes.vector3]: {
    createEmpty: () => new Vector3(0),
    commit: (ctx, loc: WebGLUniformLocation, value: Vector3) => ctx.uniform3fv(loc, value)
  },
  [UniformTypes.glInt]: {
    createEmpty: () => 0,
    commit: (ctx, loc: WebGLUniformLocation, value: GLfloat) => ctx.uniform1i(loc, value)
  }
}

export interface UniformProxy {
  ref?: Ref<WebGLUniformProxyValue>
  uniformHandle: string,
  uniformLoc?: WebGLUniformLocation
  initGl: { (ctx: WebGLRenderingContext, program: WebGLProgram, requestCommit: Function): void}
  commit: { (ctx: WebGLRenderingContext): void },
  canCommit: { (): Boolean },
}

function isFloat(n: number){
  return Number(n) === n && n % 1 !== 0;
}


export const uniformCommitStack: UniformProxy[] = [];
export const uniformInitStack: UniformProxy[] = []

export const uniformProxy = (uniformHandle: string, type: UniformTypes) : UniformProxy=> {

  interface proxyExtras extends UniformProxy{
    realValue: WebGLUniformProxyValue,
    requestCommitCallback?: Function
    confirmCommitCallback?: Function
  }

  const result: proxyExtras = {
    realValue: UniformBindings[type].createEmpty(),
    uniformHandle,
    uniformLoc: undefined,
    ref: undefined,

    initGl(ctx: WebGLRenderingContext, program: WebGLProgram, reqCommit) {
      this.uniformLoc = ctx.getUniformLocation(program, this.uniformHandle)!
      this.requestCommitCallback = reqCommit

      reqCommit(this)
    },
    commit(ctx) {
      UniformBindings[type].commit(ctx, this.uniformLoc!, this.ref?.value)
    },
    canCommit() {
        return this.uniformLoc !== undefined
    },
  }

  result.ref = customRef((tracker, trigger) => {
    return {
      get: () => {
        tracker()
        return result.realValue
      },

      set: (value) => {
        result.realValue = value
        if(result.requestCommitCallback)
          result.requestCommitCallback(result)
        trigger()
      },
    }
  })

  return result;
} 