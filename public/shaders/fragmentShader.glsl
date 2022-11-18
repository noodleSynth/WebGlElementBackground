#version 300 es
// type: fragment
precision mediump float;

uniform sampler2D sampler2d;
uniform float u_sampleScale;
uniform vec3 u_sampleOffset;
uniform vec2 u_pixelGrid;

in float v_Dot;
in vec2 v_texCoord;
in vec4 v_fragCoord;

out vec4 fragColor;

vec4 average(vec2 texCoord, float radius){
  vec4 edgeWeight = vec4(.2);
  vec4 centerColor = texture(sampler2d, texCoord); //* vec4(1.0, 0, 0, 0);
  vec4 surrounding = texture(sampler2d, texCoord + vec2(radius, radius)) * edgeWeight;
  surrounding += texture(sampler2d, texCoord + vec2(radius, 0)) * edgeWeight ;
  surrounding += texture(sampler2d, texCoord + vec2(radius, -radius)) * edgeWeight;
  surrounding += texture(sampler2d, texCoord + vec2(0, -radius)) * edgeWeight ;
  surrounding += texture(sampler2d, texCoord + vec2(-radius, -radius)) * edgeWeight;
  surrounding += texture(sampler2d, texCoord + vec2(-radius, 0)) * edgeWeight ;
  surrounding += texture(sampler2d, texCoord + vec2(-radius, radius)) * edgeWeight;
  surrounding += texture(sampler2d, texCoord + vec2(0.0, radius)) * edgeWeight;

  centerColor += surrounding;
  
  vec4 endColor = normalize(centerColor);
  float brightness = (endColor.x + endColor.y + endColor.z) * 0.3;

  return vec4(0.0, 1.0, 0.0, brightness);
}

void main()
{
    if( !((int((v_texCoord.x / u_pixelGrid.x) * 10.0) % 10 == 0) ||
        (int((v_texCoord.y / u_pixelGrid.y) * 10.0) % 10 == 0))) {
      fragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    if((int((v_texCoord.x / u_pixelGrid.x) * 10.0) % 10 == 0) &&
        (int((v_texCoord.y / u_pixelGrid.y) * 10.0) % 10 == 0)){

          vec2 texCoord = (vec2(v_texCoord.s , v_texCoord.t) * u_sampleScale) + u_sampleOffset.xy;

          float sampleRadius = u_sampleScale * 0.0001;

          vec4 color = average(texCoord, sampleRadius);
          // color += vec4(0.1, 0.1, 0.1, 1);
          fragColor =   vec4(color);
        }

}