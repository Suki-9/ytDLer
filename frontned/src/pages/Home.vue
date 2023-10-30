<script setup lang="ts">
import CustomInput from "../components/CustomInput.vue";

import { ref } from "vue";
import { genUuid } from "../scripts/UUID";
//@ts-ignore
import { $API_URL } from "../plugins/vite_env";

const DLURL = ref<string>("");
const DL_Link = ref<string>();
const submit = async () => {
  if (DLURL.value !== "") {
    DL_Link.value = await fetch(`${$API_URL}/api/youtube-dl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: genUuid(),
        url: DLURL.value,
      }),
    })
      .then(response => (response.ok ? response.json() : undefined))
      .then(data => data.DL_Link)
      .catch(() => {
        return undefined;
      });
  }
};
</script>

<template>
  <div :class="$style.head">
    <p>YouTube Downloader!</p>
  </div>
  <div :class="$style.mainContents">
    <CustomInput placeholder="Download YouTube URL" @receive="e => (DLURL = e)" :class="$style.customInput" /><a
      :class="$style.submitButton"
      @click="submit()"
      >Download</a
    >
    <a v-if="DL_Link" :href="`${$API_URL}${DL_Link}`">Download</a>
  </div>
</template>

<style module lang="scss">
.head {
  display: flex;
  align-items: center;

  height: 2em;

  padding: 0 1em;
  font-size: 1.5em;

  border-bottom: solid 1px;
}
.mainContents {
  display: flex;
  align-items: center;

  .customInput {
    width: 80%;
  }
  .submitButton {
    margin: 0.5rem 0;

    padding: 0.5rem 1rem;

    font-size: 0.8em;

    background-color: var(--secondary-bg-color);
    border-radius: var(--default-border-radius);

    &:hover {
      background-color: var(--tertiary-bg-color);
    }
  }
}
</style>
