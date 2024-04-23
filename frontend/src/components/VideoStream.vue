<script setup lang="ts">
import Hls from 'hls.js';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  src: string,
}>();

const video = ref<HTMLMediaElement>();

onMounted(() => {
  if (Hls.isSupported() && video.value) {
    const hls = new Hls();
    hls.loadSource(props.src);
    hls.attachMedia(video.value);
  }
})
</script>

<template>
  <video ref="video" controls>
    <slot></slot>
  </video>
</template>