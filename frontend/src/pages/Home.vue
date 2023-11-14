<script setup lang='ts'>
import { ref } from 'vue';
import { genUuid } from '../scripts/UUID';
import { fetchAPI } from '../scripts/fetchAPI';
import { $API_URL } from '../plugins/vite_env';

const fetchStatus = ref<'loading' | 'completed'>();

const DLURL = ref<string>();
const options = ref<Record<string, boolean>>({
  soundOnly: false,
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
  <div :class="$style.head">
    <RouterLink to="/">YouTube Downloader!</RouterLink>
  </div>

  <div :class="$style.formBox">
    <form>
      <input :class="$style.inputRoot" placeholder="Download YouTube URL" v-model="DLURL" />
    </form>
    <i class="icon-download" aria-label="Download" @click="DLURL && submit()"></i>
  </div>

  <div :class="$style.optionsBox">
    <a
      @click="options.soundOnly = !options.soundOnly"
      :class="[$style.optionButton, { [$style.activeOption]: options.soundOnly }]"
      >音声のみ(WAV)</a
    >
  </div>

  <div :class="$style.mediaContainer" v-if="fetchResponse && fetchStatus == 'completed'">
    <video v-if="!options.soundOnly">
      <source :src="`${$API_URL}${fetchResponse.url}`" />
    </video>
    <div :class="$style.dataList">
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
  <div>
    <p>処理中です。</p>
  </div>
</template>

<style module lang="scss">
.head {
  display: flex;
  align-items: center;

  height: 2em;
  width: calc(100% - 2rem);

  padding: 0 1rem;
  font-size: 1.5em;

  border-bottom: solid 1px;

  a {
    color: var(--default-text-color);
    text-decoration: none;
  }
}

.formBox {
  display: flex;
  align-items: center;

  @media screen and (max-width: calc(900px * 0.6 + 1rem)){
    width: 100%;
  }

  @media screen and (min-width: calc(900px * 0.6 + 1rem + 1px)) {
    width: 60%;
    min-width: calc(900px * 0.6);
  }

  margin: 0.5rem;

  background-color: var(--secondary-bg-color);
  border-radius: var(--default-border-radius);

  form {
    display: flex;
    align-items: center;

    width: calc(100% - 4rem);
    height: fit-content;

    padding: 0 1rem;

    input {
      width: calc(100%);
      height: 2.5rem;

      padding: 0;
      margin: 0;

      font-size: 110%;

      border: none;

      background-color: var(--secondary-bg-color);
      border-radius: var(--default-border-radius);

      &:focus {
        outline: none;
      }
    }
  }

  i::before {
    margin: 0;
    padding: 0 1rem;

    text-align: center;
    font-size: 1.5rem;

    background-color: ;
  }
}

.optionsBox {
  display: flex;

  .optionButton {
    padding: 0.5rem;

    font-size: 90%;
    user-select: none;

    background-color: var(--secondary-bg-color);
    border-radius: var(--default-border-radius);
  }

  .activeOption {
    background-color: var(--tertiary-bg-color);
  }
}

.mediaContainer {
  display: flex;

  margin: 0.5rem;
  padding: 0.5rem;
  width: 80%;
  max-width: calc(1000px - 1rem);

  background-color: var(--secondary-bg-color);
  border-radius: var(--default-border-radius);

  video,
  audio {
    display: flex;
    align-items: center;

    width: 40%;
    border-radius: var(--default-border-radius);
  }

  .dataList {
    width: calc(60% - 1rem);
    padding: 0.5rem;

    p,
    a {
      margin: 0.3rem auto;
    }
  }
}

</style>
