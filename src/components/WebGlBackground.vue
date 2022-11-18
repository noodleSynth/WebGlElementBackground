<template>
  <div class="web-gl-background">
    <canvas ref="canvas" />
    <slot />
  </div>
</template>


<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { type WebGLElement, initElement } from '@/lib/type/WebGLElement'
import {requestAnimFrame} from '@/lib/webGLUtils'


const canvas = ref();

const props = defineProps<{
  element: WebGLElement
}>()

onMounted(() => {
  initElement(canvas.value, props.element).then(() => {
    console.log(props.element)
    props.element.drawFrame()
    const render = () => {
      props.element.drawFrame()
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
  &>canvas
    z-index: -999
    position: absolute
    width: 500px
    height: 500px
    border: solid 3px black

</style>