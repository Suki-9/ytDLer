<script setup lang="ts">
import TextInput from '../components/TextInput.vue';
import Button from '../components/Button.vue';
import Checkbox from '../components/Checkbox.vue';
import Select from '../components/Select.vue';
import LoadingDots from '../components/LoadingDots.vue';

import { ref } from 'vue';
import { genUuid } from '../scripts/UUID';
import { fetchAPI } from '../scripts/fetchAPI';
import { $API_URL } from '../plugins/vite_env';

const urlRegExp = /https:\/\/(.*\.)?(youtube.com|youtu.be).*/;
const mimeTypes = {
  audio: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg'],
  video: ['video/mp4', 'video/avi'],
} as const;
type MimeType = typeof mimeTypes[keyof typeof mimeTypes][number]

const fetchStatus = ref<'loading' | 'completed'>();
const progress = ref<number>(0);
const thumbnail = ref<string>();

const DLURL = ref<string>();
const fetchResult = ref<Endpoints['youtube-dl']['res']>();

fetchResult.value = {
  url: 'dhfidushfnsduoifbnsduofnsdof',
  title: 'ちんこ出してみた',
  uploadDate: 'きのう',
  videoId: '14dsfsdfsdf',
  viewCount: 114514,
};

const options = ref<{
  silent: boolean;
  mimeType:  MimeType,
}>({
  silent: false,
  mimeType: mimeTypes.video[0],
});

const submit = async () => {
  fetchStatus.value = 'loading';
  fetchResult.value = await fetchAPI('youtube-dl', {
    id: genUuid(),
    url: DLURL.value!,
    options: {
      ...options.value,
    },
  });
};
</script>

<template>
  <div class="container">
    <TextInput placeholder="please url" v-model:text="DLURL">
      <p class="flex-center">Download YouTube URL<span class="material-symbols-outlined">download</span></p>
    </TextInput>
    <fieldset :class="$style.options">
      <legend>Options</legend>
      <div class="form-group">
        <label>Extension type:</label>
        <Select v-model="options.mimeType" :options="Object.values(mimeTypes).flat()" />
      </div>
      <div v-if="!mimeTypes.audio.some(t => t === options.mimeType)" class="form-group">
        <label>No audio (silent): </label>
        <Checkbox v-model="options.silent" />
      </div>
    </fieldset>
    <div :class="['form-group', $style.submit]">
      <Button class="btn btn-default" type="outlined" :isDisabled="!Boolean(DLURL?.match(urlRegExp))" :action="submit">
        Submit
      </Button>
    </div>
    <div v-if="fetchStatus" :class="['container', $style.result]">
      <video v-if="thumbnail" :poster="`${$API_URL}${thumbnail}`" controls>
        <source v-if="fetchResult" :src="`${$API_URL}${fetchResult.url}`" />
      </video>
      <div :class="$style.datalist">
        <p v-if="!fetchResult">Download</p>
        <p v-else>
          <span>Processing
            <LoadingDots />
          </span>
          <span>{{ progress }}%</span>
          <span :style="`clip-path: inset(0 ${100 - progress}% 0 0);`" :class="$style.progressBar"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import '../styles/common.scss';

.options {
  & > div {
    justify-content: space-between;
    flex-direction: row;
  }
}

.submit {
  display: flex;
  justify-content: flex-end;
  margin-top: 1%;
}


.datalist {
  p {
    position: relative;

    @extend .flex-center;
    justify-content: space-between;
    padding: .2em .4em;

    border: solid 1px;
    border-radius: 7px;

    overflow: hidden;

    .progressBar {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      content: "";
      background-color: color-mix(in srgb, var(--color-accent) 30%, rgba(0,0,0,0));

      transition: clip-path 0.2s ease-out;
    }
  }
}
</style>
