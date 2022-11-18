
<template>
  <main>
    <WebGlBackground :element="simpleElement" style="min-height: 100vh; min-width: 100vh">
      THis is the content
    </WebGlBackground>
  </main>
</template>

<script setup lang="ts">
import WebGlBackground from './components/WebGlBackground.vue';
import SimpleElement from './lib/SimpleElement';

const simpleElement = SimpleElement

</script>

<style scoped>

</style>
