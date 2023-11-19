<script setup lang='ts'>
import { ref } from 'vue';
import { genUuid } from '../scripts/UUID';
import { fetchAPI } from '../scripts/fetchAPI';
import { $API_URL } from '../plugins/vite_env';

const fetchStatus = ref<'loading' | 'completed'>();
const noURL = ref<boolean>(false);

const mediaTypes = ref({
  movie: ['mp4','avi'],
  audio: ['mp3', 'wav'],
})

const DLURL = ref<string>();
const options = ref<{
  silent: boolean;
  soundOnly: boolean;
  mediaType: string;
}>({
  silent: false,
  soundOnly: false,
  mediaType: 'mp4',
});

const fetchResponse = ref<Endpoints['youtube-dl']['res'] | undefined>();

const submit = async () => {
  fetchStatus.value = 'loading';
  fetchResponse.value = await fetchAPI('youtube-dl', {
    id: genUuid(),
    url: DLURL.value!,
    options: options.value,
  })
}
</script>

<template>
  <form class='container'>
    <fieldset>
      <legend>YouTube Downloader!</legend>
      <div class="form-group">
        <label>Download YouTube URL<i class="icon-download"></i></label>
        <input type="text" name="url" placeholder="pleace url" required v-model="DLURL" />
      </div>
      <fieldset>
        <legend>Options</legend>
        <div class="form-group">
          <label>No audio (silent): </label>
          <input type="checkbox" v-model="options.silent">
        </div>
        <div class="form-group">
          <label>Extension type:</label>
          <select
            v-model="options.mediaType"
            @change="options.soundOnly">
            <option v-for="mediaType in [...mediaTypes.audio, ...mediaTypes.movie]">{{ mediaType }}</option>
          </select>
        </div>
      </fieldset>
      <div :class="['form-group', $style.submit]">
        <button 
          class="btn btn-default"
          type="button"
          @click="DLURL ? submit() : noURL = true">Submit</button>
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
      <li><a :href="`${$API_URL}${ fetchResponse.url }`">ダウンロード</a></li>
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
