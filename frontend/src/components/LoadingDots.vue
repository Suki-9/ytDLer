<script setup lang="ts">
import { ref } from 'vue';

const dots = ref<string>('');

setInterval(async () => {
  dots.value = dots.value === '...' ? '' : dots.value + '.'
}, 1000);
</script>

<template>
  <span>{{ dots }}</span>
</template>