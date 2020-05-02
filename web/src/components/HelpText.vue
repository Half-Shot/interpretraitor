<template>
    <section>
        <h2> How To Play </h2>
        <b-container>
            <b-row>
                <b-col>
                    <img src="//placehold.it/128x128"/>
                    1 (An image) Assemble a set of knowlegable folk</b-col>
                <b-col>2 </b-col>
            </b-row>
            <b-row>
                <b-col>3</b-col>
                <b-col>4</b-col>
            </b-row>
        </b-container>
        <p> Hello and welcome to <strong>Lying</strong></p>
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
h2 {
    font-size: 24pt;
    
}

section {
    text-align: left;
}
</style>
