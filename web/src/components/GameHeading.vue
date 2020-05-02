<template>
    <b-jumbotron header="Interpretraitor" lead="A game about bullshitting to your friends">
        <p>Developed by <a href="#">Half-Shot</a> and <a href="#">Reydus</a></p>
    </b-jumbotron>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import '@/styles/color.scss'

@Component
export default class HelloWorld extends Vue {
    
}
</script>

<style lang="scss" scoped>
.jumbotron {
    color: $color-secondary-1-1;
    text-align: center;
    background-color: $color-primary-0;
    a {
        color: $color-secondary-1-3;
    }
    a:visited {
        color: $color-secondary-1-2;
    }

    h1 {
        font-weight: 500;
    }
}
</style>