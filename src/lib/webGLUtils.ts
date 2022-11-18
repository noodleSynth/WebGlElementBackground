
export const loadShader = async (url: string, ctx: WebGLRenderingContext) => {
  const src = (await fetch(url).then(r => r.text()))
  const type = (() => {
    const match = src.match(/\/\/\stype:\s(?<type>.+)/)
    // @ts-ignore
    const shaderDefined : string = match!.groups.type
    if (shaderDefined === "vertex")
      return ctx.VERTEX_SHADER
    else if (shaderDefined === "fragment")
      return ctx.FRAGMENT_SHADER
  })()
  

  if(!type) throw `Could not identify shader type: ${url}`
  const shader = ctx.createShader(type)
  if (!shader) throw `Could not create shader: ${url}`
  
  ctx.shaderSource(shader, src)
  ctx.compileShader(shader)

   var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
   if (!compiled && !ctx.isContextLost()) {
       var error = ctx.getShaderInfoLog(shader);
     ctx.deleteShader(shader);

       throw ("*** Error compiling shader '"+shader+"':"+error + `(${url})`);
   }

  return shader
}

const loadingImages : HTMLImageElement[] = []

export const loadTexture = (ctx: WebGLRenderingContext, url: string) => {

  return new Promise<WebGLTexture>(y => {
    const texture = ctx.createTexture()
    console.log(texture)
    const image = new Image()
  
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, 1, 1, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null);
    
    ctx.bindTexture(ctx.TEXTURE_2D, null);
    image.onload = () => {
      loadingImages.slice(loadingImages.indexOf(image), 1)
      ctx.bindTexture(ctx.TEXTURE_2D, texture);
      ctx.texImage2D(
          ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      //ctx.generateMipmap(ctx.TEXTURE_2D)
      ctx.bindTexture(ctx.TEXTURE_2D, null);
      y(texture!)
    }
    loadingImages.push(image)
  
    image.src = url

  })

}

export const requestAnimFrame = (() => {
  console.log("Animate")
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(/* function FrameRequestCallback */ cb) {
    return window.setTimeout(cb, 1000/60);
  };
})()