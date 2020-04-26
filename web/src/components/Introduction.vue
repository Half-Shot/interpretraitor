<template>
    <main>
        <b-container class="bv-example-row">
            <b-row>
                <b-col>
                    <GameHead/>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm>Join a game</b-col>
                <b-col sm>
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
}
</script>

<style scoped lang="scss">
</style>
