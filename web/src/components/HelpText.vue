<template>
    <section>
        <h1> How To Play </h1>
        <p>Hello and welcome to <strong>Lying</strong></p>
        <p> Some poor sod needs to make the rules up </p>
    </section>    
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelpText extends Vue {
}
</script>

<style scoped lang="scss">
h1 {
    font-size: 24pt;
    
}

section {
    text-align: left;
}
</style>
