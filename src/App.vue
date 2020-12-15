<template>
  <HelpDoc ></HelpDoc>
  <test></test>
</template>

<script>
import HelpDoc from './components/HelpDoc.vue'
import test from './components/Vue3'
export default {
  name: 'App',
  components: {
    HelpDoc,test
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
