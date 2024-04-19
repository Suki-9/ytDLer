<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  action?: () => unknown;
  isDisabled?: boolean;
  text?: string;
  type?: 'outlined' | 'text',
}>(), {
  action: () => {},
  isDisabled: false,
  type: 'text',
});

const elem = ref<HTMLInputElement>();

onMounted(() => {
  elem.value?.addEventListener('click', (e) => {
    if (!props.isDisabled && elem.value) {
      props.action();

      const effElem = document.createElement("span");

      effElem.style.top = `${e.offsetY - 75}px`;
      effElem.style.left = `${e.offsetX - 75}px`;

      elem.value.appendChild(effElem);

      setTimeout(() => effElem && elem.value?.removeChild(effElem), 1200);
    }
  });
});

onUnmounted(() => document.removeEventListener('click', () => {}));
</script>

<template>
  <button ref="elem" type="button" :class="[$style.root, $style[type], { [$style.isDisable]: isDisabled }]">
    <slot v-if="!text"></slot>
    <p v-else>{{ text }}</p>
  </button>
</template>

<style module lang="scss">
.root {
  &.isDisable {
    color: var(--color-font-tertiary);
  }

  &:active {
    transform: scale(0.95);
    &.isDisable {
      transform: scale(1);
    }
  }

  position: relative;

  font-family: "Zen Maru Gothic", sans-serif;
  font-size: 1em;
  padding: .4em;

  width: fit-content;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;

  background-color: rgba(0,0,0,0);

  border: none;

  &.outlined {
    border: solid 1px;
  }
  border-radius: 7px;

  & > span {
    width: 150px;
    height: 150px;

    position: absolute;
    border-radius: 100%;
    pointer-events: none;
    transform: scale(0);
    opacity: 0;
    animation: ripple .7s ease-out;

    background-color: color-mix(in srgb, rgb(0,0,0) 20%, rgba(0, 0, 0, 0));
  }
}

@keyframes ripple {
  from {
    opacity: 1;
  }

  to {
    transform: scale(2);
    opacity: 0;
  }
}
</style>