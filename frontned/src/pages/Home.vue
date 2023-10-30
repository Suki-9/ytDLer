<script setup lang="ts">
import { ref } from "vue";
import { genUuid } from "../scripts/UUID";
//@ts-ignore
import { $API_URL } from "../plugins/vite_env";

const DLURL = ref<string>('');
const fetchResponse = ref();
const submit = async () => {
  if (DLURL.value !== "") {
    fetchResponse.value = await fetch(`${$API_URL}/api/youtube-dl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: genUuid(),
        url: DLURL.value,
      }),
    })
      .then(response => (response.ok ? response.json() : undefined))
      .then(data => data)
      .catch(() => {
        return undefined;
      });
  }
};
</script>

<template>
  <div :class="$style.head">
    <RouterLink to="/">YouTube Downloader!</RouterLink>
  </div>

  <div :class="$style.mainContents">
    <form>
      <input
        :class="$style.inputRoot"
        placeholder="Download YouTube URL"
        v-model="DLURL"
      />
    </form>
    <i class="icon-download" aria-label="Download" @click="submit()"></i>
  </div>

  <div :class="$style.videoContainer" v-if="fetchResponse">
    <video>
      <source :src="`${$API_URL}${fetchResponse.url}`" />
    </video>
    <div :class="$style.dataList">
      <p>タイトル : <span>{{ "タイトルがありません" }}</span></p>
      <p>投稿日時 : <span>{{ "投稿日時がありません" }}</span></p>
      <p>再生数 : <span>{{ "再生数がありません" }}</span></p>
      <p>URL : <a :herf="DLURL">{{ DLURL }}</a></p>
      <a :herf="`${$API_URL}${fetchResponse.url}`">Download</a>
    </div>
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
.mainContents {
  display: flex;
  align-items: center;

  width: 60%;

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
  }
}
.videoContainer {
  display: flex;

  margin: 0.5rem;
  padding: 0.5rem;
  width: 80%;
  max-width: calc(1000px - 1rem);

  background-color: var(--secondary-bg-color);
  border-radius: var(--default-border-radius);
  video {
    width: 40%;
    border-radius: var(--default-border-radius);
  }
  .dataList {
    width: calc(60% - 1rem);
    padding: 0.5rem;
    p,a {
      margin: 0.3rem auto;
    }
  }
}
</style>
