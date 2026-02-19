<template>
  <div class="pa-4">
    <h1 class="text-h3 text-center font-weight-bold mb-6">
      Fourier Drawing
    </h1>

    <v-row>
      <v-col cols="12" md="6">
        <MainPage
          v-model:selected-files="selectedFiles"
          :original-svg="originalSvg"
          :fourier-ready="fourierCoeffs.length > 0"
          @parse="onParse"
          @start="onStart"
        />
      </v-col>
      <v-col cols="12" md="6">
        <PreviewPage :sampled-points="sampledPoints" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainPage from '@/components/MainPage.vue'
import PreviewPage from '@/components/PreviewPage.vue'
import { computeDFT, type FourierPoint, type FourierCoeff } from '@/lib/dft'

const router = useRouter()

const selectedFiles = ref<File[]>([])
const sampledPoints = ref<FourierPoint[]>([])
const originalSvg = ref('')
const fourierCoeffs = ref<FourierCoeff[]>([])

watch(
  selectedFiles,
  () => {
    originalSvg.value = ''
    sampledPoints.value = []
    fourierCoeffs.value = []
  },
  { deep: true },
)

async function onParse(): Promise<void> {
  if (selectedFiles.value.length === 0) return

  const file = selectedFiles.value[0]
  if (!file) return

  const text = await file.text()

  originalSvg.value = text

  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'image/svg+xml')
  const pathElements = doc.querySelector('path')

  if (!pathElements) {
    alert("Can't find path element in the SVG file")
    return
  }

  const numSamples = 500
  const totalLength = pathElements.getTotalLength()
  const points: FourierPoint[] = []

  for (let i = 0; i <= numSamples; i++) {
    const distance = (i / numSamples) * totalLength
    const point = pathElements.getPointAtLength(distance)

    points.push({
      x: point.x,
      y: point.y,
    })
  }

  const sumX = points.reduce((acc, p) => acc + p.x, 0)
  const sumY = points.reduce((acc, p) => acc + p.y, 0)
  const avgX = sumX / points.length
  const avgY = sumY / points.length

  const normalizedPoints: FourierPoint[] = points.map((p) => ({
    x: p.x - avgX,
    y: p.y - avgY,
  }))

  sampledPoints.value = normalizedPoints
  fourierCoeffs.value = computeDFT(normalizedPoints)
}

function onStart(): void {
  sessionStorage.setItem('fourierCoeffs', JSON.stringify(fourierCoeffs.value))
  router.push({ name: 'animation' })
}
</script>

<style scoped>
h1 {
  letter-spacing: -0.02em;
}
</style>
