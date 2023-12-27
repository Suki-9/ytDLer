<script setup lang="ts">
import { ref } from 'vue';
import { genUuid } from '../scripts/UUID';
import { fetchAPI } from '../scripts/fetchAPI';
import { $API_URL } from '../plugins/vite_env';

const fetchStatus = ref<'loading' | 'completed'>();
const noURL = ref<boolean>(false);

const mimeTypes = {
  audio: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg'],
  video: ['video/mp4', 'video/avi'],
} as const;

const DLURL = ref<string>();
const options = ref<{
  silent: boolean;
  mimeType: string;
}>({
  silent: false,
  mimeType: mimeTypes.video[0],
});

const fetchResponse = ref<Endpoints['youtube-dl']['res'] | undefined>();

const submit = async () => {
  fetchStatus.value = 'loading';
  fetchResponse.value = await fetchAPI('youtube-dl', {
    id: genUuid(),
    url: DLURL.value!,
    options: {
      ...options.value,
      soundOnly: options.value.mimeType in mimeTypes.audio,
    },
  });
};
</script>

<template>
  <form class="container">
    <fieldset>
      <legend>YouTube Downloader!</legend>
      <div class="form-group">
        <label>Download YouTube URL<i class="icon-download"></i></label>
        <input type="text" name="url" placeholder="pleace url" required v-model="DLURL" />
      </div>
      <fieldset>
        <legend>Options</legend>
        <div class="form-group">
          <label>Extension type:</label>
          <select v-model="options.mimeType">
            <option v-for="mimeType in Object.values(mimeTypes).flat()">{{ mimeType }}</option>
          </select>
        </div>
        <div v-if="mimeTypes.audio.indexOf(options.mimeType as unknown as typeof mimeTypes.audio) == -1" class="form-group">
          <label>No audio (silent): </label>
          <input type="checkbox" v-model="options.silent" />
        </div>
      </fieldset>
      <div :class="['form-group', $style.submit]">
        <button class="btn btn-default" type="button" @click="DLURL ? submit() : (noURL = true)">Submit</button>
      </div>
    </fieldset>
  </form>
  <div class="container" v-if="fetchResponse">
    <video controls>
      <source :src="`${$API_URL}${fetchResponse.url}`" />
    </video>
    <ul>
      <li>{{ fetchResponse.title }}</li>
      <li>投稿日時{{ fetchResponse.uploadDate }}</li>
      <li>再生回数{{ fetchResponse.viewCount }}</li>
      <li><a :href="`${$API_URL}${fetchResponse.url}`">ダウンロード</a></li>
    </ul>
  </div>
</template>

<style module lang="scss">
.submit {
  display: flex;
  justify-content: flex-end;

  margin-top: 1%;
}
</style>
