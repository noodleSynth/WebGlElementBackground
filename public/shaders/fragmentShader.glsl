#version 300 es
// type: fragment
precision mediump float;

uniform sampler2D sampler2d;
uniform float u_sampleScale;
uniform vec2 u_picture_size;
uniform vec2 u_sampleOffset;
uniform int u_sampleRange;

in float v_Dot;
in vec2 v_texCoord;
in vec4 v_fragCoord;

out vec4 fragColor;

vec4 average(vec2 texCoord, int pixelRange, vec2 pixelSize){

  /*
  The avirage colour of an area on a texture

    a = pixelRange

            a   +1+    a
          a *----pr----*
            |    |     |
          + |    |     |
          1 pr---+-----|
          + |    |     |
            |    |     |
          a *----------*
  
  */

  int width = (pixelRange * 2) + 1;
  int height = (pixelRange * 2) + 1;

  float ratio = 1.0f / float(width * height);


  vec4 avgColor = vec4(0, 0, 0, 0);


  for(int x = 0; x < width; x++){
    for(int y = 0; y < height; y++){
      vec2 sampleLoc = texCoord + (vec2(float(x - pixelRange) * pixelSize.x, float(y - pixelRange) * pixelSize.y));
      vec4 sampleColor = texture(sampler2d, sampleLoc);
      
      avgColor += sampleColor * ratio;
    }
  }

  return (avgColor);
}

void main()
{
  vec2 texCoord = vec2(v_texCoord.s , 1.0 - v_texCoord.t);


  vec2 pixelSize = (vec2(1, 1) / u_picture_size);
  vec2 pixelCoords = ((texCoord) * u_sampleScale) + (u_sampleOffset * (1.0 - u_sampleScale));

  vec4 color = average(pixelCoords, u_sampleRange, pixelSize);
  
  float targetThickness = 0.005;

  if(
    (abs(u_sampleOffset.x - texCoord.x) <= targetThickness || abs(u_sampleOffset.y - texCoord.y) <= targetThickness)
    &&
      (abs(u_sampleOffset.x - texCoord.x) <= targetThickness * 3.0 && abs(u_sampleOffset.y - texCoord.y) <= targetThickness * 3.0)
    ){
    if(abs(u_sampleOffset.x - texCoord.x) <= targetThickness - 0.003 || abs(u_sampleOffset.y - texCoord.y) <= targetThickness - 0.003)
      fragColor += vec4(1.0, 0,0,1);
    else
      fragColor = vec4(0, 0,0,1);

    return;
  }


  fragColor = color;
}