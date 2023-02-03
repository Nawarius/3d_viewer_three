<template>
  <SceneComponent />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SceneComponent from './components/SceneComponent.vue'

export default defineComponent({
  name: 'App',
  components: {
    SceneComponent
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body {
  margin: 0
}
</style>
