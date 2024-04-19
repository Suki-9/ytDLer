<script setup lang="ts">
const isActive = defineModel<boolean>({
  required: true,
});

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <div v-if="isActive" :class="[$style.root, props.class]">
    <slot></slot>
  </div>
  <div v-if="isActive" @click="isActive = false" :class="$style.bg"></div>
</template>

<style module lang="scss">
@import '../styles/common.scss';

.root {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 599;

  height: 100vh;
  min-width: 50%;
  max-width: 90%;

  overflow-x: hidden;
  overflow-y: scroll;

  background-color: var(--color-bg-secondary);

  animation-duration: 0.4s;
  animation-name: moveIn;
}

.bg {
  @extend .background-blur;
}

@keyframes moveIn {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}
</style>