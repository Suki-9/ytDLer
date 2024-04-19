<script setup lang="ts">
const inputValue = defineModel<boolean | undefined>({
  required: true,
});

withDefaults(defineProps<{
  name?: string,
  isDisabled?: boolean;
}>(), {
  isDisabled: false,
});
</script>

<template>
  <div :class="$style.root, { [$style.isDisable]: isDisabled }" @click="!isDisabled && (inputValue = !inputValue)">
    <span v-if="inputValue && !isDisabled" class="material-symbols-outlined">check_box</span>
    <span v-else class="material-symbols-outlined">check_box_outline_blank</span>
  </div>
</template>

<style module lang="scss">
.root {
  display: flex;

  height: fit-content;
  width: fit-content;

  &.isDisable > .material-symbols-outlined {
    color: rgb(145, 145, 145);
  }

  span {
    font-size: 1.7em;
    animation-duration: 0.6s;
    animation-name: checking;
  }
}

@keyframes checking {
  0% {
    transform: translate(1.1);
    opacity: 0;
  }

  100% {
    transform: translate(1);
    opacity: 1;
  }
}
</style>