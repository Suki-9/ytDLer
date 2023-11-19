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
const options = ref<Record<string, boolean | string>>({
  silent: false,
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
    .finally(() => fetchStatus.value = 'completed');
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
          type="submit" 
          @click="DLURL ? submit() : noURL = true">Submit</button>
      </div>
    </fieldset>
  </form>

  <div v-if="fetchResponse && fetchStatus == 'completed'">
    <video v-if="!options.soundOnly">
      <source :src="`${$API_URL}${fetchResponse.url}`" />
    </video>
    <div>
      <p>
        Title : <span>{{ fetchResponse.title ?? 'タイトルがありません' }}</span>
      </p>
      <p>
        Upload Date : <span>{{ fetchResponse.uploadDate ?? '投稿日時がありません' }}</span>
      </p>
      <p>
        View Count : <span>{{ fetchResponse.viewCount ?? '再生数がありません' }}</span>
      </p>
      <p>
        URL : <a :herf="DLURL">{{ DLURL }}</a>
      </p>
      <a
        :href="`${$API_URL}${fetchResponse.url}`"
        :download="`${fetchResponse.url}`"
        target="_blank"
        rel="noopener noreferrer"
        >Click to Download!</a
      >
    </div>
  </div>
  <p v-if="fetchStatus == 'loading'">処理中です。</p>
</template>

<style module lang="scss">
.head {
  width: 98%;

  padding: 0.5% 1%;

  color: rgb(1,1,1);
  font-size: 160%;

  border-bottom: solid 1px;
}
.dlForm {
  width: 90%!important;
  min-width: 950px;
}
.submit {
  display: flex;
  justify-content: flex-end;

  margin-top: 1%;
}
</style>
