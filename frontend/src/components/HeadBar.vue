<script setup lang="ts">
import { inject, ref, Ref } from 'vue';
import { transition } from '../scripts/actions.ts';
import Button from './Button.vue';
import SideSheet from './SideSheet.vue'
const showMenu = ref<boolean>(false);
const windowWidth = inject<Ref<number>>('windowWidth') ?? window.innerWidth;
</script>

<template>
  <div :class="$style.root">
    <Button :action="() => showMenu = !showMenu" :class="$style.menuButton">
      <p><span :class="[$style.icon, 'material-symbols-outlined']">apps</span></p>
    </Button>
    <Button v-if="windowWidth >= 700" :action="() => transition('/info')" :class="$style.menuButton">
      <p><span class="icon-info-circled-alt"></span></p>
    </Button>
    <Button v-if="windowWidth >= 700" :action="() => transition('https://github.com/Suki-9/ytDLer')"
      :class="$style.menuButton">
      <p><span class="icon-github-circled"></span></p>
    </Button>
    <p v-if="windowWidth < 700">YouTube Downloader!</p>

    <SideSheet v-model="showMenu" :class="$style.sideSheet">
      <RouterLink to=""><span class="icon-info-circled-alt"></span>Info</RouterLink>
      <a href="https://github.com/Suki-9/ytDLer"><span class="icon-github-circled"></span>GitHub</a>
    </SideSheet>
  </div>
</template>

<style module lang="scss">
@import '../styles/common.scss';

.root {
  display: flex;
  align-items: center;

  @media (width < 700px) {
  }

  @media (width > 700px) or (width: 700px) {
    flex-direction: column;
    height: 100vh;
  }

  padding: .2rem;

  font-size: 1.6em;
  background-color: rgb(230, 230, 230);

  box-shadow: 0px 0px 15px -5px #777777;

  user-select: none;

  & > * {
    margin-right: .2rem;
  }

  .menuButton {
    display: flex;
    line-height: 0;
    .icon {
      font-size: 1em;
    }
  }
}

.sideSheet {
  display: flex;
  flex-direction: column;

  & > * {
    @extend .flex-center;
    span {
      font-size: 1em;
    }
  }
}
</style>