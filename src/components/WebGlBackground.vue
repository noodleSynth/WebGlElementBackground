<template>
  <div class="web-gl-background">
    <canvas ref="canvas" />
    <div class="input">
      <label>
        Texture Scale
        <input type="range" min="0" max="1" step="0.01" :value="scale.ref.value" @input="e => scale.ref!.value = e.target.value" />{{scale.ref.value}}
      </label>
      <br />
      <label>
        Offset X
        <input type="range" min="0" max="1" step="0.01" :value="sampleOffset.ref!.value.x" @input="e =>  updateOffsetUniform({x: e.target.value})" />{{sampleOffset.ref.value.x}}
      </label>
      <br />
      <label>
        Offset Y
        <input type="range" min="0" max="1" step="0.01" :value="sampleOffset.ref!.value.y" @input="e => updateOffsetUniform({y: e.target.value})" /> {{sampleOffset.ref.value.y}}
      </label>
      <br />
      <label>
        Blur level
        <input type="range" min="0" max="30" step="1" :value="sampleSize.ref.value" @input="e => sampleSize.ref.value = e.target.value" />{{sampleSize.ref.value}}
      </label>
    </div>
    <slot />
  </div>
</template>


<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { type WebGLElement, initElement, renderElement } from '@/lib/type/WebGLElement'
import {requestAnimFrame} from '@/lib/webGLUtils'
import { uniformProxy, UniformTypes } from '@/lib/type/WebGLUniformProxy';
import {Vector2, Vector3} from '@math.gl/core'
import { computed } from '@vue/reactivity';

const canvas = ref<HTMLElement>();


const props = defineProps<{
  element: WebGLElement
}>()

const [scale, ps, sampleOffset, sampleSize] = props.element.uniforms
const sampleOffsetComp = ref(new Vector2(0))
scale.ref!.value = .5;
sampleOffset.ref!.value = new Vector2(.5, .5)

// sampleOffset.value = new Vector3(0.0, 0.0, 1)

const updateOffsetUniform = ({x, y}: {x?: number, y?: number}) => {
  sampleOffsetComp.value = sampleOffset.ref!.value = new Vector2(x ? x : sampleOffset.ref!.value.x, y ? y : sampleOffset.ref!.value.y)
}


onMounted(() => {
  // window!.addEventListener("mousemove", updateOffsetUniform)
  initElement(canvas.value, props.element).then(() => {
    console.log(props.element)
    props.element.drawFrame()
    const render = () => {
      renderElement(props.element)
      requestAnimFrame(render)
    }
    render()
  })
})

onBeforeUnmount(() => {

})

</script>

<style lang="sass">
.web-gl-background
  position: relative
  color: white
  &>canvas
    z-index: -999
    position: absolute
    width: 100%
    height: 100%
    border: solid 3px black
  .input
    padding: 10px
    background-color: rgba(0,0,0, .6)
</style>