<template>
  <main class="root-container">
    <Game v-if="gameName !== null"/>
    <Introduction @start-game="onStartGame" v-else/>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Game from './components/Game.vue';
import Introduction from './components/Introduction.vue';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

@Component({
  components: {
    Introduction,
    Game,
  },
})
export default class App extends Vue {
  public gameName: string|null = null;

  private onStartGame(gameName: string) {
    console.log("Game Started", gameName);
    this.gameName = gameName;
  }
}
</script>

<style lang="scss">

.root-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 0px;
}
</style>
