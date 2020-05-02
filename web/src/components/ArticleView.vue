<template>
    <div>
      <iframe :src="`https://en.wikipedia.org/wiki/${encodeURIComponent(articleName)}`">

      </iframe>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  }
})
export default class ArticleView extends Vue {
    @Prop() private articleName = "Failure";

    public mounted() {

    }
}
</script>

<style lang="scss" scoped>
.class-icon {
  width: 256px;
}

iframe {
    width: 100%;
    height: 100%;
    min-height: 600px;
}
</style>