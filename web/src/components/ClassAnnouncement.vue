<template>
    <span :class="`class-announcement ${announceAnimation}`"> 
        You are
        <strong v-if="playerClass === 'king'" class="king-class">
          the King
          <KingIcon class="class-icon" />
        </strong>
        <strong v-if="playerClass === 'inteprepter'" class="inteprepter-class">
          an Inteprepter
          <SpyIcon class="class-icon" />
        </strong>
        <p :class="`${announceSubtextAnimation}`" v-if="playerClass === 'inteprepter'">
          You must stay alive by all means. Lie to the crown to protect your life!
        </p>
        <p :class="`${announceSubtextAnimation}`" v-if="playerClass === 'king'">
          Your subjects all lie but one. Find the truth and execute the traitors!
        </p>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import KingIcon from '../../icons/lorc/crown.svg';
import SpyIcon from '../../icons/delapouite/spy.svg';

@Component({
  components: {
    KingIcon,
    SpyIcon,
  }
})
export default class ClassAnnouncement extends Vue {
    @Prop() private playerClass: "king"|"interpreter";
    @Prop() private delay: number;
    private announceAnimation: "hidden"|"fade-in"|"fade-out" = "hidden";
    private announceSubtextAnimation: "hidden"|"fade-in" = "hidden";

    public mounted() {
      setTimeout(() => {
        this.announceAnimation = "fade-in";
        setTimeout(() => {
            this.announceSubtextAnimation = "fade-in";
            setTimeout(() => {
                this.announceAnimation = "fade-out";
                setTimeout(() => {
                    this.$emit("finished");
                }, 7000);
            }, 4000);
        }, 2000);
      }, this.delay);
    }
}
</script>

<style lang="scss" scoped>
.class-icon {
  width: 256px;
}

.class-announcement {
  font-size: 128px;
  padding-top: 12.5%;
  text-align: center;
  display: block;
}

.fade-in {
  animation: fadein 3s;
}

.fade-out {
  animation: fadeout 2s;
  opacity: 0;
}


.king-class {
  color: goldenrod;
}

.class-announcement > p {
  font-size: 52pt;
  color: silver;
}

.inteprepter-class {
  color: lightgreen;
}

.hidden {
  opacity: 0;
}

@keyframes fadein {
    from { opacity: 0;}
    to   { opacity: 1; }
}

@keyframes fadeout {
    from { opacity: 1;}
    to   { opacity: 0; }
}
</style>