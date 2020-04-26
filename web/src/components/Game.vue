<!--
This component holds the whole game context, from the point of joining a lobby, to the end of the game.

-->
<template>
  <p> We are ingame! </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
    public gameState: "lobby"|"discussion"|"pause" = "lobby";
}
</script>

<style>

</style>