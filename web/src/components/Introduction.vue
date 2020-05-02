<template>
    <main>
        <b-container>
            <b-row>
                <b-col>
                    <GameHead/>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h2> Join a game </h2>
                    <b-button @click="startGame">Start game (prototype)</b-button>
                </b-col>
                <b-col cols="8">
                    <HelpText/>
                </b-col>
            </b-row>
        </b-container>
    </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import GameHead from "./GameHeading.vue";
import HelpText from "./HelpText.vue";

@Component({
    components: {
        GameHead,
        HelpText,
    }
})
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  private startGame() {
      console.log("Starting game");
      const gameName = "testing-game";
      this.$emit("start-game", gameName);
  }
}
</script>

<style scoped lang="scss">
main {
  margin-top: 60px;
}
</style>
