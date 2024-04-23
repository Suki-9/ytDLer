<script setup lang="ts">
import TextInput from '../components/TextInput.vue';
import Button from '../components/Button.vue';
import Checkbox from '../components/Checkbox.vue';
import Select from '../components/Select.vue';
import LoadingDots from '../components/LoadingDots.vue';

import { ref } from 'vue';
import { genUuid } from '../scripts/UUID';
import { transition } from '../scripts/actions.ts';
import { fetchAPI } from '../scripts/fetchAPI';
import { $API_URL } from '../plugins/vite_env';

const urlRegExp = /https:\/\/(.*\.)?(youtube.com|youtu.be).*/;
const mimeTypes = {
  audio: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg'],
  video: ['video/mp4', 'video/avi'],
} as const;
type MimeType = typeof mimeTypes[keyof typeof mimeTypes][number]

const fetchStatus = ref<'loading' | 'failed' | Endpoints['progress']['res']['status']>();
const progress = ref<number>(0);
const thumbnail = ref<string>();

const DLURL = ref<string>();
const fetchResult = ref<Endpoints['youtube-dl']['res']>();

const options = ref<{
  silent: boolean;
  mimeType:  MimeType,
}>({
  silent: false,
  mimeType: mimeTypes.video[0],
});

const submit = async () => {
  fetchStatus.value = 'loading';

  const id = genUuid();
  const result = fetchAPI('youtube-dl', {
    id: id,
    url: DLURL.value!,
    options: {
      ...options.value,
    },
  });

  const intervalID = setInterval(async () => {
    const r = await fetchAPI('progress', {
      id: id,
    });
    if (r) {
      progress.value = r.progress;
      fetchStatus.value = r.status;
    }
  }, 500);

  fetchResult.value = await result;
  fetchStatus.value = fetchResult.value
    ? 'completed'
    : 'failed';
  clearInterval(intervalID);
};
</script>

<template>
  <div class="container">
    <TextInput placeholder="Enter url" v-model:text="DLURL">
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
      <video v-if="thumbnail || fetchResult" controls>
        <source v-if="fetchResult" :src="`${$API_URL}/files/${fetchResult.url}`" />
      </video>
      <div :class="$style.datalist">
        <table v-if="fetchResult">
          <tr v-for="data in Object.entries(fetchResult)">
            <td>{{ data[0] }}</td>
            <td>{{ data[1] }}</td>
          </tr>
        </table>
        <Button type="outlined" :isDisabled="!Boolean(fetchResult)" :class="$style.button"
          :action="() => fetchResult && transition(`${$API_URL}/files/${fetchResult.url}`)">
          <p v-if="fetchResult">Download</p>
          <p v-else>
            <span>
              {{ fetchStatus }}
              <LoadingDots v-if="fetchStatus === 'loading'" />
            </span>
            <span>{{ progress }}%</span>
            <span :style="`clip-path: inset(0 ${100 - progress}% 0 0);`" :class="$style.progressBar"></span>
          </p>
        </Button>
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

.result {
  width: 100%;

  video {
    max-width: 100%;
    height: 15em;
    margin-top: 1em;

    aspect-ratio: 16 / 9;
    object-fit: contain;
  }

  table {
    width: 100%;

    padding: .4em;
    margin-top: 1em;

    border: solid 2px;
    border-radius: 7px;
  }
}

.datalist {
  .button {
    position: relative;

    @extend .flex-center;
    justify-content: space-between;

    padding: .2em .4em;
    margin-top: 1em;

    width: 100%;

    overflow: hidden;

    p {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    p > .progressBar {
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
