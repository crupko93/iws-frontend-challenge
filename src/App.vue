<template>
  <div id="app">
    <RawPublisher />
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import RawPublisher from "./components/RawPublisher.vue";
import Game from "./components/Game.vue";
    
export default {
  name: "App",
  components: {
    HelloWorld,
    RawPublisher,
    Game,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
