
<template>
  <main>
    <WebGlBackground :element="simpleElement">
      THis is the content
    </WebGlBackground>
  </main>
</template>

<script setup lang="ts">
import WebGlBackground from './components/WebGlBackground.vue';
import SimpleElement from './lib/SimpleElement';

const simpleElement = SimpleElement

</script>

<style lang="sass">
.web-gl-background
  min-height: 500px
</style>
