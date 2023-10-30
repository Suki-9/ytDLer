<script setup lang="ts">
//TS Module ------------------------------------------------------///
import { ref } from "vue";

const inputText = ref<string>("");

const emit = defineEmits<{ (e: "receive", text: string): string }>();
defineProps<{
  placeholder: string;
  datalist?: string[];
}>();
</script>

<template>
  <div :class="$style.root">
    <input
      :class="$style.form"
      :placeholder="placeholder"
      v-model="inputText"
      :list="placeholder"
      @input="emit('receive', inputText)"
    />
    <datalist :id="placeholder">
      <option v-for="genre in datalist" :value="genre"></option>
    </datalist>
    <i class="icon-cancel" @click="inputText = ''"></i>
  </div>
</template>

<style module lang="scss">
.root {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  margin: 0.5rem;

  input {
    width: 100%;

    padding: 0.5rem 1rem;

    color: var(--primary-text-color);
    font-size: 1em;

    border: none;

    background-color: var(--secondary-bg-color);

    border-radius: var(--default-border-radius);

    &:focus {
      outline: none;
    }
  }
}
</style>
