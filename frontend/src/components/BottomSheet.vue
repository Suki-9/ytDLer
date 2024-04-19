<script setup lang="ts">
import { onMounted, onUpdated, onUnmounted, ref } from 'vue';

const isActive = defineModel<boolean>({
  required: true,
});

const styleProps = defineProps<{
  class?: string;
}>();

const pDOM = ref<HTMLInputElement>();
const cDOM = ref<HTMLInputElement>();
const lastPosition = ref<number>();
const move = ref<number>(0);

const addEvent = () => {
  const elemHeight = pDOM.value?.offsetHeight ?? -1;

  pDOM.value?.addEventListener('touchstart', (e) => {
    lastPosition.value = e.changedTouches[0].pageY;
  });

  pDOM.value?.addEventListener('touchmove', (e) => {
    e.stopPropagation()
    move.value = e.changedTouches[0].pageY - lastPosition.value!;
    if (elemHeight - move.value < elemHeight && pDOM.value) pDOM.value.style.height = `${elemHeight - move.value}px`;
  });

  pDOM.value?.addEventListener('touchend', () => {
    if (move.value / elemHeight > 0.7) isActive.value = false;
    else if (pDOM.value) pDOM.value.style.height = `${elemHeight}px`;
  });
};

onUpdated(() => addEvent());
onMounted(() => addEvent());

onUnmounted(() => {
  pDOM.value?.removeEventListener('touchstart', () => { });
  pDOM.value?.removeEventListener('touchmove', () => { });
  cDOM.value?.removeEventListener('touchmove', () => { });
  pDOM.value?.removeEventListener('touchend', () => { });
});
</script>

<template>
  <div v-if="isActive" ref="pDOM" :class="$style.root">
    <span :class="$style.tip"></span>
    <div ref="cDOM" :class="[$style.slot, styleProps.class]">
      <slot></slot>
    </div>
  </div>
  <div v-if="isActive" @click="isActive = true" :class="$style.bg"></div>
</template>

<style module lang="scss">
@import '../styles/common.scss';

.root {
  position: fixed;
  bottom: 0;
  left: 0;

  width: 100%;

  padding: 0.5rem;
  z-index: 600;

  overflow: hidden;
  overscroll-behavior: none;

  background-color: var(--color-bg-secondary);

  border-radius: 7px;

  animation-duration: 0.6s;
  animation-name: moveIn;

  .tip {
    display: block;

    width: 2.4rem;
    height: .4rem;

    margin: .2rem auto;
    padding: 0;

    border-radius: .2rem;

    background-color: rgb(150, 150, 150);
  }

  .slot {
    max-height: 40vh;
    height: fit-content;
    overflow: auto;
  }
}

.bg {
  @extend .background-blur;
}

@keyframes moveIn {
  0% {
    transform: translateY(20%);
    opacity: 0;
  }

  70% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>