<script setup lang="ts">
import Button from './Button.vue';
const pasteClipBoard = async () => { 
  try {
    inputText.value = await navigator.clipboard.readText();
  } catch {}
}

const inputText = defineModel<string | undefined>('text', {
  required: true,
});

defineProps<{
  placeholder?: string;
  name?: string,
}>();

</script>

<template>
  <fieldset :class="$style.root">
    <legend>
      <slot></slot>
      {{ name }}
    </legend>
    <input :class="$style.form" :placeholder="placeholder" v-model="inputText" />
    <Button :class="$style.button">
      <p><span class="material-symbols-outlined" @click="pasteClipBoard()">content_paste</span></p>
    </Button>
    <Button :class="$style.button">
      <p><span class="material-symbols-outlined" @click="inputText = ''">close</span></p>
    </Button>
  </fieldset>
</template>

<style module lang="scss">
.root {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: content-box;

  padding: 0rem 1rem 0.5rem 1rem;

  border-radius: 7px;
  border: solid 2px ;

  input {
    width: 100%;
    font-size: 1rem;

    background-color: rgba(0,0,0,0);

    &::placeholder {
      font-size: 1rem;
    }
  }

  .button {
    display: flex;
    justify-content: center;

    p {
      line-height: 0;
      span {
        padding: 0;
        margin: 0;
        font-size: 1.5rem;
      }
    }
  }
}
</style>