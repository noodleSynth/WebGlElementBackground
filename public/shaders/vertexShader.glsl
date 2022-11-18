#version 300 es
// type: vertex
uniform mat4 u_modelViewProjMatrix;
uniform mat4 u_normalMatrix;
uniform vec3 lightDir;


in vec3 vNormal;
in vec4 vTexCoord;
in vec4 vPosition;

out float v_Dot;
out vec2 v_texCoord;
out vec4 v_fragCoord;

void main()
{
    gl_Position =  vPosition;
    v_fragCoord =  vPosition;
    v_texCoord = vTexCoord.st;
    // v_sampleOffset = u_sampleOffset.xy;
    // vec4 transNormal = u_normalMatrix * vec4(vNormal, 1);
    // v_Dot = max(dot(transNormal.xyz, lightDir), 0.0);
}