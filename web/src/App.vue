<template>
  <main class="root-container">
    <Introduction :gameClient="gameClient" @start-game="onStartGame" v-if="clientState === 'home'"/>
    <Lobby :gameClient="gameClient" :gameName="gameName" v-if="clientState === 'lobby'"/>
    <Game :gameClient="gameClient" v-if="clientState === 'ingame'"/>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Game from './components/views/Game.vue';
import Introduction from './components/views/Introduction.vue';
import Lobby from './components/views/Lobby.vue';
import { GameClient, DummyGameClient } from "./GameClient";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

@Component({
  components: {
    Introduction,
    Lobby,
    Game,
  },
})
export default class App extends Vue {
  private clientState: "home"|"lobby"|"ingame" = "home";
  private gameName: string|null = null;
  private gameClient = new DummyGameClient();

  private onStartGame(gameName: string) {
    gameName = typeof(gameName) === "string" ? gameName : "demo";
    console.log("Game Started", gameName);
    this.clientState = "lobby";
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
