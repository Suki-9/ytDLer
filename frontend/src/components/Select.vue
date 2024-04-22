<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BottomSheet from './BottomSheet.vue';

const device = navigator.userAgent.match(/iPhone|Android.+Mobile/) ? 'mobile' :  'pc';
const isActive = ref<boolean>(false);
const inputValue = defineModel<string | undefined>({
  required: true,
});

withDefaults(defineProps<{
  options?: string[],
}>(), {
  options: () => new Array<string>(),
});

const root = ref<HTMLElement>();
const list = ref<HTMLElement>();

onMounted(() => {
  if (list.value) {
    list.value.style.top = `${root.value?.offsetHeight ?? 0}px`;
    list.value.style.width = `${root.value?.offsetWidth ?? 0}px`;
  }
});
onUnmounted(() => window.removeEventListener('click', () => { }));
</script>

<template>
  <ul v-if="device == 'mobile'" @click="isActive = !isActive" :class="$style.mobile">
    <p>{{ inputValue }} ▼</p>
    <BottomSheet v-model="isActive" :class="$style.list">
      <li v-for="option in options" @click="inputValue = option">{{ option }}</li>
    </BottomSheet>
  </ul>
  <div v-else :class="$style.pc" ref="root">
    <p @click="isActive = !isActive">{{ inputValue }} ▼</p>
    <div v-show="isActive" :class="$style.list" ref="list">
      <p v-for="option in options" @click="(inputValue = option, isActive = false)">{{ option }}</p>
    </div>
    <div v-if="isActive" @click="isActive = false" :class="$style.bg"></div>
  </div>
</template>

<style module lang="scss">
@import '../styles/common.scss';

.mobile {
  display: flex;
  align-items: center;

  width: fit-content;

  margin: 0;
  padding: 0.1rem 0.5rem;

  border: solid 1px;
  border-radius: 7px;

  user-select: none;

  select {
    appearance: none;
    vertical-align: middle;
  }

  p {
    margin-left: 0.5rem;
    font-size: 0.9rem;
  }

  .list {
    li {
      font-size: 1.1rem;
      padding: .5rem 0;
      &:not(:last-child) {
        border-bottom: solid 1px rgb(220, 220, 220);
      }
    }
  }
}

.pc {
  position: relative;

  display: flex;

  margin: 0;
  padding: 0.1rem 0.5rem;

  border: solid 1px;
  border-radius: 7px;

  user-select: none;

  .list {
    position: absolute;
    top: 0px;
    left: 0px;

    display: flex;
    flex-direction: column;

    z-index: 1000;

    border: solid 1px;
    border-radius: 7px;

    padding: 0.1rem 0.5rem;

    background-color: var(--color-bg-primary);

    animation-duration: 0.2s;
    animation-name: moveIn;
  }
}

.bg {
  @extend .background-blur;
}

@keyframes moveIn {
  0% {
    clip-path: inset(0 0 100% 0);
  }

  100% {
    clip-path: inset(0 0 0 0);
  }
}
</style>