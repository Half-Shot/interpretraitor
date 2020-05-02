<!--
This component holds the whole game context, from the point of joining a lobby, to the end of the game.

-->
<template>
  <div :class="`root-game ${rootClasses.join(' ')}`">
    <ClassAnnouncement delay=3000 @finished="onRevealClassFinished" v-if="gameState === 'reveal-class'" :playerClass="playerClass"/>
    <ArticleView :articleName="articleName" v-if="gameState === 'article'"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ClassAnnouncement from "./ClassAnnouncement.vue";
import ArticleView from "./ArticleView.vue";

@Component({
  components: {
    ClassAnnouncement,
    ArticleView,
  }
})
export default class Game extends Vue {
    public gameState: "lobby"|"reveal-class"|"article"|"discussion"|"pause" = "reveal-class";
    private playerClass: "king"|"interpreter" = "king";
    private articleName = "Cat";

    private onRevealClassFinished() {
      this.gameState = "article";
    }
  
    public get rootClasses(): string[] {
      if (this.gameState === "reveal-class") {
        return ['fade-in'];
      }
      return [];
    }
}
</script>

<style lang="scss" scoped>
.root-game {
  background: black;
  width: 100vw;
  height: 100vh;
  display: block;
  color: white;
}

.fade-in {
  animation: fadein 3s;
}

@keyframes fadein {
    from { opacity: 0;}
    to   { opacity: 1; }
}
</style>