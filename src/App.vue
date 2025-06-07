<template>
  <div class="app">
    <AudioPlayer />
  </div>
</template>

<script>
import AudioPlayer from './components/AudioPlayer.vue'

export default {
  name: 'App',
  components: {
    AudioPlayer
  }
}
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 