<template>
  <v-app>
    <v-main>
      <div class="pa-4">
        <h1 class="text-h3 text-center font-weight-bold mb-6">
          Fourier Drawing
        </h1>

        <v-row>
          <v-col cols="12" md="6">
            <MainPage
              v-model:selected-files="selectedFiles"
              :original-svg="originalSvg"
              @parse="onParse"
            />
          </v-col>
          <v-col cols="12" md="6">
            <PreviewPage :sampled-points="sampledPoints" />
          </v-col>
        </v-row>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch } from "vue";
import MainPage from "./components/MainPage.vue";
import PreviewPage from "./components/PreviewPage.vue";

const selectedFiles = ref([]);
const sampledPoints = ref([]);
const originalSvg = ref("");

watch(
  selectedFiles,
  () => {
    originalSvg.value = "";
  },
  { deep: true },
);

async function onParse() {
  if (selectedFiles.value.length === 0) return;

  const file = selectedFiles.value[0];
  const text = await file.text();

  originalSvg.value = text;

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "image/svg+xml");
  const pathElements = doc.querySelector("path");

  if (!pathElements) {
    alert("Can't find path element in the SVG file");
    return;
  }

  const numSamples = 500;
  const totalLength = pathElements.getTotalLength();
  const points = [];

  for (let i = 0; i <= numSamples; i++) {
    const distance = (i / numSamples) * totalLength;
    const point = pathElements.getPointAtLength(distance);

    points.push({
      x: point.x,
      y: point.y,
    });
  }

  sampledPoints.value = points;
  console.log(sampledPoints.value);
}
</script>

<style scoped>
h1 {
  letter-spacing: -0.02em;
}
</style>
